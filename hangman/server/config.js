export const config = {
  port: Number(process.env.PORT ?? 3001),
  awsRegion: process.env.AWS_REGION ?? 'us-east-1',
  dynamoEndpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
  playersTable: process.env.PLAYERS_TABLE ?? 'HangmanPlayers',
};