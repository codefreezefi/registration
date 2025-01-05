import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { listProfilesForYear } from './profiles.ts';

const { RegistrationsTableName, participantsByCodefreezeIndexName } = fromEnv({
  RegistrationsTableName: "REGISTRATIONS_TABLE_NAME",
  participantsByCodefreezeIndexName: "PARTICIPANTS_BY_CODEFREEZE_INDEX_NAME",
})(process.env);

const list = listProfilesForYear({
  db: new DynamoDBClient({}),
  RegistrationsTableName,
  IndexName: participantsByCodefreezeIndexName,
});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify({ event }));

  try {
    const profiles = await list(
      parseInt(
        event.queryStringParameters?.codefreeze ??
          new Date().getFullYear().toString(),
        10
      )
    );

    console.log(JSON.stringify({ profiles }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: profiles
        .map(({ email, name }) => `"${name}" <${email}>`)
        .join("\n"),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
    };
  }
};
