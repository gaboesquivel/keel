# keel — Architecture

Durable technical constraints that the code cannot show. Product intent is in [PRODUCT.md](PRODUCT.md); visual direction in [DESIGN.md](DESIGN.md).

## Library

- **Content lives in the repository.** One Markdown file per concept, with its sources (author, work, URL, date checked, archived copy) and labelled relationships in the front matter beside the text; topics and starting questions are curated in one file next to them. Pages are rendered at build time. Browsing, topics, questions, relationships and search work on the static site without any server, model or network call, so the Library stays fully usable when Ask is off or failing.
- **Search is local.** The build emits a small index of titles, summaries, topics and keywords that the browser filters instantly. No search service, embeddings or vector store at this size.
- **Integrity is checked at build.** An unknown topic, a relationship or question that points to a missing entry, a missing required section or an invalid source record fails the build. Source links and Wayback copies are verified when an entry is written, not by the build.

## Ask

- **Server-side only.** The model call and its credentials never reach the browser.
- **Vercel AI SDK through AI Gateway.** One bounded call per question with a structured answer; no agent loop, tools or workflow. The model is chosen for faithful synthesis at modest cost and named in one place.
- **Private until opened.** While Ask is private, access is checked on the server against a secret only the author holds, exchanged once for an httpOnly cookie. No user accounts or authentication provider. Without the Gateway key or the secret, Ask is simply absent.
- **Hard cost limits.** The server bounds every request (question length, context sent, output tokens, timeout). The spending ceiling is the AI Gateway budget on the key Ask uses, because a per-instance counter in serverless functions is not a global limit; a distributed rate limit is added only if Ask is opened beyond the author.
- **Grounded in the Library only.** An answer may cite only Library entries that exist, and citations are checked on the server against the real entries before the answer is shown. Validity is not enough: answers are judged on whether they represent those entries faithfully, keep keel's interpretation apart from source material, and admit when the Library lacks the evidence.
- **Simplest retrieval that works.** How much of the Library goes to the model with each question is chosen from the measured size of the content and the cost per question, and revisited when either changes. No embeddings or vector database without evidence that simpler selection fails.
- **Lightweight record.** While Ask is private, questions, answers and citations are kept only as far as the author needs to review answer quality, without a database or analytics pipeline. Opening Ask publicly means revisiting what is recorded about visitors.
