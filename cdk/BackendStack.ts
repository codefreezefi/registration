import {
  App,
  CfnOutput,
  Stack,
  aws_lambda as Lambda,
  aws_s3 as S3,
} from "aws-cdk-lib";
import { ConfirmEmail } from "./ConfirmEmail.js";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.js";
import { Registrations } from "./Registrations.js";
import { LambdaSource } from "@bifravst/aws-cdk-lambda-helpers/cdk";
import { Register } from "./Register.js";
import { type PackedLayer } from "@bifravst/aws-cdk-lambda-helpers/layer";
import { PublicProfiles } from "./PublicProfiles.js";
import { ParticipantsList } from "./ParticipantsList.ts";

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

    const register = new Register(this, {
      lambdas,
      registrations,
      layer,
    });

    const imageMagickLayer = new Lambda.LayerVersion(
      this,
      "imagemagick-layer",
      {
        code: Lambda.Code.fromBucket(
          S3.Bucket.fromBucketName(
            this,
            "imagemagickLayerBucket",
            // Must be in same region as the stack
            "imagemagick-layer"
          ),
          // This is created using https://github.com/CyprusCodes/imagemagick-aws-lambda-2
          "layer.zip"
        ),
      }
    );

    const publicProfiles = new PublicProfiles(this, {
      imageMagickLayer,
      lambdas,
      layer,
      registrations,
    });

    const participantsList = new ParticipantsList(this, {
      lambdas,
      layer,
      registrations,
    });

    new CfnOutput(this, "requestTokenAPI", {
      value: confirmEmail.requestTokenURL.url,
      exportName: `${this.stackName}:requestTokenAPI`,
    });

    new CfnOutput(this, "confirmEmailURL", {
      value: confirmEmail.confirmEmailURL.url,
      exportName: `${this.stackName}:confirmEmailURL`,
    });

    new CfnOutput(this, "registerURL", {
      value: register.registerURL.url,
      exportName: `${this.stackName}:registerURL`,
    });

    new CfnOutput(this, "publicProfilesURL", {
      value: publicProfiles.listPublicProfilesURL.url,
      exportName: `${this.stackName}:publicProfilesURL`,
    });

    new CfnOutput(this, "listParticipantEmailsURL", {
      value: participantsList.listParticipantEmailsURL.url,
      exportName: `${this.stackName}:listParticipantEmailsURL`,
    });
  }
}

export type StackOutputs = {
  requestTokenAPI: string;
  confirmEmailURL: string;
};
