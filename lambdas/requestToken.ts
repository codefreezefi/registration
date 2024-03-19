import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { generateCode } from "../src/registration/code.js";

const ses = new SESClient({});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const { email } = JSON.parse(event.body ?? "{}");

  if (!isEmail(email))
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin as string,
      },
    };

  const code = generateCode();

  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: { Data: `Your code: ${code}` },
        },
        Subject: {
          Data: `[codefreeze.fi] Please verify your email`,
        },
      },
      Source: "notification@codefreeze.fi",
    })
  );

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": event.headers.origin as string,
    },
  };
};

export const isEmail = (s: string): boolean =>
  /.+@.+/.test(s) && !s.endsWith("@example.com");
