import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBStreamEvent } from "aws-lambda";
import { CC, From } from "./emails.ts";

const ses = new SESClient({});

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(JSON.stringify(event, null, 2));

  for (const Record of event.Records) {
    if (Record.eventName !== "MODIFY") continue;
    const NewImage = Record?.dynamodb?.NewImage;
    const OldImage = Record?.dynamodb?.OldImage;
    if (NewImage === undefined) continue;
    const OldProfile = unmarshall(OldImage as Record<string, AttributeValue>);
    const UpdatedProfile = unmarshall(
      NewImage as Record<string, AttributeValue>
    );
    if (OldProfile.codefreeze === UpdatedProfile.codefreeze) return;
    console.log(
      `Codefreeze changed from ${OldProfile.codefreeze} to ${UpdatedProfile.codefreeze}`
    );
    if (UpdatedProfile.codefreeze === undefined) return;
    if (UpdatedProfile.publicProfile === false) return;

    await ses.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [`"${UpdatedProfile.name}" <${UpdatedProfile.email}>`],
          CcAddresses: CC,
        },
        ReplyToAddresses: CC,
        Message: {
          Body: {
            Text: {
              Data: [
                `Hei ${UpdatedProfile.name},\nthank you submitting your profile details for Codefreeze ${UpdatedProfile.codefreeze}.`,
                `It is now live on our website.`,
                `Please do no hesitate to reach out to us if you have any questions.`,
                `❄`,
              ].join("\n\n"),
            },
          },
          Subject: {
            Data: `[codefreeze.fi] Your public profile for ${UpdatedProfile.codefreeze} is now live`,
          },
        },
        Source: From,
      })
    );
  }
};
