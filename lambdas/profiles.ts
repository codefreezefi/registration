import { QueryCommand, type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export const listProfilesForYear =
	({
		db,
		RegistrationsTableName,
		IndexName,
	}: {
		db: DynamoDBClient
		RegistrationsTableName: string
		IndexName: string
	}) =>
	async (year: number) => {
		const { Items } = await db.send(
			new QueryCommand({
				TableName: RegistrationsTableName,
				IndexName,
				KeyConditionExpression: '#codefreeze = :codefreeze',
				ExpressionAttributeNames: {
					'#codefreeze': 'codefreeze',
				},
				ExpressionAttributeValues: {
					':codefreeze': {
						N: year.toString(),
					},
				},
			}),
		)

		return Items?.map((Item) => unmarshall(Item)) ?? []
	}
