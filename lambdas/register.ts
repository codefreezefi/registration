import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { isEmail } from "./requestToken.js";
import { getEmailByToken } from "./getEmailByToken.js";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import id128 from "id128";
import { marshall } from "@aws-sdk/util-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const { EmailsTableName, RegistrationsTableName } = fromEnv({
  EmailsTableName: "EMAILS_TABLE_NAME",
  RegistrationsTableName: "REGISTRATIONS_TABLE_NAME",
})(process.env);

const db = new DynamoDBClient({});
const byToken = getEmailByToken({ db, TableName: EmailsTableName });

const ses = new SESClient({});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const { email, code, ...rest } = JSON.parse(event.body ?? "{}");
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

  const id = id128.Ulid.generate().toCanonical();
  await db.send(
    new PutItemCommand({
      TableName: RegistrationsTableName,
      Item: marshall({
        id,
        email,
        ...rest,
      }),
    })
  );

  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [`"${maybeVerifiedEmail.name}" <${email}>`],
        CcAddresses: [`"Markus Tacker" <m@coderbyheart.com>`],
      },
      ReplyToAddresses: [`"Markus Tacker" <m@coderbyheart.com>`],
      Message: {
        Body: {
          Text: {
            Data: [
              `Hei ${maybeVerifiedEmail.name},\nthank you for registering for Codefreeze.`,
              `Your registration ID is ${id}.`,
              `Please do no hesitate to reach out to us if you have any questions.`,
            ].join("\n"),
          },
        },
        Subject: {
          Data: `[codefreeze.fi] Your registration ${id}`,
        },
      },
      Source: "notification@codefreeze.fi",
    })
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ id }),
  };
};

const isCode = (c: string): boolean => c.length === 6;
