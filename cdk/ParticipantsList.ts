import { PackedLambdaFn } from "@bifravst/aws-cdk-lambda-helpers/cdk";
import { aws_dynamodb as DynamoDB, aws_lambda as Lambda } from "aws-cdk-lib";
import type { ILayerVersion } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import type { BackendLambdas } from './lambdas/packBackendLambdas.ts';
import type { Registrations } from './Registrations.ts';

export class ParticipantsList extends Construct {
  public readonly listParticipantEmailsURL: Lambda.IFunctionUrl;
  constructor(
    parent: Construct,
    {
      lambdas,
      registrations,
      layer,
    }: {
      lambdas: BackendLambdas;
      registrations: Registrations;
      layer: ILayerVersion;
    }
  ) {
    super(parent, "ParticipantsList");

    // List participant emails
    const participantsByCodefreezeIndexName = "participantsByCodefreeze";
    registrations.registrationsTable.addGlobalSecondaryIndex({
      indexName: participantsByCodefreezeIndexName,
      partitionKey: {
        name: "codefreeze",
        type: DynamoDB.AttributeType.NUMBER,
      },
      sortKey: {
        name: "id",
        type: DynamoDB.AttributeType.STRING,
      },
      projectionType: DynamoDB.ProjectionType.INCLUDE,
      nonKeyAttributes: ["name", "email"],
    });

    const listParticipantEmailsFn = new PackedLambdaFn(
      this,
      "listParticipantEmailsFn",
      lambdas.listParticipantEmails,
      {
        environment: {
          REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
          PARTICIPANTS_BY_CODEFREEZE_INDEX_NAME:
            participantsByCodefreezeIndexName,
        },
        layers: [layer],
      }
    );

    this.listParticipantEmailsURL = listParticipantEmailsFn.fn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });

    registrations.registrationsTable.grantReadData(listParticipantEmailsFn.fn);
  }
}
