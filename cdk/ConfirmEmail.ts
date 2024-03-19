import { Construct } from "constructs";
import { Duration, aws_lambda as Lambda, aws_iam as IAM } from "aws-cdk-lib";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.ts";
import { LambdaSource } from "./lambdas/LambdaSource.ts";
import { LambdaLogGroup } from "./lambdas/LambdaLogGroup.ts";

export class ConfirmEmail extends Construct {
  public readonly requestTokenURL: Lambda.IFunctionUrl;
  public readonly confirmEmailURL: Lambda.IFunctionUrl;
  constructor(
    parent: Construct,
    {
      lambdas,
    }: {
      lambdas: BackendLambdas;
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
    });

    this.requestTokenURL = requestTokenFn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });

    const confirmEmailFn = new Lambda.Function(this, "confirmEmailFn", {
      architecture: Lambda.Architecture.ARM_64,
      runtime: Lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      memorySize: 1792,
      handler: lambdas.confirmEmail.handler,
      code: new LambdaSource(this, lambdas.confirmEmail).code,
      ...new LambdaLogGroup(this, "confirmEmailFnLogs"),
    });

    this.confirmEmailURL = confirmEmailFn.addFunctionUrl({
      authType: Lambda.FunctionUrlAuthType.NONE,
    });
  }
}
