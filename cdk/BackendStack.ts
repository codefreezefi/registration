import { App, CfnOutput, Stack, aws_lambda as Lambda } from "aws-cdk-lib";
import { ConfirmEmail } from "./ConfirmEmail.js";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.js";
import { Registrations } from "./Registrations.js";
import type { PackedLayer } from "./lambdas/packLayer.js";
import { LambdaSource } from "./lambdas/LambdaSource.js";

export class BackendStack extends Stack {
  public constructor(
    parent: App,
    stackName: string,
    {
      lambdas,
      packedLayer,
    }: { lambdas: BackendLambdas; packedLayer: PackedLayer }
  ) {
    super(parent, stackName);

    const registrations = new Registrations(this);

    const layer = new Lambda.LayerVersion(this, "layer", {
      layerVersionName: `${Stack.of(this).stackName}-layer`,
      code: new LambdaSource(this, {
        id: "layer",
        zipFile: packedLayer.layerZipFile,
        hash: packedLayer.hash,
      }).code,
      compatibleArchitectures: [Lambda.Architecture.ARM_64],
      compatibleRuntimes: [Lambda.Runtime.NODEJS_20_X],
    });

    const confirmEmail = new ConfirmEmail(this, {
      lambdas,
      registrations,
      layer,
    });

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
