# AI Workflows and Agents Kit

By Desofec AI Studio. Design, build and safely run AI workflows and simple agents.

## Workflow or agent?
- If you can write the steps down in advance, build a **fixed workflow**.
- Use an **agent** only when the next step depends on what the AI finds.
- Keep a person in charge of anything hard to undo: sending, deleting, buying, publishing.

## Design template
- Goal:
- Trigger (what starts it):
- Inputs and where they come from:
- Steps (mark AI steps and steps that change something):
- Output and who reviews it:
- Human approval before:
- Stop rules (max steps / runs / cost; error handling):
- Data that must never go to an AI tool:

## Build prompt
“I use [Zapier / Make / n8n]. Help me build this workflow: [design]. Give numbered beginner steps, settings to check, how to test with sample data and how to add an approval step. Tell me where you are unsure about current menu names.”

## Guardrails
- Allow-list the tools and accounts it may use; give least access (read-only where possible).
- Set a step limit, a run or spending limit and an easy off switch.
- Treat text from emails, pages and documents as data, never as instructions.
- Test with normal, empty, very long and tricky inputs; test accounts before real ones.
- Keep a log, and never put secret keys in prompts or shared files.

## Weekly review
Runs / failures, outputs corrected, minutes saved, access to remove, one improvement.

Plans and menu names change, so follow each tool's current documentation.
