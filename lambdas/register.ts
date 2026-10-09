import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { marshall } from '@aws-sdk/util-dynamodb'
import { fromEnv } from '@nordicsemiconductor/from-env'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyResultV2,
} from 'aws-lambda'
import id128 from 'id128'
import { CC, From } from './emails.ts'
import { getEmailByToken } from './getEmailByToken.ts'
import { isEmail } from './requestToken.ts'

const { EmailsTableName, RegistrationsTableName } = fromEnv({
	EmailsTableName: 'EMAILS_TABLE_NAME',
	RegistrationsTableName: 'REGISTRATIONS_TABLE_NAME',
})(process.env)

const db = new DynamoDBClient({})
const byToken = getEmailByToken({ db, TableName: EmailsTableName })

const ses = new SESClient({})

export const handler = async (
	event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
	console.log(JSON.stringify({ event }))

	const { email, code, ...rest } = JSON.parse(event.body ?? '{}')
	const headers = {
		'Access-Control-Allow-Origin': event.headers.origin as string,
	}

	if (!isEmail(email) || !isCode(code))
		return {
			statusCode: 400,
			headers,
		}

	const maybeVerifiedEmail = await byToken({ email, code })
	if ('error' in maybeVerifiedEmail) {
		return {
			statusCode: 400,
			headers,
		}
	}

	const id = id128.Ulid.generate().toCanonical()
	await db.send(
		new PutItemCommand({
			TableName: RegistrationsTableName,
			Item: marshall({
				id,
				email,
				...rest,
			}),
		}),
	)

	await ses.send(
		new SendEmailCommand({
			Destination: {
				ToAddresses: [`"${maybeVerifiedEmail.name}" <${email}>`],
				CcAddresses: CC,
			},
			ReplyToAddresses: CC,
			Message: {
				Body: {
					Text: {
						Data: [
							`Hei ${maybeVerifiedEmail.name},\nthank you for registering for Codefreeze.`,
							`Your registration ID is ${id}.`,
							`Please do no hesitate to reach out to us if you have any questions.`,
							`❄`,
							``,
							`**Warning:** the hotel system used by Suomen Latu Kiilopää announced on October 8th 2026 that a data breach has occurred.`,
							`Based on current information, the data leak affects customers with reservations scheduled for arrival on or after October 6th. The data exposed includes customer details associated with reservations, contact information, and reservation dates. Customer payment details (such as credit card information) are not stored in the system in question, so they could not have been leaked.`,
							`However, your reservation’s arrival and departure dates could be used in fraudulent messages attempting to obtain the recipient’s payment details. Suomen Latu Kiilopää never requests credit card details or online banking credentials via telephone, email, text message, or WhatsApp.`,
							`The breach may be ongoing and it may affect new guests as well. If you receive such a request, do not pay it.`,
							`Only communicate with the hotel through the channels they have published on their website kiilopaa.fi.`,
						].join('\n\n'),
					},
				},
				Subject: {
					Data: `[codefreeze.fi] Your registration ${id}`,
				},
			},
			Source: From,
		}),
	)

	return {
		statusCode: 201,
		headers,
		body: JSON.stringify({ id }),
	}
}

const isCode = (c: string): boolean => c.length === 6
