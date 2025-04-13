# 🏛️ White House Watch

**White House Watch** is a modern tool that tracks and enhances recent press releases from the White House. With it, you can:

- 📰 **Browse** the latest official statements.
- 🤖 **Chat** with press release content using a smart Retrieval-Augmented Generation (RAG) system.
- 📬 **Subscribe** to topics and get email notifications when relevant new content drops.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Start the Development Server

```bash
bun run dev
```

Then, visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Migrations

We use **Drizzle ORM** with a **Neon** PostgreSQL database. Manage your schema with the following commands:

- **Generate migration files** (after schema changes in `src/db/schema.ts`):

  ```bash
  bun run db:generate
  ```

- **Apply migrations** to the database:

  ```bash
  bun run db:migrate
  ```

- **Push schema (dev only)**: Skip migration files and push directly:

  ```bash
  bun run db:push
  ```

> ⚠️ Use `db:push` only during development!

---

## 🛠️ Environment Setup

Create a `.env.local` file in the root directory with the following:

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_connection_string
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
RESEND_API_KEY=your_resend_api_key
```

- `OPENAI_API_KEY`: Enables the RAG-powered chat system.
- `DATABASE_URL`: Points to your Neon-hosted PostgreSQL DB.
- `RESEND_API_KEY`: Sends topic subscription email updates.

---

## ⏱️ Automated Article Updates

New White House press releases are fetched automatically every day via a Vercel Cron Job.

- **⏰ Schedule**: Daily at midnight UTC (`0 0 * * *`)
- **🔧 Configuration**: Set in `vercel.json`
- **🔁 Endpoint**: Triggers `POST` at `app/api/articles/updates/route.ts`
- **🔍 Functionality**:
  - Scrapes new releases from the official site
  - Improves titles and formats content
  - Extracts topics
  - Creates embeddings and stores everything in the database
  - Notifies subscribed users via email

---

## 🧹 Scraping Process

The core scraping logic resides in the `lib/scraping/` directory and is orchestrated by the `scrapeNewArticles` function within `lib/scraping/scrape-new-articles.ts`. This process is automatically initiated by the daily cron job hitting the `app/api/articles/updates/route.ts` endpoint.

The scraping follows these steps:

1.  **Identify New Articles**: It first checks the database for the most recently scraped article to determine the starting point.
2.  **Fetch Article List**: It navigates the paginated "News" section of the White House website (`https://www.whitehouse.gov/news/`).
    -   It uses `scrape-pagination.ts` to understand the pagination structure.
    -   `scrape-articles-from-page.ts` extracts article titles and URLs from each relevant page until it finds the previously scraped articles or reaches a limit.
3.  **Scrape Full Content**: For each newly discovered article URL:
    -   `scrape-article.ts` fetches the full HTML content of the article page.
    -   It extracts the title, date, and main content body.
    -   `generate-slug.ts` creates a URL-friendly slug from the title.
4.  **Return Data**: The collected data (title, date, content, original URL, slug) for each new article is returned to the API route for further processing (like title improvement, content formatting, topic extraction, embedding generation, and database insertion).

---

## 🤖 LLM-Powered Enhancements

After scraping, the raw article data undergoes several AI-driven transformations using LLMs (powered by OpenAI and Google Generative AI) to improve its quality and utility. These steps are managed within the `app/api/articles/updates/route.ts` endpoint and utilize functions from the `lib/text-modifications/` directory:

1.  **Title & Description Generation** (`improve-title-and-short-description.ts`):
    *   Takes the original article title and content.
    *   Generates a more concise and informative title.
    *   Creates a brief summary (short description) of the article.
2.  **Content Formatting** (`format-content-markdown.ts`):
    *   Converts the raw HTML content scraped from the site into clean, readable Markdown format. This includes structuring paragraphs, headings, lists, and links appropriately.
3.  **Topic Extraction** (`topics-from-content.ts`):
    *   Analyzes the formatted content.
    *   Identifies and extracts relevant political topics from a predefined list (`lib/data/political-topics.ts`). This helps in categorizing articles and enabling topic-based subscriptions.

These enhancements ensure the articles presented in White House Watch are well-structured, easy to understand, and properly categorized.

---

## 💾 Vector Embeddings & Semantic Search

To enable the chat functionality (Retrieval-Augmented Generation - RAG), the application utilizes vector embeddings and semantic search:

1.  **Embedding Generation**:
    *   During the automated article update process (`app/api/articles/updates/route.ts`), after an article's content is formatted, the `generateEmbeddings` function (from `lib/vectors/generate-embeddings.ts`) is called.
    *   This function breaks the article content into chunks and generates a vector embedding for each chunk.
    *   These embeddings, along with the content chunk and a reference to the parent article (`resourceId`), are stored in the `embeddings` table in the database (defined in `lib/db/schema.ts`).
    *   A utility script `scripts/generate-embeddings.ts` exists for backfilling embeddings for existing articles if needed.

2.  **Semantic Search & Retrieval** (`lib/db/queries/find-relevant-content.ts`):
    *   When a user submits a query in the chat interface, the `findRelevantContent` function is triggered.
    *   **Query Improvement**: The user's query is first refined by an LLM (`improveQuery` function) to be more effective for semantic search.
    *   **Query Embedding**: The query is converted into a vector embedding using the same model used for the article content.
    *   **Similarity Search**: A cosine similarity search is performed against all embeddings stored in the database. The `sql<number>\`1 - (${cosineDistance(...)})\`` function in Drizzle ORM calculates the relevance score.
    *   **Content Retrieval**: The system retrieves the original content chunks corresponding to the most similar embeddings (above a certain threshold).
    *   **Article Fetching**: It then fetches the full article details associated with these relevant content chunks.
    *   **Context Building**: This retrieved information (relevant article snippets and their parent articles) forms the context that is passed to the chat LLM, allowing it to answer questions based on the specific content of the press releases.
****
---

## 🌐 Live Version

You can try out the live app here: [https://white-house-watch.vercel.app/](https://white-house-watch.vercel.app/)
