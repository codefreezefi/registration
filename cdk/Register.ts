import { Construct } from "constructs";
import { Duration, aws_lambda as Lambda, aws_iam as IAM } from "aws-cdk-lib";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.js";
import { LambdaSource } from "./lambdas/LambdaSource.js";
import { LambdaLogGroup } from "./lambdas/LambdaLogGroup.js";
import type { Registrations } from "./Registrations.js";
import type { ILayerVersion } from "aws-cdk-lib/aws-lambda";

export class Register extends Construct {
  public readonly registerURL: Lambda.IFunctionUrl;
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
    },
  ) {
    super(parent, "register");

    const registerFn = new Lambda.Function(this, "registerFn", {
      architecture: Lambda.Architecture.ARM_64,
      runtime: Lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      memorySize: 1792,
      handler: lambdas.register.handler,
      code: new LambdaSource(this, lambdas.register).code,
      initialPolicy: [
        new IAM.PolicyStatement({
          actions: ["ses:SendEmail"],
          resources: ["*"],
        }),
      ],
      ...new LambdaLogGroup(this, "registerFnLogs"),
      environment: {
        EMAILS_TABLE_NAME: registrations.emailsTable.tableName,
        REGISTRATIONS_TABLE_NAME: registrations.registrationsTable.tableName,
      },
      layers: [layer],
    });

    this.registerURL = registerFn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });

    registrations.emailsTable.grantReadData(registerFn);
    registrations.registrationsTable.grantWriteData(registerFn);
  }
}
