import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { isEmail } from "./requestToken.js";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const { email, code } = JSON.parse(event.body ?? "{}");

  if (!isEmail(email) || !isCode(code))
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin as string,
      },
    };

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": event.headers.origin as string,
    },
  };
};

const isCode = (c: string): boolean => c.length === 6;
