# No-Code Automation Kit

By Desofec AI Studio. Save time by letting tools handle repetitive work.

## The automation formula
**Trigger -> Action(s) -> Result.** Example: "New form response -> add row to a sheet -> send a Slack/email notice."

## Step 1: Find what to automate
Good candidates are tasks that are repeated weekly, follow clear rules, and move data between apps. List five tasks and score each 1-5 for frequency and annoyance. Start with the highest score.

## Step 2: Starter workflow templates
1. **Lead capture**: form submission -> spreadsheet row -> confirmation email.
2. **Content digest**: new items in an RSS feed -> AI summary -> weekly email.
3. **Task intake**: email with a label -> new task in your task manager.
4. **Meeting follow-up**: calendar event ends -> create notes doc -> remind attendees.
5. **File organizer**: new file in a folder -> rename by date -> move to an archive.

## Step 3: Build it (Zapier, Make, or similar)
1. Create a free account and a new scenario/zap.
2. Pick the trigger app and connect your account.
3. Add actions one at a time, testing after each.
4. Name it clearly, for example "Leads -> Sheet -> Email".
5. Turn it on and check the run history after a day.

## Reliability checklist
- Add a notification when a run fails.
- Avoid storing secrets in plain text.
- Keep a short doc that says what each automation does.
- Review your automations monthly and switch off unused ones.
