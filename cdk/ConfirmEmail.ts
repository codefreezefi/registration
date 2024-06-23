import { Construct } from "constructs";
import { Duration, aws_lambda as Lambda, aws_iam as IAM } from "aws-cdk-lib";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.js";
import { LambdaSource } from "./lambdas/LambdaSource.js";
import { LambdaLogGroup } from "./lambdas/LambdaLogGroup.js";
import type { Registrations } from "./Registrations.js";
import type { ILayerVersion } from "aws-cdk-lib/aws-lambda";

export class ConfirmEmail extends Construct {
  public readonly requestTokenURL: Lambda.IFunctionUrl;
  public readonly confirmEmailURL: Lambda.IFunctionUrl;
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
    super(parent, "confirm-email");

    const requestTokenFn = new Lambda.Function(this, "requestTokenFn", {
      architecture: Lambda.Architecture.ARM_64,
      runtime: Lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      memorySize: 1792,
      handler: lambdas.requestToken.handler,
      code: new LambdaSource(this, lambdas.requestToken).code,
      initialPolicy: [
        new IAM.PolicyStatement({
          actions: ["ses:SendEmail"],
          resources: ["*"],
        }),
      ],
      ...new LambdaLogGroup(this, "requestTokenFnLogs"),
      environment: {
        EMAILS_TABLE_NAME: registrations.emailsTable.tableName,
      },
      layers: [layer],
    });

    this.requestTokenURL = requestTokenFn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });

    registrations.emailsTable.grantReadWriteData(requestTokenFn);

    const confirmEmailFn = new Lambda.Function(this, "confirmEmailFn", {
      architecture: Lambda.Architecture.ARM_64,
      runtime: Lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      memorySize: 1792,
      handler: lambdas.confirmEmail.handler,
      code: new LambdaSource(this, lambdas.confirmEmail).code,
      ...new LambdaLogGroup(this, "confirmEmailFnLogs"),
      environment: {
        EMAILS_TABLE_NAME: registrations.emailsTable.tableName,
      },
      layers: [layer],
    });

    this.confirmEmailURL = confirmEmailFn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });

    registrations.emailsTable.grantReadData(confirmEmailFn);
  }
}
