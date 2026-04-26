# OpenAI Article Generation Backend Contract

The React admin panel calls a server endpoint and never reads an OpenAI API key in the browser.

## Environment

Store the key only in the backend environment:

```env
OPENAI_API_KEY=sk-...
```

Do not expose this as `VITE_OPENAI_API_KEY` or any other frontend variable.

## Endpoint

`POST /api/admin/articles/generate-ai`

This route must be protected by the same admin authentication as the rest of `/admin`.

Request body:

```json
{
  "topic": "Numerology compatibility by birth date",
  "keywords": ["numerology", "compatibility", "birth date"],
  "language": "English",
  "tone": "Expert, clear",
  "length": 1200
}
```

Server behavior:

1. Validate that the current user is an admin.
2. Generate structured article content with OpenAI on the server.
3. Create a row/document in `articles`.
4. Force `status: "draft"` server-side. Ignore any client-provided status.
5. Return the created draft.

Expected generated fields:

```json
{
  "seoTitle": "SEO title",
  "metaDescription": "Meta description",
  "slug": "article-slug",
  "outline": ["H2 section", "H2 section"],
  "title": "Article title",
  "article": "Full article text",
  "faq": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ],
  "status": "draft"
}
```

The admin UI expects the created article in `response.data.data`, `response.data.article`, or directly in `response.data`.
