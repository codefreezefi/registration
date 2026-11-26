import { PackedLambdaFn } from '@bifravst/aws-cdk-lambda-helpers/cdk'
import {
	aws_lambda_event_sources as EventSources,
	aws_iam as IAM,
	aws_lambda as Lambda,
} from 'aws-cdk-lib'
import type { ILayerVersion } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import type { BackendLambdas } from './lambdas/packBackendLambdas.ts'
import type { Registrations } from './Registrations.ts'

/**
 * Sends a notification email to the participant when their registration is deleted.
 */
export class DeletionNotification extends Construct {
	constructor(
		parent: Construct,
		{
			lambdas,
			registrations,
			layer,
		}: {
			lambdas: BackendLambdas
			registrations: Registrations
			layer: ILayerVersion
		},
	) {
		super(parent, 'deletionNotification')

		const onDelete = new PackedLambdaFn(this, 'onDeleteFn', lambdas.onDelete, {
			layers: [layer],
			initialPolicy: [
				new IAM.PolicyStatement({
					actions: ['ses:SendEmail'],
					resources: ['*'],
				}),
			],
		})

		onDelete.fn.addEventSource(
			new EventSources.DynamoEventSource(registrations.registrationsTable, {
				startingPosition: Lambda.StartingPosition.LATEST,
				filters: [
					Lambda.FilterCriteria.filter({
						eventName: Lambda.FilterRule.isEqual('REMOVE'),
						dynamodb: {
							OldImage: {
								email: { S: Lambda.FilterRule.exists() },
							},
						},
					}),
				],
			}),
		)
	}
}
