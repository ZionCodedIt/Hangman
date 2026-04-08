import {
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { serializePlayer } from '../lib/playerSerializer.js';

export function createPlayersRepository({ client, documentClient, tableName }) {
  return {
    async ensureTable() {
      try {
        await client.send(new DescribeTableCommand({ TableName: tableName }));
      } catch (error) {
        if (!(error instanceof ResourceNotFoundException)) {
          throw error;
        }

        await client.send(
          new CreateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
              {
                AttributeName: 'playerName',
                AttributeType: 'S',
              },
            ],
            KeySchema: [
              {
                AttributeName: 'playerName',
                KeyType: 'HASH',
              },
            ],
            BillingMode: 'PAY_PER_REQUEST',
          }),
        );

        await waitUntilTableExists(
          { client, maxWaitTime: 20 },
          { TableName: tableName },
        );
      }
    },

    async getPlayer(playerName) {
      const response = await documentClient.send(
        new GetCommand({
          TableName: tableName,
          Key: { playerName },
        }),
      );

      return response.Item ? serializePlayer(response.Item) : null;
    },

    async createPlayer(playerName) {
      const player = {
        playerName,
        wins: 0,
        losses: 0,
      };

      await documentClient.send(
        new PutCommand({
          TableName: tableName,
          Item: player,
          ConditionExpression: 'attribute_not_exists(playerName)',
        }),
      );

      return serializePlayer(player);
    },

    async updatePlayerStats(playerName, stats) {
      const response = await documentClient.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { playerName },
          UpdateExpression: 'SET wins = :wins, losses = :losses',
          ConditionExpression: 'attribute_exists(playerName)',
          ExpressionAttributeValues: {
            ':wins': stats.wins,
            ':losses': stats.losses,
          },
          ReturnValues: 'ALL_NEW',
        }),
      );

      return serializePlayer(response.Attributes ?? { playerName, ...stats });
    },
  };
}