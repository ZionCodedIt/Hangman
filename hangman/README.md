# Hangman With Player Tracking

This project extends the original Hangman game with a small API and DynamoDB-backed player tracking. Players can log in with their name, load an existing record, create a new record when needed, and automatically persist wins and losses when a game ends.

## Features

- React frontend with keyboard and button-based Hangman gameplay
- Express API for player lookup, creation, and stat updates
- DynamoDB integration through `DynamoDBDocumentClient`
- Player login flow that checks Dynamo first and creates a record only when needed
- Local React state updates for wins, losses, and winning percentage before the API `PUT`
- UI and API tests with Vitest, Testing Library, and Supertest
- Docker Compose setup for the frontend, API, and DynamoDB Local

## Player Flow

1. Enter a player name on the home screen.
2. The UI sends a `GET` request to `/api/players/:playerName`.
3. If the player exists, the record is loaded and the login button is removed.
4. If the player does not exist, the UI sends a `POST` request to create the player and then logs them in.
5. When the game ends, the frontend updates the player stats in local state first.
6. The UI then sends a `PUT` request to `/api/players/:playerName/stats` to persist the latest wins and losses.

## Tech Stack

- React 19
- Vite 7
- Express 5
- AWS SDK v3
- DynamoDB Local
- Vitest
- Testing Library
- Supertest
- Docker Compose

## Project Structure

```text
hangman/
├── server/
│   ├── app.js
│   ├── index.js
│   ├── config.js
│   ├── app.test.js
│   ├── db/
│   │   ├── client.js
│   │   └── playersRepository.js
│   └── lib/
│       └── playerSerializer.js
├── src/
│   ├── api/
│   │   └── playerApi.js
│   ├── components/
│   │   ├── GameMessage.jsx
│   │   ├── GameStats.jsx
│   │   ├── HangmanDisplay.jsx
│   │   ├── HangmanGame.jsx
│   │   ├── HangmanGame.test.jsx
│   │   ├── LetterButtons.jsx
│   │   └── WordDisplay.jsx
│   ├── test/
│   │   └── setup.js
│   ├── App.css
│   ├── App.jsx
│   ├── constants.js
│   └── main.jsx
├── Dockerfile
├── Dockerfile.api
├── docker-compose.yml
├── package.json
└── README.md
```

## API Endpoints

### `GET /api/health`

Returns a simple health response for the API.

### `GET /api/players/:playerName`

Looks up an existing player.

Example response:

```json
{
  "playerName": "Avery",
  "wins": 3,
  "losses": 1,
  "winningPercentage": 75
}
```

### `POST /api/players`

Creates a new player.

Example request body:

```json
{
  "playerName": "Avery"
}
```

### `PUT /api/players/:playerName/stats`

Persists the current wins and losses for a player.

Example request body:

```json
{
  "wins": 4,
  "losses": 2
}
```

## Local Development

### Prerequisites

- Node.js 18+
- npm
- Docker Desktop

### Install Dependencies

```bash
npm install
```

### Run the Frontend

```bash
npm run dev
```

### Run the API

```bash
npm run dev:api
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:3001`.

### Start DynamoDB Local With Docker

```bash
docker compose up dynamodb
```

The API auto-creates the `HangmanPlayers` table when it starts.

## Docker Compose

To run the full stack:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- API: `http://localhost:3001`
- DynamoDB Local: `http://localhost:8000`

## Testing

Run all tests:

```bash
npm run test
```

Run only API tests:

```bash
npm run test:api
```

Run only UI tests:

```bash
npm run test:ui
```

## Postman Checks

Use Postman to verify the API before wiring it into the UI.

Suggested requests:

- `GET http://localhost:3001/api/health`
- `GET http://localhost:3001/api/players/Avery`
- `POST http://localhost:3001/api/players`
- `PUT http://localhost:3001/api/players/Avery/stats`

## Environment Notes

The frontend reads `VITE_API_BASE_URL` when provided. If it is not set, it uses `http://localhost:3001/api` by default.

The API reads these environment variables:

- `PORT`
- `AWS_REGION`
- `DYNAMODB_ENDPOINT`
- `PLAYERS_TABLE`

## Submission Checklist

Items completed in this repo:

- Updated Hangman frontend with player login and stat tracking
- Added DynamoDB-backed API
- Added automated tests
- Added Docker Compose
- Updated README

Items still manual:

- Record the video demo
- Push the final code and submit the Git link required by your class