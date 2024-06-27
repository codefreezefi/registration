import { packLambdaFromPath, type PackedLambda } from "./packLambdaFromPath.js";

export type BackendLambdas = {
  requestToken: PackedLambda;
  confirmEmail: PackedLambda;
  register: PackedLambda;
  generateThumbnail: PackedLambda;
  listPublicProfiles: PackedLambda;
  onPublish: PackedLambda;
};

export const packBackendLambdas = async (): Promise<BackendLambdas> => ({
  requestToken: await packLambdaFromPath("requestToken"),
  confirmEmail: await packLambdaFromPath("confirmEmail"),
  register: await packLambdaFromPath("register"),
  generateThumbnail: await packLambdaFromPath("generateThumbnail"),
  listPublicProfiles: await packLambdaFromPath("listPublicProfiles"),
  onPublish: await packLambdaFromPath("onPublish"),
});
