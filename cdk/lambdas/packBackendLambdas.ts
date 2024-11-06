import {
  packLambdaFromPath,
  type PackedLambda,
} from "@bifravst/aws-cdk-lambda-helpers";

export type BackendLambdas = {
  requestToken: PackedLambda;
  confirmEmail: PackedLambda;
  register: PackedLambda;
  generateThumbnail: PackedLambda;
  listPublicProfiles: PackedLambda;
  listParticipantEmails: PackedLambda;
  onPublish: PackedLambda;
};

const pack = async (id: string) => packLambdaFromPath(id, `lambdas/${id}.ts`);

export const packBackendLambdas = async (): Promise<BackendLambdas> => ({
  requestToken: await pack("requestToken"),
  confirmEmail: await pack("confirmEmail"),
  register: await pack("register"),
  generateThumbnail: await pack("generateThumbnail"),
  listPublicProfiles: await pack("listPublicProfiles"),
  listParticipantEmails: await pack("listParticipantEmails"),
  onPublish: await pack("onPublish"),
});
