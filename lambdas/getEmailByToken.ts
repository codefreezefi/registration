import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { InternalError } from "./InternalError.js";

export const getEmailByToken =
  ({ db, TableName }: { db: DynamoDBClient; TableName: string }) =>
  async ({
    email,
    code,
  }: {
    email: string;
    code: string;
  }): Promise<{ error: Error } | { email: string; name: string }> => {
    try {
      const { Item } = await db.send(
        new GetItemCommand({
          TableName,
          Key: {
            email: {
              S: email.toLowerCase(),
            },
          },
        })
      );

      const item = unmarshall(Item ?? {});
      if (item.code !== code) {
        return { error: new Error("Invalid code") };
      }

      return { email: item.email, name: item.name };
    } catch (error) {
      console.error(error);
      return { error: new InternalError() };
    }
  };
