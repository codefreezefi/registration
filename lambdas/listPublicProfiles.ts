import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const { RegistrationsTableName, publicProfilesByCodefreezeIndexName } = fromEnv(
  {
    RegistrationsTableName: "REGISTRATIONS_TABLE_NAME",
    publicProfilesByCodefreezeIndexName:
      "PUBLIC_PROFILES_BY_CODEFREEZE_INDEX_NAME",
  },
)(process.env);

const db = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const headers = {
    "Access-Control-Allow-Origin": event.headers.origin as string,
  };

  try {
    const { Items } = await db.send(
      new QueryCommand({
        TableName: RegistrationsTableName,
        IndexName: publicProfilesByCodefreezeIndexName,
        KeyConditionExpression: "#codefreeze = :codefreeze",
        ExpressionAttributeNames: {
          "#codefreeze": "codefreeze",
        },
        ExpressionAttributeValues: {
          ":codefreeze": {
            N: parseInt(
              event.queryStringParameters?.codefreeze ??
                new Date().getFullYear().toString(),
              10,
            ).toString(),
          },
        },
      }),
    );

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
      body: JSON.stringify(
        Items?.map((Item) => unmarshall(Item) ?? []).map(
          ({
            github,
            homepage,
            linkedin,
            mastodon,
            matrix,
            name,
            photoThumbnail,
            pronouns,
            publicProfile,
          }) =>
            publicProfile === false
              ? {
                  name: "Anonymous",
                }
              : {
                  github,
                  homepage,
                  linkedin,
                  mastodon,
                  matrix,
                  name,
                  photoThumbnail,
                  pronouns,
                },
        ),
      ),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
    };
  }
};
