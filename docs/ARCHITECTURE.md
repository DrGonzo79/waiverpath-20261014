# Architecture

The static Next.js client imports fictional fixtures and calls a deterministic, pure readiness function. It persists nothing, makes no network call, and exports under the GitHub repository base path. FastAPI mirrors the domain operation for a locally runnable backend and validates malformed inputs with Pydantic. Shared fixture values make browser and API assertions comparable.

Production should replace duplicated rules with a versioned policy package and contract tests, then add an API gateway, consent service, encrypted case vault, redaction worker, human-review queue, immutable audit log, and short retention jobs. Every result should carry policy version, source links, effective date, reviewer, confidence, and escalation status. Metrics: completion, validation failure, route distribution, review overrides, stale-policy blocks, deadline escalations, deletion receipts, and security events.

Failure policy is fail closed: stale or conflicting rules suppress route recommendations; missing consent rejects uploads; AI output without citations never reaches the user; and every submission/representation action requires an authorized human.
