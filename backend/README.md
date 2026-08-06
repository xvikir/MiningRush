# Mining Rush Backend

Independent Node.js, Express, MongoDB, and Mongoose REST API. It does not serve or depend on the frontend.

## Setup

1. Install [Node.js 18+](https://nodejs.org/) and start MongoDB locally or provide a MongoDB Atlas URI.
2. In this `backend` directory, install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`, then set `MONGODB_URI`, a strong `ADMIN_PASSWORD`, and the permitted `CORS_ORIGIN` values. `CORS_ORIGIN` is mandatory in production.
4. Generate the validated question bank, then import it:

   ```bash
   npm run generate:questions
   npm run import:questions
   ```

5. Run the API:

   ```bash
   npm run dev
   ```

The import script replaces the `questions` collection. To use another file, run `node scripts/importQuestions.js path/to/questions.json`.

## Question JSON format

`data/questions.json` must be a non-empty JSON array. Every item requires `question`, numeric `answer`, integer `level` (1–5), `topic`, and `difficulty` (`easy`, `medium`, or `hard`).

## API

- `GET /api/health` — service health response.
- `GET /api/questions/random?level=1&exclude=id1,id2` — one random unseen question for level 1–5, returning only `id`, `question`, and `level`. When every supplied exclusion covers that level's pool, the API automatically starts a new pool.
- `POST /api/questions/check` — checks an answer without exposing it. JSON body: `{ "questionId": "...", "answer": 42 }`.
- `POST /api/scores` — create a score. JSON body:

  ```json
  {
    "playerName": "Akshay",
    "playerClass": "S3 CSE",
    "blocksMined": 12,
    "wrongAttempts": 2,
    "timeTaken": 91,
    "maxLevel": 4
  }
  ```

- `GET /api/leaderboard?limit=10` — scores ranked by blocks mined (descending), wrong attempts (ascending), time taken (ascending), then earliest submission.
- `GET /api/stats` — aggregate score counts, player count, block totals, average, high score, and score distribution.
- `POST /api/admin/reset` — deletes all scores. Send `{ "password": "..." }`; the password must match `ADMIN_PASSWORD` in the server `.env` file.
- `GET /api/admin/analytics` — protected analytics for administrators. Supply `x-admin-password: <ADMIN_PASSWORD>` as a request header. Returns aggregate metrics, the top 10 player summaries, and the last 20 games.

Validation failures and unknown routes return a JSON response in the form `{ "success": false, "message": "..." }`.

## Database indexes

Questions are indexed by `level` and `difficulty`. Scores are indexed by `createdAt`, `blocksMined`, and `playerName`, with a compound leaderboard index on blocks mined, wrong attempts, time taken, and submission time to match leaderboard sorting.
