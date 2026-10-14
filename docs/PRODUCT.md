# Product plan

## ICP and JTBD

The initial ICP is an adult child or spouse handling a Title II overpayment notice for a beneficiary whose check covers essentials. When the notice arrives, they need to identify the correct response path, quantify immediate cash pressure, and assemble the right evidence before recovery begins—without disclosing sensitive data to an untrusted form.

## MVP and offer

The MVP is a no-PII readiness check plus a human-reviewed evidence map. It calculates a transparent withholding scenario, distinguishes waiver/lower-recovery/reconsideration routes, and produces a checklist. Validate an educational review first. Treat the report’s free check, $299 filing, $900 waiver package, and $49/month monitoring as an offer ladder to test, not entitlement or legal promises.

## Data model

- `Intake`: program, notice date, amount, benefit, household cash flow, reporting history, consent.
- `PolicyRule`: source, jurisdiction/program, effective dates, reviewer, supersession.
- `RouteAssessment`: candidate route, reason, uncertainty, required human reviewer.
- `EvidenceItem`: category, source, redaction state, verification state, retention limit.
- `CaseAction`: deadline, owner, status, source receipt, escalation.
- `AccessEvent`: actor, purpose, artifact, timestamp, deletion receipt.

The demo persists none of this and uses shared fictional fixtures.

## Architecture and AI strategy

Static Next.js delivers the public demo and deterministic TypeScript rules. FastAPI owns the same server-side domain contract for local integration. Production needs policy-as-data, a consented case vault, encryption, redaction, immutable audits, role-limited access, and human approval. AI may summarize user-provided evidence only with citations and structured uncertainty. It must never infer a filing deadline, submit a form, or represent a claimant without verified authority.

## Economics and GTM

The report models 50 qualified leads/month, 20% core conversion, ten cases, and a $900 blended price for $9K/month; all are assumptions. Start with twenty moderated/community or partner conversations, five observed readiness checks, and explicit price acceptance. Legal-aid overflow, caregiver organizations, benefits counselors, and constituency-service teams are better trust channels than cold ads. Compare cost-to-serve against $299 and $900 offers before building continuity.

## Validation, moat, and risks

The decisive test is not form completion; it is whether families trust and pay for a compliant review that improves their next action. Track completion, comprehension, route corrections, days saved, accepted prices, human-review minutes, escalations, and harm near-misses. The potential moat is policy operations plus audited outcomes and a trusted representative network. Existential risks are unauthorized practice/fee rules, privacy breach, wrong guidance, inability to acquire trust, low family payment, and policy reversal.

## 30 / 60 / 90 days

- **30:** obtain specialist compliance review; observe ten redacted cases; test $299/$900 acceptance; sell at most one approved concierge pilot.
- **60:** deliver five human-reviewed evidence maps; establish referral and escalation criteria; measure review cost and action changes.
- **90:** require three paid compliant cases and two partner referrals; add policy versioning and secure intake only if thresholds pass. Kill the service if counsel rejects the boundary or no paid signal appears.
