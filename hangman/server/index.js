import { createApp } from './app.js';
import { config } from './config.js';
import { createDocumentClient } from './db/client.js';
import { createPlayersRepository } from './db/playersRepository.js';

async function ensureTableWithRetry(playerStore, attempts = 10, delayMs = 2000) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await playerStore.ensureTable();
      return;
    } catch (error) {
      lastError = error;

      if (attempt === attempts) {
        break;
      }

      console.warn(
        `DynamoDB unavailable on attempt ${attempt}/${attempts}. Retrying in ${delayMs}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

async function startServer() {
  const { client, documentClient } = createDocumentClient(config);
  const playerStore = createPlayersRepository({
    client,
    documentClient,
    tableName: config.playersTable,
  });

  await ensureTableWithRetry(playerStore);

  const app = createApp({ playerStore });
  app.listen(config.port, () => {
    console.log(`Hangman API listening on port ${config.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Hangman API', error);
  process.exit(1);
});