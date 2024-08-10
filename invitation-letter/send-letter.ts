import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import run from "@bifravst/run";
import { fromEnv } from "@nordicsemiconductor/from-env";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { CC, From } from "../lambdas/emails.ts";

const registrationId = process.argv[process.argv.length - 1] as string;

const { RegistrationsTableName } = fromEnv({
  RegistrationsTableName: "REGISTRATIONS_TABLE_NAME",
})(process.env);

const db = new DynamoDBClient({});
const ses = new SESClient({});
const { Item } = await db.send(
  new GetItemCommand({
    TableName: RegistrationsTableName,
    Key: {
      id: { S: registrationId },
    },
  })
);
if (!Item) {
  throw new Error(`Registration ${registrationId} not found`);
}

const registration = unmarshall(Item);

console.log(registration);

const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "invitation-letters-"));
const template = await fs.readFile(
  path.join(process.cwd(), "invitation-letter", "template.svg"),
  "utf-8"
);

const outFile = `invitation-letter-${registrationId}.pdf`;
const out = path.join(tempDir, outFile);
const infile = path.join(tempDir, "invitation-letter.svg");

await fs.writeFile(
  infile,
  template
    .replaceAll("{{ DATE }}", new Date().toISOString().slice(0, 10))
    .replaceAll("{{ NAME }}", registration.name)
);

console.log(
  await run({
    command: "inkscape",
    args: [`--export-filename=${out}`, infile],
  })
);

const boundary = "NextPart";
let rawEmail = `From: ${From}\n`;
rawEmail += `To: ${`"${registration.name}" <${registration.email}>`}\n`;
rawEmail += `Cc: ${CC}\n`;
rawEmail += `Reply-To: ${CC}\n`;
rawEmail += `Subject: [codefreeze.fi] Your invitation letter for your registration ${registrationId}\n`;
rawEmail += `MIME-Version: 1.0\n`;
rawEmail += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;
rawEmail += `--${boundary}\n`;
rawEmail += `Content-Type: text/plain; charset="UTF-8"\n\n`;
rawEmail += `${[
  `Hei ${registration.name},`,
  `Please find attached your invitation letter.`,
  `Please do no hesitate to reach out to us if you have any questions.`,
  `❄`,
].join("\n\n")}\n\n`;
rawEmail += `--${boundary}\n`;
rawEmail += `Content-Type: application/pdf ; name="${outFile}"\n`;
rawEmail += `Content-Disposition: attachment; filename="${outFile}"\n`;
rawEmail += `Content-Transfer-Encoding: base64\n\n`;
rawEmail += `${Buffer.from(await fs.readFile(out)).toString("base64")}\n\n`;
rawEmail += `--${boundary}--`;

await ses.send(
  new SendRawEmailCommand({
    RawMessage: {
      Data: Buffer.from(rawEmail),
    },
  })
);
