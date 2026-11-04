# Advanced Web Development with AI Kit

By Desofec AI Studio. A safe routine for building real apps with an AI coding assistant.

## The routine
1. Write a one-page spec: users, max 3 "must do" items, "must not do", acceptance checks.
2. Start Git and commit before the AI changes anything. One branch per feature.
3. Ask for ONE small change at a time and name the files it may edit.
4. Write tests first (Node: `node --test`); let the AI write code until they pass.
5. Review the diff before every commit. Never merge code you have not read.
6. Deploy from main, set secrets as environment variables, check the live site.

## Small-change prompt
"Here is my spec: [spec]. Make ONE change: [change]. Only edit: [files]. Do not add dependencies without asking. Explain what you changed, list assumptions and give me a test command."

## Review checklist
- Only the expected files changed.
- No new dependency you did not approve.
- No keys, tokens or passwords in the code.
- User input is checked before it is used.
- Tests were not weakened or deleted to make them pass.
- Error messages do not reveal internals.

## Pre-deploy checklist
Tests pass, secrets in environment variables, README updated, rollback plan known, live site checked.

Plans, tools and menu names change, so follow each tool's current documentation.
