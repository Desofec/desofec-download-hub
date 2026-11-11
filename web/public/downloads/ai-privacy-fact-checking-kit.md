# AI Privacy and Fact-Checking Kit

By Desofec AI Studio. Keep private details out of AI prompts and check every AI claim against real sources. This kit is learning practice, not legal advice, and no check is a guarantee.

## 1. Before you prompt: privacy check
Mark every detail in your text as **PRIVATE** or **OK TO USE** before you paste anything into an AI tool.
- Names of real people, email addresses, phone numbers and home addresses: PRIVATE.
- Health, money, account, password, identity-number and legal details: PRIVATE.
- Customer, student, patient or employee records and confidential business information: PRIVATE.
- Only the facts the task actually needs: OK TO USE.
- Check the AI tool's current privacy settings and terms yourself, such as chat history or training options. Do not assume they are safe.

## 2. Redaction placeholders
Replace private details with neutral placeholders and keep the original private.
- Person: [PERSON A], [PERSON B]
- Contact: [EMAIL], [PHONE], [ADDRESS]
- Organisation or account: [ORGANISATION], [ACCOUNT]
- Health or other sensitive details: remove them completely if the task does not need them; do not hint at them.
- Before sending a prompt, reread it and count the private items left. The target is 0.

Practice example (fictional): "Alex Example (alex@example.test, +00 0000 0000) says the volunteer meeting is on 2030-03-14 at 18:00 in Room B. Late because of a medical appointment." becomes "[PERSON A] ([EMAIL], [PHONE]) says the volunteer meeting is on 2030-03-14 at 18:00 in Room B."

## 3. Claim-check worksheet
Split an AI answer into one claim per line, then compare each claim with your sources only.

| ID | Claim | Evidence from your source | Verdict |
|----|-------|---------------------------|---------|
| C1 | | | SUPPORTED / CONTRADICTED / NEEDS SOURCE |
| C2 | | | |
| C3 | | | |
| S1 | Cited source | Found in your sources? | FOUND / CITATION NOT FOUND |

Fictional Riverside Library practice: the source sheet says Monday-Friday 09:00-18:00, Saturday 10:00-14:00, closed Sunday, membership free for residents and 12 laptops with 2-hour loans. The AI summary claimed it is open 7 days and lends 50 laptops (CONTRADICTED), Saturday 10:00-14:00 and free membership (SUPPORTED), founded in 1952 (NEEDS SOURCE) and cited "City Library Report 2029" (CITATION NOT FOUND). Result: 2 SUPPORTED, 2 CONTRADICTED, 1 NEEDS SOURCE.

## 4. Safe prompt templates
- **Categories only**: "Which kinds of details in a message are usually personal or sensitive? Give categories only."
- **Redacted task**: "Using only this redacted text, write [TASK]. Keep the placeholders and do not guess who they are: [REDACTED TEXT]"
- **Split claims**: "Split this text into separate factual claims, one per line. Do not add, judge or correct anything: [TEXT]"
- **Source-only check**: "Compare each claim with this source only. Quote the evidence or say 'not in source'. Do not invent citations: [CLAIMS] [SOURCE]"
- **Wording only**: "Improve the wording without adding, removing or changing any fact, number or source: [CORRECTED TEXT]"

## 5. Honest review and limits
- Correct contradicted claims with the source wording, and remove or mark unverified claims as UNVERIFIED.
- Never invent, guess or "complete" a source or citation. Remove citations you cannot find.
- Recheck any AI rewrite against your sources before you use it.
- Keep the fictional Riverside Library exercise private: approval stays BLOCKED because there is no real editor, and feedback and results stay NOT COLLECTED.
- For real work, follow your organisation's rules, get actual approval and ask a qualified person when legal or safety questions arise.
