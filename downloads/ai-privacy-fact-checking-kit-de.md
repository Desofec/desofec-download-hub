# KI-Kit: Datenschutz und Faktenprüfung

Von Desofec AI Studio. Halten Sie private Angaben aus KI-Prompts heraus und prüfen Sie jede KI-Aussage anhand echter Quellen. Dieses Kit ist eine Lernübung, keine Rechtsberatung, und keine Prüfung ist eine Garantie.

## 1. Vor dem Prompt: Datenschutzprüfung
Markieren Sie jedes Detail Ihres Textes als **PRIVAT** oder **NUTZBAR**, bevor Sie etwas in ein KI-Tool einfügen.
- Namen realer Personen, E-Mail-Adressen, Telefonnummern und Wohnadressen: PRIVAT.
- Gesundheits-, Finanz- und Kontodaten, Passwörter, Ausweisnummern und rechtliche Angelegenheiten: PRIVAT.
- Kunden-, Schüler-, Patienten- oder Personaldaten und vertrauliche Geschäftsinformationen: PRIVAT.
- Nur die Fakten, die die Aufgabe wirklich braucht: NUTZBAR.
- Prüfen Sie die aktuellen Datenschutzeinstellungen und Bedingungen des KI-Tools selbst, etwa Chatverlauf oder Trainingsoptionen. Gehen Sie nicht davon aus, dass sie sicher sind.

## 2. Platzhalter zum Schwärzen
Ersetzen Sie private Angaben durch neutrale Platzhalter und behalten Sie das Original privat.
- Person: [PERSON A], [PERSON B]
- Kontakt: [E-MAIL], [TELEFON], [ADRESSE]
- Organisation oder Konto: [ORGANISATION], [KONTO]
- Gesundheits- oder andere sensible Angaben: vollständig entfernen, wenn die Aufgabe sie nicht braucht; nicht darauf anspielen.
- Lesen Sie jeden Prompt vor dem Senden noch einmal und zählen Sie die verbliebenen privaten Angaben. Das Ziel ist 0.

Übungsbeispiel (fiktiv): „Alex Example (alex@example.test, +00 0000 0000) sagt, das Treffen der Ehrenamtlichen ist am 2030-03-14 um 18:00 in Raum B. Verspätung wegen eines Arzttermins.“ wird zu „[PERSON A] ([E-MAIL], [TELEFON]) sagt, das Treffen der Ehrenamtlichen ist am 2030-03-14 um 18:00 in Raum B.“

## 3. Arbeitsblatt zur Aussagenprüfung
Zerlegen Sie eine KI-Antwort in eine Aussage pro Zeile und vergleichen Sie jede Aussage nur mit Ihren Quellen.

| ID | Aussage | Nachweis aus Ihrer Quelle | Bewertung |
|----|---------|---------------------------|-----------|
| C1 | | | BELEGT / WIDERLEGT / QUELLE FEHLT |
| C2 | | | |
| C3 | | | |
| S1 | Genannte Quelle | In Ihren Quellen gefunden? | GEFUNDEN / ZITAT NICHT GEFUNDEN |

Fiktive Übung Riverside Library: Das Quellenblatt nennt Montag-Freitag 09:00-18:00, Samstag 10:00-14:00, sonntags geschlossen, kostenlose Mitgliedschaft für Einwohner und 12 Laptops mit Ausleihe für 2 Stunden. Die KI-Zusammenfassung behauptete 7 Tage geöffnet und 50 Laptops (WIDERLEGT), Samstag 10:00-14:00 und kostenlose Mitgliedschaft (BELEGT), gegründet 1952 (QUELLE FEHLT) und nannte „City Library Report 2029“ (ZITAT NICHT GEFUNDEN). Ergebnis: 2 BELEGT, 2 WIDERLEGT, 1 QUELLE FEHLT.

## 4. Sichere Prompt-Vorlagen
- **Nur Kategorien**: „Welche Arten von Angaben in einer Nachricht sind normalerweise persönlich oder sensibel? Nenne nur Kategorien.“
- **Geschwärzte Aufgabe**: „Schreibe nur anhand dieses geschwärzten Textes [AUFGABE]. Lass die Platzhalter stehen und rate nicht, wen sie bezeichnen: [GESCHWÄRZTER TEXT]“
- **Aussagen zerlegen**: „Zerlege diesen Text in einzelne Tatsachenaussagen, eine pro Zeile. Füge nichts hinzu, bewerte und korrigiere nichts: [TEXT]“
- **Nur mit der Quelle prüfen**: „Vergleiche jede Aussage nur mit dieser Quelle. Zitiere den Nachweis oder schreibe ‚nicht in der Quelle‘. Erfinde keine Zitate: [AUSSAGEN] [QUELLE]“
- **Nur Formulierung**: „Verbessere die Formulierung, ohne Fakten, Zahlen oder Quellen hinzuzufügen, zu entfernen oder zu ändern: [KORRIGIERTER TEXT]“

## 5. Ehrliche Prüfung und Grenzen
- Korrigieren Sie widerlegte Aussagen mit dem Wortlaut der Quelle und entfernen Sie unbestätigte Aussagen oder kennzeichnen Sie sie als UNBESTÄTIGT.
- Erfinden, erraten oder „ergänzen“ Sie niemals eine Quelle oder ein Zitat. Entfernen Sie Zitate, die Sie nicht finden.
- Prüfen Sie jede KI-Überarbeitung erneut anhand Ihrer Quellen, bevor Sie sie verwenden.
- Halten Sie die fiktive Übung Riverside Library privat: Die Freigabe bleibt BLOCKIERT, weil es keine echte Redaktion gibt, und Rückmeldungen sowie Ergebnisse bleiben NICHT ERHOBEN.
- Folgen Sie bei echter Arbeit den Regeln Ihrer Organisation, holen Sie eine tatsächliche Freigabe ein und fragen Sie bei Rechts- oder Sicherheitsfragen eine qualifizierte Person.
