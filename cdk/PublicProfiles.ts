import {
  Duration,
  aws_lambda as Lambda,
  RemovalPolicy,
  aws_lambda_event_sources as EventSources,
  aws_s3 as S3,
  aws_dynamodb as DynamoDB,
  aws_iam as IAM,
} from "aws-cdk-lib";
import type { ILayerVersion } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import type { Registrations } from "./Registrations.js";
import { LambdaLogGroup } from "./lambdas/LambdaLogGroup.js";
import { LambdaSource } from "./lambdas/LambdaSource.js";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.js";

export class PublicProfiles extends Construct {
  public readonly listPublicProfilesURL: Lambda.IFunctionUrl;
  constructor(
    parent: Construct,
    {
      lambdas,
      registrations,
      imageMagickLayer,
      layer,
    }: {
      lambdas: BackendLambdas;
      registrations: Registrations;
      layer: ILayerVersion;
      imageMagickLayer: Lambda.ILayerVersion;
    }
  ) {
    super(parent, "publicProfiles");

    // This bucket stores the profile images
    const imagesBucket = new S3.Bucket(this, "imagesBucket", {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: {
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
        blockPublicPolicy: false,
      },
      objectOwnership: S3.ObjectOwnership.OBJECT_WRITER,
    });

    const generateThumbnail = new Lambda.Function(this, "generateThumbnailFn", {
      architecture: Lambda.Architecture.ARM_64,
      runtime: Lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      memorySize: 1792,
      handler: lambdas.generateThumbnail.handler,
      code: new LambdaSource(this, lambdas.generateThumbnail).code,
      ...new LambdaLogGroup(this, "generateThumbnailFnLogs"),
      environment: {
        REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
        IMAGES_BUCKET_NAME: imagesBucket.bucketName,
      },
      layers: [layer, imageMagickLayer],
    });

    registrations.registrationsTable.grantWriteData(generateThumbnail);
    imagesBucket.grantWrite(generateThumbnail);

    generateThumbnail.addEventSource(
      new EventSources.DynamoEventSource(registrations.registrationsTable, {
        startingPosition: Lambda.StartingPosition.LATEST,
      })
    );

    // List public profiles
    const publicProfilesByCodefreezeIndexName = "publicProfilesByCodefreeze";
    registrations.registrationsTable.addGlobalSecondaryIndex({
      indexName: publicProfilesByCodefreezeIndexName,
      partitionKey: {
        name: "codefreeze",
        type: DynamoDB.AttributeType.NUMBER,
      },
      sortKey: {
        name: "id",
        type: DynamoDB.AttributeType.STRING,
      },
      projectionType: DynamoDB.ProjectionType.INCLUDE,
      nonKeyAttributes: [
        "github",
        "homepage",
        "linkedin",
        "mastodon",
        "matrix",
        "name",
        "photoThumbnail",
        "pronouns",
      ],
    });

    const listPublicProfilesFn = new Lambda.Function(
      this,
      "listPublicProfilesFn",
      {
        architecture: Lambda.Architecture.ARM_64,
        runtime: Lambda.Runtime.NODEJS_20_X,
        timeout: Duration.seconds(10),
        memorySize: 1792,
        handler: lambdas.listPublicProfiles.handler,
        code: new LambdaSource(this, lambdas.listPublicProfiles).code,
        initialPolicy: [
          new IAM.PolicyStatement({
            actions: ["ses:SendEmail"],
            resources: ["*"],
          }),
        ],
        ...new LambdaLogGroup(this, "listPublicProfilesFnLogs"),
        environment: {
          REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
          PUBLIC_PROFILES_BY_CODEFREEZE_INDEX_NAME:
            publicProfilesByCodefreezeIndexName,
        },
        layers: [layer],
      }
    );

    this.listPublicProfilesURL = listPublicProfilesFn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });

    registrations.registrationsTable.grantReadData(listPublicProfilesFn);
  }
}
