import { PackedLambdaFn } from '@bifravst/aws-cdk-lambda-helpers/cdk'
import { aws_iam as IAM, aws_lambda as Lambda } from 'aws-cdk-lib'
import type { ILayerVersion } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import type { BackendLambdas } from './lambdas/packBackendLambdas.ts'
import type { Registrations } from './Registrations.ts'

export class Register extends Construct {
	public readonly registerURL: Lambda.IFunctionUrl
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
		super(parent, 'register')

		const registerFn = new PackedLambdaFn(
			this,
			'registerFn',
			lambdas.register,
			{
				initialPolicy: [
					new IAM.PolicyStatement({
						actions: ['ses:SendEmail'],
						resources: ['*'],
					}),
				],
				environment: {
					EMAILS_TABLE_NAME: registrations.emailsTable.tableName,
					REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
				},
				layers: [layer],
			},
		)

		this.registerURL = registerFn.fn.addFunctionUrl({
			authType: Lambda.FunctionUrlAuthType.NONE,
		})

		registrations.emailsTable.grantReadData(registerFn.fn)
		registrations.registrationsTable.grantWriteData(registerFn.fn)
	}
}
