# White House Watch

This project tracks recent press releases from the White House. It allows users to:
- View the latest press releases.
- Chat with the content of the press releases using a Retrieval-Augmented Generation (RAG) system.
- Subscribe to specific topics to receive notifications about relevant new releases.

## Getting Started

First, install the dependencies using Bun:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Migrations

This project uses Drizzle ORM with Neon database. To manage database schema changes, use the following scripts:

- **Generate Migrations:** After changing your schema files (likely in `src/db/schema.ts`), generate migration files:
  ```bash
  bun run db:generate
  ```
- **Apply Migrations:** Apply generated migrations to your database:
  ```bash
  bun run db:migrate
  ```
- **Push Schema (Development Only):** Directly push schema changes to the database without generating migration files. **Use with caution, primarily for development**:
  ```bash
  bun run db:push
  ```

### Environment Variables

This project requires certain environment variables to be set. Create a `.env.local` file in the root directory and add the following variables:

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_connection_string
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
RESEND_API_KEY=your_resend_api_key
```

- `OPENAI_API_KEY`: Your API key from OpenAI, used for the RAG system.
- `DATABASE_URL`: The connection string for your Neon PostgreSQL database.r
- `RESEND_API_KEY`: Your API key from Resend, used for sending email notifications for topic subscriptions.

Make sure to replace the placeholder values with your actual credentials.

