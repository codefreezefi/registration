import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import type { DynamoDBStreamEvent } from 'aws-lambda'
import { CC, From } from './emails.ts'

const ses = new SESClient({})

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
	console.log(JSON.stringify(event, null, 2))

	for (const Record of event.Records) {
		// Event filter rules ensure these are MODIFY events of registrations with
		// a Codefreeze edition and a public profile (see cdk/PublicProfiles.ts).
		const OldProfile = unmarshall(
			Record.dynamodb?.OldImage as Record<string, AttributeValue>,
		)
		const UpdatedProfile = unmarshall(
			Record.dynamodb?.NewImage as Record<string, AttributeValue>,
		)
		// Filter rules cannot compare old and new values, so this check remains here.
		if (OldProfile.codefreeze === UpdatedProfile.codefreeze) continue
		console.log(
			`Codefreeze changed from ${OldProfile.codefreeze} to ${UpdatedProfile.codefreeze}`,
		)

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
							].join('\n\n'),
						},
					},
					Subject: {
						Data: `[codefreeze.fi] Your public profile for ${UpdatedProfile.codefreeze} is now live`,
					},
				},
				Source: From,
			}),
		)
	}
}
