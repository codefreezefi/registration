import { App } from "aws-cdk-lib";
import { BackendStack } from "./BackendStack.js";

export class BackendApp extends App {
  public constructor(
    stackName: string,
    args: ConstructorParameters<typeof BackendStack>[2],
  ) {
    super();
    new BackendStack(this, stackName, args);
  }
}
