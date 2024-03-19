import { App, CfnOutput, Stack } from "aws-cdk-lib";
import { ConfirmEmail } from "./ConfirmEmail.ts";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.ts";

export class BackendStack extends Stack {
  public constructor(parent: App, stackName: string, lambdas: BackendLambdas) {
    super(parent, stackName);

    const confirmEmail = new ConfirmEmail(this, { lambdas });

    new CfnOutput(this, "requestTokenAPI", {
      value: confirmEmail.requestTokenURL.url,
      exportName: `${this.stackName}:requestTokenAPI`,
    });

    new CfnOutput(this, "confirmEmailURL", {
      value: confirmEmail.confirmEmailURL.url,
      exportName: `${this.stackName}:confirmEmailURL`,
    });
  }
}

export type StackOutputs = {
  requestTokenAPI: string;
  confirmEmailURL: string;
};
