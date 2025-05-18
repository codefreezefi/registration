import { PackedLambdaFn } from '@bifravst/aws-cdk-lambda-helpers/cdk'
import { aws_iam as IAM, aws_lambda as Lambda } from 'aws-cdk-lib'
import type { ILayerVersion } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import type { BackendLambdas } from './lambdas/packBackendLambdas.ts'
import type { Registrations } from './Registrations.ts'

export class ConfirmEmail extends Construct {
	public readonly requestTokenURL: Lambda.IFunctionUrl
	public readonly confirmEmailURL: Lambda.IFunctionUrl
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
		super(parent, 'confirm-email')

		const requestTokenFn = new PackedLambdaFn(
			this,
			'requestTokenFn',
			lambdas.requestToken,
			{
				initialPolicy: [
					new IAM.PolicyStatement({
						actions: ['ses:SendEmail'],
						resources: ['*'],
					}),
				],
				environment: {
					EMAILS_TABLE_NAME: registrations.emailsTable.tableName,
				},
				layers: [layer],
			},
		)

		this.requestTokenURL = requestTokenFn.fn.addFunctionUrl({
			authType: Lambda.FunctionUrlAuthType.NONE,
		})

		registrations.emailsTable.grantReadWriteData(requestTokenFn.fn)

		const confirmEmailFn = new PackedLambdaFn(
			this,
			'confirmEmailFn',
			lambdas.confirmEmail,
			{
				environment: {
					EMAILS_TABLE_NAME: registrations.emailsTable.tableName,
				},
				layers: [layer],
			},
		)

		this.confirmEmailURL = confirmEmailFn.fn.addFunctionUrl({
			authType: Lambda.FunctionUrlAuthType.NONE,
		})

		registrations.emailsTable.grantReadData(confirmEmailFn.fn)
	}
}
