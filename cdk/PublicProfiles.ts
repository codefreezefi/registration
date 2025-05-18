import { PackedLambdaFn } from '@bifravst/aws-cdk-lambda-helpers/cdk'
import {
	Duration,
	aws_dynamodb as DynamoDB,
	aws_lambda_event_sources as EventSources,
	aws_iam as IAM,
	aws_lambda as Lambda,
	RemovalPolicy,
	aws_s3 as S3,
} from 'aws-cdk-lib'
import type { ILayerVersion } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import type { BackendLambdas } from './lambdas/packBackendLambdas.ts'
import type { Registrations } from './Registrations.ts'

export class PublicProfiles extends Construct {
	public readonly listPublicProfilesURL: Lambda.IFunctionUrl
	constructor(
		parent: Construct,
		{
			lambdas,
			registrations,
			imageMagickLayer,
			layer,
		}: {
			lambdas: BackendLambdas
			registrations: Registrations
			layer: ILayerVersion
			imageMagickLayer: Lambda.ILayerVersion
		},
	) {
		super(parent, 'publicProfiles')

		// This bucket stores the profile images
		const imagesBucket = new S3.Bucket(this, 'imagesBucket', {
			publicReadAccess: true,
			removalPolicy: RemovalPolicy.DESTROY,
			blockPublicAccess: {
				blockPublicAcls: false,
				ignorePublicAcls: false,
				restrictPublicBuckets: false,
				blockPublicPolicy: false,
			},
			objectOwnership: S3.ObjectOwnership.OBJECT_WRITER,
		})

		const generateThumbnail = new PackedLambdaFn(
			this,
			'generateThumbnailFn',
			lambdas.generateThumbnail,
			{
				timeout: Duration.seconds(10),
				environment: {
					REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
					IMAGES_BUCKET_NAME: imagesBucket.bucketName,
				},
				layers: [layer, imageMagickLayer],
			},
		)

		registrations.registrationsTable.grantWriteData(generateThumbnail.fn)
		imagesBucket.grantWrite(generateThumbnail.fn)

		generateThumbnail.fn.addEventSource(
			new EventSources.DynamoEventSource(registrations.registrationsTable, {
				startingPosition: Lambda.StartingPosition.LATEST,
			}),
		)

		// List public profiles
		const publicProfilesByCodefreezeIndexName = 'publicProfilesByCodefreeze'
		registrations.registrationsTable.addGlobalSecondaryIndex({
			indexName: publicProfilesByCodefreezeIndexName,
			partitionKey: {
				name: 'codefreeze',
				type: DynamoDB.AttributeType.NUMBER,
			},
			sortKey: {
				name: 'id',
				type: DynamoDB.AttributeType.STRING,
			},
			projectionType: DynamoDB.ProjectionType.INCLUDE,
			nonKeyAttributes: [
				'github',
				'homepage',
				'linkedin',
				'mastodon',
				'matrix',
				'name',
				'photoThumbnail',
				'pronouns',
				'publicProfile',
			],
		})

		const listPublicProfilesFn = new PackedLambdaFn(
			this,
			'listPublicProfilesFn',
			lambdas.listPublicProfiles,
			{
				environment: {
					REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
					PUBLIC_PROFILES_BY_CODEFREEZE_INDEX_NAME:
						publicProfilesByCodefreezeIndexName,
				},
				layers: [layer],
			},
		)

		this.listPublicProfilesURL = listPublicProfilesFn.fn.addFunctionUrl({
			authType: Lambda.FunctionUrlAuthType.NONE,
		})

		registrations.registrationsTable.grantReadData(listPublicProfilesFn.fn)

		// Send notification when profile is published
		const onPublish = new PackedLambdaFn(
			this,
			'onPublishFn',
			lambdas.onPublish,
			{
				environment: {
					REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
					IMAGES_BUCKET_NAME: imagesBucket.bucketName,
				},
				layers: [layer],
				initialPolicy: [
					new IAM.PolicyStatement({
						actions: ['ses:SendEmail'],
						resources: ['*'],
					}),
				],
			},
		)

		onPublish.fn.addEventSource(
			new EventSources.DynamoEventSource(registrations.registrationsTable, {
				startingPosition: Lambda.StartingPosition.LATEST,
			}),
		)
	}
}
