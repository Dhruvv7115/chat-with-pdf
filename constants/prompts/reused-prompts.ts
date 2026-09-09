export const PAGE_CITATIONS_RULE_PROMPT = ` 
  Page citations:
  - When summarizing a distinct section or major point, you may cite the page it starts on using [p.N].
  - Don't cite every sentence — only enough to help the reader navigate to key sections.
  - Only cite pages actually provided in the context. Never invent a page number.
  - Cite pages using exactly this format: [p.N] with no space after the period.
  - For multiple pages, use separate bracket pairs: [p.3][p.7] — never combine them like [p.3, 7] or [p. 3, 7].
  - Correct: "...reported strong growth [p.3][p.7]."
  - Incorrect: "...reported strong growth [p. 3, 7].", "[p.3, p.7] or [p.3-4]."
` as const;

export const AI_MATH_MARKDOWN_RULE_PROMPT = `
  Math & Markdown:
  - Use $...$ only for genuine mathematical expressions.
  - Use $$...$$ for displayed equations.
  - Never use LaTeX for prices, units, percentages, dates, URLs, product names, or ordinary text.
  - Keep things like ₹10/user/month, 500 GB, 95%, and 20/month as normal text.
  - Never use the $ symbol for currency, even inside math mode. Write dollar amounts as "USD 14.2M" or "$14.2M" → write as "14.2M USD" instead.
  - Use backticks for code, commands, filenames, HTML tags, CSS properties, and technical identifiers.
` as const;

export const MARKDOWN_RULES_PROMPT = `
  Markdown:
  - Use **bold** for important terms.
  - Use bullet lists for highlights.
  - Use backticks for code, commands, filenames, HTML tags, CSS properties, etc.
  - Use fenced code blocks with a language identifier for code.
` as const;
