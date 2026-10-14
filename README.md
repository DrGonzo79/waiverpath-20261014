# WaiverPath

A runnable concept prototype for turning a Social Security overpayment notice into a transparent readiness plan. It uses fictional data, stores nothing, and is **educational only—not legal advice, representation, or an SSA service**.

## What works

- Choose one of three fictional households or edit seven intake fields.
- Calculate a modeled default withholding amount and essential-expense gap.
- Compare waiver, lower-recovery, and reconsideration routes with caveats.
- Track a five-item evidence pack locally in the current page session.
- Exercise loading, validation, retry, error, empty, and mobile states.
- Call the equivalent tested FastAPI domain operation locally.

## Run

```bash
npm ci
npm run dev
```

In another shell:

```bash
uv sync --project api --locked
uv run --project api uvicorn api.main:app --reload
```

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm audit --omit=dev --audit-level=high
uv run --project api pytest api/tests
```

GitHub Pages hosts only the static frontend. The Python backend is runnable and tested source, not deployed. See `research/notes.md` for derived source analysis and `docs/` for the product, architecture, score, Office Hours, CEO review, and phased build prompts.
