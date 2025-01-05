import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { listProfilesForYear } from "./profiles.ts";

const { RegistrationsTableName, publicProfilesByCodefreezeIndexName } = fromEnv(
  {
    RegistrationsTableName: "REGISTRATIONS_TABLE_NAME",
    publicProfilesByCodefreezeIndexName:
      "PUBLIC_PROFILES_BY_CODEFREEZE_INDEX_NAME",
  }
)(process.env);

const list = listProfilesForYear({
  db: new DynamoDBClient({}),
  RegistrationsTableName,
  IndexName: publicProfilesByCodefreezeIndexName,
});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  const headers = {
    "Access-Control-Allow-Origin": event.headers.origin as string,
  };

  try {
    const profiles = await list(
      parseInt(
        event.queryStringParameters?.codefreeze ??
          new Date().getFullYear().toString(),
        10
      )
    );

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
      body: JSON.stringify(
        profiles
          .filter(({ publicProfile }) => publicProfile !== false)
          .map(
            ({
              github,
              homepage,
              linkedin,
              mastodon,
              matrix,
              name,
              photoThumbnail,
              pronouns,
            }) => ({
              github,
              homepage,
              linkedin,
              mastodon,
              matrix,
              name,
              photoThumbnail,
              pronouns,
            })
          )
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
