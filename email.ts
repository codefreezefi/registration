import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

try {
  await new SESClient({}).send(
    new SendEmailCommand({
      Source: "registration@codefreeze.fi",
      Destination: {
        ToAddresses: ['"Markus Tacker" <m@coderbyheart.com>'],
      },
      Message: {
        Body: {
          Text: {
            Data: "Please confirm your registration for Codefreeze 2025 by entering the code 12345678 on our website.",
          },
        },
        Subject: {
          Data: "[Codefreeze] Please confirm your registration",
        },
      },
    })
  );
} catch (err) {
  console.error(err);
}
