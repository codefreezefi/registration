import { App } from "aws-cdk-lib";
import { BackendStack } from "./BackendStack.js";
import type { BackendLambdas } from "./lambdas/packBackendLambdas.ts";

export class BackendApp extends App {
  public constructor(stackName: string, lambdas: BackendLambdas) {
    super();
    new BackendStack(this, stackName, lambdas);
  }
}
