import { aws_dynamodb as DynamoDB, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

export class Registrations extends Construct {
  public readonly registrationsTable: DynamoDB.Table;
  public readonly emailsTable: DynamoDB.Table;
  public constructor(parent: Construct) {
    super(parent, "Registrations");

    this.registrationsTable = new DynamoDB.Table(this, "registrations", {
      billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: DynamoDB.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      stream: DynamoDB.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    this.emailsTable = new DynamoDB.Table(this, "emails", {
      billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "email",
        type: DynamoDB.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });
  }
}
