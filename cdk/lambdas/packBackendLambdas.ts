import { packLambdaFromPath, type PackedLambda } from "./packLambdaFromPath.js";

export type BackendLambdas = {
  requestToken: PackedLambda;
  confirmEmail: PackedLambda;
  register: PackedLambda;
};

export const packBackendLambdas = async (): Promise<BackendLambdas> => ({
  requestToken: await packLambdaFromPath("requestToken"),
  confirmEmail: await packLambdaFromPath("confirmEmail"),
  register: await packLambdaFromPath("register"),
});
