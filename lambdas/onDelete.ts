import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import type { DynamoDBStreamEvent } from 'aws-lambda'
import { CC, From } from './emails.ts'

const ses = new SESClient({})

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
	console.log(JSON.stringify(event, null, 2))

	for (const Record of event.Records) {
		// Event filter rules ensure these are REMOVE events of registrations
		// with an email (see cdk/DeletionNotification.ts).
		const DeletedRegistration = unmarshall(
			Record.dynamodb?.OldImage as Record<string, AttributeValue>,
		)
		const { id, email, name, codefreeze } = DeletedRegistration
		console.log(`Registration ${id} deleted, notifying ${email}.`)

		const edition = codefreeze !== undefined ? ` ${codefreeze}` : ''

		await ses.send(
			new SendEmailCommand({
				Destination: {
					ToAddresses: [
						typeof name === 'string' ? `"${name}" <${email}>` : email,
					],
					CcAddresses: CC,
				},
				ReplyToAddresses: CC,
				Message: {
					Body: {
						Text: {
							Data: [
								`Hei${typeof name === 'string' ? ` ${name}` : ''},\nyour registration ${id} for Codefreeze${edition} has been deleted.`,
								`All data associated with this registration has been removed from our system.`,
								`If you did not expect this, or have any questions, please do no hesitate to reach out to us.`,
								`Remember to cancel you hotel reservation if you have one.`,
								`❄`,
							].join('\n\n'),
						},
					},
					Subject: {
						Data: `[codefreeze.fi] Your registration ${id} has been deleted`,
					},
				},
				Source: From,
			}),
		)
	}
}
