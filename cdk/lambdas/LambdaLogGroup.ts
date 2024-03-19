import { Construct } from "constructs";
import { aws_logs as Logs, Names, RemovalPolicy, Stack } from "aws-cdk-lib";

export class LambdaLogGroup extends Construct {
  public readonly logGroup: Logs.LogGroup;
  constructor(
    parent: Construct,
    id: string,
    retention = Logs.RetentionDays.ONE_WEEK
  ) {
    super(parent, id);
    this.logGroup = new Logs.LogGroup(this, "logGroup", {
      retention,
      logGroupName: `/${Stack.of(this).stackName}/fn/${id}-${Names.uniqueId(
        this
      )}`,
      logGroupClass: Logs.LogGroupClass.STANDARD,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
