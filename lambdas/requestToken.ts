import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { generateCode } from "../src/registration/code.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import { registerEmailToken } from "./registerEmailToken.js";
import { ConflictError } from "./ConflictError.js";
import { error } from "console";

const ses = new SESClient({});
const db = new DynamoDBClient({});

const { TableName } = fromEnv({
  TableName: "EMAIL_TABLE_NAME",
})(process.env);

const emailRepo = registerEmailToken({ db, TableName });

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const { email, name } = JSON.parse(event.body ?? "{}");
  const headers = {
    "Access-Control-Allow-Origin": event.headers.origin as string,
  };

  if (!isEmail(email) || (typeof name !== "string" && name.length < 1))
    return {
      statusCode: 400,
      headers,
    };

  const code = generateCode();

  const maybeNewRequest = await emailRepo({ email, code });

  if ("error" in maybeNewRequest) {
    if (error instanceof ConflictError) {
      return {
        statusCode: 409,
        headers,
      };
    }
    return {
      statusCode: 400,
      headers,
    };
  }

  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [`"${name}" <${email}>`],
      },
      Message: {
        Body: {
          Text: {
            Data: `Hei ${name},\nhere is your code to verify your email address: ${code}`,
          },
        },
        Subject: {
          Data: `[codefreeze.fi] Your verification code: ${code}`,
        },
      },
      Source: "notification@codefreeze.fi",
    })
  );

  return {
    statusCode: 201,
    headers,
  };
};

export const isEmail = (s: string): boolean =>
  /.+@.+/.test(s) && !s.endsWith("@example.com");
