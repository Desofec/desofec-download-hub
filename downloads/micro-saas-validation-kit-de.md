# Micro-SaaS-Validierungskit

Desofec AI Studio. Validierung zum Lernen, kein Produktionsdienst und kein Einkommensversprechen.
Keine kostenpflichtige KI, Zahlungsdaten, Abonnements oder echten Kundendaten erforderlich.

## 1. Problembelege
Übungsidee: ein kurzes Projektupdate aus Name und Status formatieren.
Nutzer/Aufgabe/Häufigkeit:
Aktuelle Ersatzlösung:
Tatsächlicher anonymisierter Interviewbeleg und Datum:
Annahmen:
Kein Interview? Nachfrage als UNVALIDATED (nicht validiert) markieren. Ein Kompliment ist keine Zahlungszusage.

## 2. Minimale Spezifikation
Projekt: getrimmter Name, 1-40 Zeichen. Status: Draft oder Review.
Die Ausgabe lautet exakt wie im Prototyp auf Englisch:

```text
Project: Atlas
Status: Review
```

Leeren/zu langen Namen und ungültigen Status ablehnen.
Ausgeschlossen: KI-Erzeugung, Speicherung, Netzaufrufe, Anmeldung, Abrechnung und Integrationen.
Vor dem Programmieren eine manuelle Version testen.

## 3. Lokaler Prototyp
Das Tutorial unter /tutorials/micro-saas-validation enthält den vollständigen Quelltext von formatter.html.
In eine reine HTML-Textdatei kopieren, lokal öffnen und nur fiktive Namen eingeben.
Es verwendet textContent statt HTML-Einfügung und sendet oder speichert nichts.
Keine KI-API an einen deterministischen Formatierer anschließen.
Prototypmethode: Browser / nur manuell. Eine manuelle Übung beweist keine bestandenen Browserprüfungen.

## 4. Fünf Tests und Kostenannahmen
Eingabe | erwartet | tatsächlich | Beleg | Korrektur/erneuter Test.
1. Atlas + Review: exakt zwei Ausgabezeilen.
2. Leerer Name: sichtbarer Fehler.
3. 40 Zeichen: akzeptiert.
4. Über Entwicklertools ins Feld erzwungene 41 Zeichen: sichtbarer Fehler.
5. `<b>Atlas</b>`: literaler Text, kein Fettdruck-Element.

Hosting-/API-Rechnung für den lokalen Prototyp: keine; tatsächliche Zeit erfassen.
Künftiges Hosting/API/Support/Monitoring/Zahlungsabwicklung/Steuern/Gemeinkosten: TO CONFIRM (zu bestätigen).
Ein Abonnementpreis ist kein Gewinn; aus dieser Stichprobe keine lebenslangen Einnahmen hochrechnen.

## 5. Beobachtung mit Einwilligung
Versuchte Aufgabe:
Beobachtete Verwirrung:
Bestehende Alternative:
Würde es erneut versuchen? Tatsächliche Antwort:
Beleg für wiederkehrenden Bedarf:
Zahlungsbereitschaft: UNVALIDATED ohne direkten Beleg.
In dieser Übung keine Zahlungen oder persönlichen Datensätze erfassen.
Den Angebotsgenerator für den Discovery-/Prototypumfang verwenden, nicht für ein fertiges Abonnementprodukt.

## 6. Entscheidung
Problembelege / Testlücken / beobachteter Nutzen / Unsicherheit / unbekannte Kosten.
Entscheidung: Discovery fortsetzen / überarbeiten / stoppen.
Nächster Beleg, verantwortliche Rolle und Prüfdatum:

Vor einem echten Start Zugriffskontrolle, Datenschutz/Aufbewahrung/Löschung, Abrechnung/Erstattungen,
Monitoring, Support, Sicherheitsprüfung und Wiederherstellung separat planen. Ein lokales Spielzeug ist
nicht produktionsreif.

Prompt: „Prüfe nur diese Beobachtungen und Testergebnisse. Trenne Belege von Annahmen.
Erfinde weder Nachfrageerfolg noch zahlende Nutzer oder Konformität: [anonymisiertes Protokoll].“
