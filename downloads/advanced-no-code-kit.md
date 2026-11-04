# Advanced No-Code Automation Kit

By Desofec AI Studio. Build automations that keep working: clean data, branches, retries, alerts and a runbook.

## Process map
- Trigger, data in, decisions, actions, owner.
- Runs per week and minutes by hand.
- Cost of a mistake, and where a human must check.

## Data checks (first step of every workflow)
- Required fields present; stop with a clear message if not.
- Text trimmed; dates in one format; amounts are numbers.
- Duplicate check: look up the event ID before creating anything.

## Decision table
| Condition | Action |
|---|---|
| Normal, low risk | Handle automatically |
| High value or sensitive | Send for human approval |
| Bad or missing data | Stop and log |
| Anything else | Send for human review |

## Error plan
Retry a few times, then stop and alert the owner with: automation, failed step, record ID, error, retries used and what to do.

## Weekly check
Failures, skipped runs, minutes saved, connections to remove, last reviewed date.

## Runbook headings
Purpose, owner and backup, accounts used (names only), how to pause, common failures and fixes. Never store passwords or keys in it.

Plans, tools and menu names change, so follow each tool's current documentation.
