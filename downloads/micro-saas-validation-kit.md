# Micro-SaaS Validation Kit

Desofec AI Studio. Educational validation, not a production service or revenue promise.
Instructions are currently English. No paid AI, payment details, subscriptions or real customer data required.

## 1. Problem evidence
Practice idea: format a short project update from name and status.
User/task/frequency:
Current workaround:
Actual anonymised interview evidence and date:
Assumptions:
No interviews? Mark demand UNVALIDATED. A compliment is not a paid commitment.

## 2. Minimal specification
Project: trimmed name, 1-40 characters. Status: Draft or Review.
Output exactly:

```text
Project: Atlas
Status: Review
```

Reject blank/overlong name and invalid status.
Excluded: AI generation, storage, network calls, login, billing and integrations.
Test a manual version before coding.

## 3. Local prototype
The tutorial at /tutorials/micro-saas-validation includes the complete formatter.html source.
Copy it into a plain-text HTML file, open locally and enter only fictional names.
It uses textContent, not HTML insertion, and sends/stores nothing.
Do not add an AI API to a deterministic formatter.
Prototype method: browser / manual only. A manual exercise cannot prove browser checks passed.

## 4. Five tests and cost assumptions
Input | expected | actual | evidence | correction/retest.
1. Atlas + Review: exact two-line output.
2. Blank name: visible error.
3. 40 characters: accepted.
4. 41 characters forced into the input through developer tools: visible error.
5. `<b>Atlas</b>`: literal text, no bold element.

Local prototype hosting/API bill: none; record your actual time.
Future hosting/API/support/monitoring/payment/tax/overhead: TO CONFIRM.
A subscription price is not profit; no lifetime-revenue projection from this sample.

## 5. Consenting user observation
Task attempted:
Observed confusion:
Existing alternative:
Would try again? Actual response:
Recurring need evidence:
Willingness to pay: UNVALIDATED unless directly supported.
Collect no payments or personal records in this exercise.
Use the proposal builder for discovery/prototype scope, not a ready subscription product.

## 6. Decision
Problem evidence / test gaps / observed usefulness / uncertainty / cost unknowns.
Decision: continue discovery / revise / stop.
Next evidence, owner role and review date:

Before any real launch, separately plan access control, privacy/retention/deletion, billing/refunds,
monitoring, support, security review and failure recovery. A local toy is not production-ready.

Prompt: "Review only these observations and test results. Separate evidence from assumptions.
Do not invent traction, paying users or compliance: [anonymised record]."
