import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export function createDocumentClient({ awsRegion, dynamoEndpoint }) {
  const client = new DynamoDBClient({
    region: awsRegion,
    endpoint: dynamoEndpoint,
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local',
    },
  });

  return {
    client,
    documentClient: DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    }),
  };
}