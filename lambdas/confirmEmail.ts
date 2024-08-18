import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { getEmailByToken } from "./getEmailByToken.js";
import { isEmail } from "./requestToken.js";

const { TableName } = fromEnv({
  TableName: "EMAILS_TABLE_NAME",
})(process.env);

const db = new DynamoDBClient({});
const byToken = getEmailByToken({ db, TableName });

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const { email, code } = JSON.parse(event.body ?? "{}");
  const headers = {
    "Access-Control-Allow-Origin": event.headers.origin as string,
  };

  if (!isEmail(email) || !isCode(code))
    return {
      statusCode: 400,
      headers,
    };

  const maybeVerifiedEmail = await byToken({ email, code });
  if ("error" in maybeVerifiedEmail) {
    return {
      statusCode: 400,
      headers,
    };
  }

  return {
    statusCode: 200,
    headers,
  };
};

const isCode = (c: string): boolean => c.length === 6;
