import {
  ConditionalCheckFailedException,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { InternalError } from "./InternalError.js";
import { ConflictError } from "./ConflictError.js";

export const registerEmailToken =
  ({ db, TableName }: { db: DynamoDBClient; TableName: string }) =>
  async ({
    email,
    code,
  }: {
    email: string;
    code: string;
  }): Promise<{ error: Error } | { success: true }> => {
    try {
      // Expires in 5 Minutes
      const expires = new Date(Date.now() + 5 * 60 * 1000);
      // Rerequest after 1 Minute
      const rerequestAfter = new Date(Date.now() + 1 * 60 * 1000);
      await db.send(
        new UpdateItemCommand({
          TableName,
          Key: {
            email: {
              S: email.toLowerCase(),
            },
          },
          UpdateExpression:
            "SET #code = :code, #ttl = :ttl, #rerequestAfter = :rerequestAfter",
          ConditionExpression:
            "attribute_not_exists(email) OR #ttl < :now OR #rerequestAfter < :now",
          ExpressionAttributeNames: {
            "#code": "code",
            "#ttl": "ttl",
            "#rerequestAfter": "rerequestAfter",
          },
          ExpressionAttributeValues: {
            ":code": {
              S: code,
            },
            ":ttl": {
              N: `${Math.floor(expires.getTime() / 1000)}`,
            },
            ":rerequestAfter": {
              N: `${Math.floor(rerequestAfter.getTime() / 1000)}`,
            },
            ":now": {
              N: `${Math.floor(Date.now() / 1000)}`,
            },
          },
        })
      );

      return { success: true };
    } catch (error) {
      if ((error as Error).name === ConditionalCheckFailedException.name)
        return {
          error: new ConflictError(
            `Login requests for '${email}' already exists.`
          ),
        };
      console.error(error);
      return { error: new InternalError() };
    }
  };
