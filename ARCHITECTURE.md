# keel — Architecture

Durable technical constraints that the code cannot show. Product intent is in [PRODUCT.md](PRODUCT.md); visual direction in [DESIGN.md](DESIGN.md).

## Library

- **Content lives in the repository.** Library entries are Markdown, rendered at build time like the rest of the site's writing. Browsing, categories, relationships and search work on the static site without any server, model or network call, so the Library stays fully usable when Ask is off or failing.
- **Integrity is checked at build.** A relationship to an entry that doesn't exist fails the build. Source links and Wayback copies are verified when an entry is written, not by the build.

## Ask

- **Server-side only.** The model call and its credentials never reach the browser.
- **Private until opened.** While Ask is private, access is checked on the server against a secret only the author holds. No user accounts or authentication provider.
- **Hard cost limits.** Rate and spending limits are enforced on the server and, where the provider supports it, by the provider as well, so a leaked secret or bug cannot run up an unbounded bill.
- **Grounded in the Library only.** An answer may cite only Library entries that exist, and citations are checked on the server against the real entries before the answer is shown. Validity is not enough: answers are judged on whether they represent those entries faithfully, keep keel's interpretation apart from source material, and admit when the Library lacks the evidence.
- **Simplest retrieval that works.** How much of the Library goes to the model with each question is chosen from the measured size of the content and the cost per question, and revisited when either changes. No embeddings or vector database without evidence that simpler selection fails.
- **Lightweight record.** While Ask is private, questions, answers and citations are kept only as far as the author needs to review answer quality, without a database or analytics pipeline. Opening Ask publicly means revisiting what is recorded about visitors.
