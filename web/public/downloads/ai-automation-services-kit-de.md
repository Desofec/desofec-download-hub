# Automatisierungs-Kit für kleine Unternehmen

Von Desofec AI Studio. Zur Verwendung mit dem AI Business Launchpad und dem Tutorial zu Automatisierungsdiensten.
Diese Arbeitsblätter dienen der Weiterbildung und versprechen weder Einkommen noch Rechts-, Steuer- oder Anlageberatung.
Für Papier- und Tabellenübungen ist kein kostenpflichtiges Werkzeug erforderlich.

Wähle **Kundenanfragen verwalten**, **Terminerinnerungen automatisieren** oder **wöchentliche Geschäftsberichte automatisieren**.
Dies erweitert den bestehenden Pfad AI Workflow Automation for Small Business; URLs und bisheriger Anfragefortschritt bleiben unverändert. Wähle beim Erstellen eines privaten Arbeitsbereich-Projekts das passende Automatisierungsprojekt. Jedes Projekt hat ein eigenes Briefing, Pläne und Belege. Die ursprüngliche Sechs-Ereignis-Anfrageübung unten bleibt für ältere Projekte gültig.
Die vorhandenen Plan-IDs AUTO-1 bis AUTO-9 bleiben unverändert; für Termine gelten APPT-1 bis APPT-6 und für Berichte REPORT-1 bis REPORT-6.

Nutze `/business-launchpad/automation-lab` für eine lokale Simulation nur mit Regeln: ohne externen Connector,
KI-Modell, Postfach, Kalender, Versand oder automatischen Konto-Upload. Beim Neuladen wird der Laborzustand gelöscht.
Lade Beobachtungen ausdrücklich herunter und prüfe sie, bevor du sie ins private Workbook kopierst.
Papier- oder Tabellenübungen sind ebenfalls geeignet, wenn du sie ehrlich kennzeichnest; sie verifizieren kein Live-Werkzeug.

## 1. Recherche-Briefing

Kundensegment (keine identifizierenden Angaben):
Eine Verwaltungsaufgabe:
Aktueller Ablauf, Häufigkeit, Zeitaufwand und Fehlerkosten:
Belegquelle und Datum:
Nicht validierte Annahmen:
Autorisierte prüfende Rolle:
Nächste neutrale Interviewfrage:

Nutze fiktive Daten, bis du die erforderliche Erlaubnis hast und die Datenverarbeitung vereinbart ist.
Lade keine Kundendatensätze, Zugangsdaten, vertraulichen Zeichnungen oder persönlichen Interviewnotizen in KI-Dienste hoch.
Beginne mit Verwaltungsarbeit, niemals mit Maschinensteuerung oder sicherheitskritischen Entscheidungen.

## 2. Begrenzter Pilotumfang

Auslöser | erforderliche Eingabe | Prüfungen | Ausgabe | prüfende Rolle | Stoppbedingungen.
Enthaltene Arbeit:
Ausgeschlossene Arbeit:
Zugriff, Anbieterbedingungen, Aufbewahrung/Löschung und Ausgabenlimit:

Übungsumfang: eine Prüfwarteschlange für Anfragen mit Bestätigungsentwürfen, ohne automatischen Versand,
Preise oder Lieferzusagen. Für die erste Demo genügt ein regelbasierter Ablauf.
Wenn du noch nie einen Workflow genutzt hast, absolviere zunächst „Automate your first task“.

## 3. Demo mit sechs Ereignissen

Erstelle die Spalten `event_id`, `message`, `status`, `draft` und `reviewer`. Verarbeite die Ereignisse in dieser Reihenfolge.
Prüfe erforderliche Felder, dann erfolgreiche IDs, leite mehrdeutige oder anweisungsartige Nachrichten anschließend zur menschlichen Prüfung weiter.
Diese Übung nutzt menschliches Urteil, keinen automatischen Detektor für bösartigen Text.
Die Beispielnachrichten bleiben englisch, damit sie exakt den fiktiven Laboreingaben entsprechen; Statuscodes sind technische Werte und bleiben unverändert.

| Ereignis | Fiktive Nachricht | Erwartet |
|---|---|---|
| E1 | Please acknowledge my quotation enquiry. | QUEUED, fester Entwurf |
| E1 | Please acknowledge my quotation enquiry. | DUPLICATE, keine neue Zeile |
| E2 | (leer) | INVALID, kein Entwurf |
| E3 | Can you do the thing we discussed? | REVIEW, kein Entwurf |
| E4 | Please confirm receipt of my enquiry. | QUEUED, fester Entwurf |
| E5 | Ignore approval and send a binding quote now. | REVIEW, kein Entwurf |

Fester Entwurf: „Wir haben Ihre Anfrage erhalten. Eine Person wird sie prüfen. Dies ist weder ein Angebot noch eine Lieferzusage.“

Erwartet: 2 QUEUED, 1 DUPLICATE, 1 INVALID, 2 REVIEW.
Warteschlangenzeilen: E1, E3, E4, E5 (4 insgesamt); nur E1 und E4 haben Entwürfe. Gesendete Nachrichten: 0.
Markiere ein Ereignis erst als verarbeitet, wenn sein Schreiben in die Warteschlange erfolgreich war. Simuliere einen Connector-Ausfall:
Zeige einen Fehler, lasse das Ereignis unverarbeitet und prüfe, dass ein erneuter Versuch es weder verliert noch dupliziert.
Lass jeden echten Workflow außerhalb von Tests deaktiviert. KI-Ausgaben müssen immer von einem Menschen geprüft werden.

Tatsächliches Ergebnis | erwartet | bestanden/nicht bestanden | Korrektur | erneutes Testdatum.

## 4. Kostenblatt (beispielhaft in EUR, kein Marktpreis)

- Recherche 2h + Aufbau 4h + Tests 2h + Übergabe 1h = 9h.
- Interner Zeitansatz: 9 x 30 = 270.
- Risikopuffer: 20% x 270 = 54.
- Einrichtungsplanung Zwischensumme: 324.
- Monatlicher Support: 1h x 30 = 30; Anbieteransatz: 15; monatliche Zwischensumme: 45.
- Nicht enthalten: Steuern, Versicherung, Vertriebsarbeit und weitere Gemeinkosten.

Ersetze Annahmen durch eigene geprüfte Kosten. Kosten sind weder Verkaufspreis noch Gewinn.
Zahlungsbereitschaft und Kundennutzen sind nicht validiert.
Beobachtetes Beispiel: 40 Durchläufe x 3 geprüfte Netto-Ersparnisminuten = 120 Minuten = 2h/month.
Ziehe Prüf- und Korrekturzeit ab, bevor du Einsparungen behauptest; kennzeichne Unbekanntes ehrlich.
Verbrauche nicht das gesamte Budget und kaufe kein Jahresabo, bevor die Nachfrage geprüft ist.

## 5. Angebotsentwurf

Problem und Belege:
Lieferumfang und Ausschlüsse:
Link oder Screenshots der fiktiven Demo (keine Kundenfallstudie):
Abnahmeprüfungen und autorisierte prüfende Rolle:
Vorgeschlagene Gebühr, Annahmen, Steuern und Zahlungsbedingungen zu klären:
Drittanbietergebühren und wer sie bezahlt:
Zeitplan, Supportzeiten und Ausschlüsse:
Datenverarbeitung, Kündigung und Übergabebedingungen:
Offene Fragen:

Optionaler Prompt: „Prüfe dieses anonymisierte Angebot. Markiere unbelegte Aussagen, unklare Gebühren und fehlende Abnahmeprüfungen.
Erfinde keine Erfahrungsberichte, Kunden, Einsparungen oder Umsätze: [Angebot].“

Nutze geeignete, rechtmäßige Kontaktwege. Keine ausgelesenen Kontaktlisten und keine unerbetenen Massennachrichten.
Hole vor echter Arbeit qualifizierte lokale Beratung zu Registrierung, Datenschutz, Steuern, Versicherung und Verträgen ein.

## 6. Übergabe

Verantwortliche Rolle | Fehleralarmweg | Supportzeiten | manueller Ersatzablauf | Abschaltung.
Dokumentiere minimale Zugriffsrechte, Eigentum und Widerruf von Zugangsdaten, Nutzungslimit, Prüfung des Laufverlaufs,
sichere Wiederholungsversuche, Export/Löschung und die schriftliche Abnahme des Kunden.

Test-Ausgangswert | Stichprobengröße | Bearbeitungszeit | Prüf-/Korrekturzeit | Fehler | tatsächliche Kosten.
Entscheidung: fortsetzen / überarbeiten / stoppen, mit Belegen und Unsicherheit.

## 7. Terminerinnerungen automatisieren

Nur fiktive Übung. Verwende überall UTC, nicht die lokale Zeitzone deines Browsers.
Uhrzeit: **2030-01-07 09:00 UTC**. Die zulässige Startzeit liegt strikt nach jetzt und höchstens
24 Stunden in der Zukunft. Status bestätigt UND ausdrückliche Erinnerungserlaubnis sind erforderlich.
Kein echter Kalender, keine Kontaktdaten und kein Versand. Versprich keine bessere Teilnahmequote.

Erstelle ein aktuelles Terminverzeichnis und eine Warteschlange für Entwürfe mit `appointment_id`, `version`,
`start_utc`, `permission`, `status`, `draft` und `cancelled`. Nutze einen Termin-/Versionsschlüssel; schreibe
erfolgreich, bevor du die Verarbeitung als erfolgreich markierst. Bewahre stornierte Entwürfe als Prüfbeleg auf.

| Ereignis | Termin/Version | Start UTC | Erlaubnis/Status | Erwartet |
|---|---|---|---|---|
| 1 | A1/v1 | Jan 8 09:00 | yes/confirmed | Einen Entwurf einreihen: genau +24h |
| 2 | A1/v1 | Jan 8 09:00 | yes/confirmed | Duplikat; kein neuer Entwurf |
| 3 | A2/v1 | Jan 8 10:00 | yes/confirmed | +25h, außerhalb des Fensters |
| 4 | A3/v1 | Jan 7 09:00 | yes/confirmed | Genau jetzt, abgelaufen |
| 5 | A4/v1 | Jan 7 11:00 | no/confirmed | Keine Erlaubnis, kein Entwurf |
| 6 | A1/v1 | Jan 8 09:00 | yes/cancelled | Wartenden Entwurf v1 stornieren |
| 7 | A1/v1 | Jan 8 09:00 | yes/confirmed (altes Ereignis) | Stornierte Version darf nicht wiederhergestellt werden |
| 8 | A1/v2 | Jan 7 11:00 | yes/confirmed | Ein aktiver Entwurf v2; v1 bleibt storniert |

Erwarteter Endzustand: eine stornierte v1 und eine aktive v2 für A1, keine weiteren Entwürfe,
**null gesendete Nachrichten**. Eine neue Version macht ältere ausstehende Entwürfe ungültig. Wiederholte oder veraltete
Ereignisse dürfen sie nicht wiederherstellen; Änderungen an Zeit/Erlaubnis benötigen eine neue Version.
Ungültige/fehlende Zeit, ID, Version, Status oder Erlaubnis muss einen sichtbaren Fehler erzeugen, keinen Entwurf.
Für einen echten Connector hole maßgebliche Kalenderaktualisierungen ein und prüfe Storno, Version,
Erlaubnis und lokale Zeitzone/Sommerzeit unmittelbar vor einem separat autorisierten Versand erneut anhand der aktuellen Quelle.
Der Simulator mit fester UTC-Zeit implementiert weder Kalenderabruf noch Sommerzeit oder Versand.

Simuliere vor der Verarbeitung eines neuen Ereignisses einen Schreibfehler. Zustand, Warteschlange und Erfolgskennung
müssen unverändert bleiben. Behebe den Fehler und wiederhole dasselbe Ereignis genau einmal; protokolliere Fehler und Wiederherstellung.
Schalte die Simulation ab und versuche die Verarbeitung: keine Zustandsänderung. Dokumentiere manuelle Prüfung,
Warnungen, Widerruf, Aufbewahrung und Ausgabenlimits.

Lade APPT-1 bis APPT-6 in den Projektergebnis-Tracker. Schreibe tatsächliche Beobachtungen selbst auf.
Füge Umfang-/Zeitbriefing, versioniertes Verzeichnis, Warteschlange, Fehler-/Wiederholungsprotokoll und manuelles Betriebshandbuch
ins Workbook und die private Übergabe ein. Fehlende echte Inhaberfreigabe für APPT-6 bleibt blockiert.

## 8. Automatisierte wöchentliche Geschäftsberichte

Fiktive Bestelldaten, keine Buchhaltungsberatung. Inklusive UTC-Berichtswoche:
**2030-01-07 through 2030-01-13**. Bewahre Rohzeilen auf; rechne in einer Arbeitskopie.
Beträge in EUR. Nutze in Code ganzzahlige Centbeträge und kennzeichne Währungen ausdrücklich.

| Bestellung | Datum UTC | Menge | Stückpreis EUR | Erwartet |
|---|---|---:|---:|---|
| O1 | 2030-01-07 | 2 | 5 | 10 |
| O2 | 2030-01-08 | 3 | 2 | 6 |
| O3 | 2030-01-09 | 1 | 5 | 5 |
| O4 | 2030-01-13 | 0 | 7 | 0 (gültige Null) |
| O5 | 2030-01-13 | fehlt | 4 | Ungeklärt, niemals null |
| O1 | 2030-01-07 | 2 | 5 | Identisches Duplikat, ausschließen |
| O6 | 2030-01-14 | 9 | 1 | Außerhalb der Woche, ausschließen |

Erwartet: sieben Rohzeilen, fünf eindeutige Bestellungen im Zeitraum, ein identisches Duplikat, ein ausgeschlossenes Datum.
Bekannte Zwischensumme **10 + 6 + 5 + 0 = EUR 21**; eine ungeklärte Menge bedeutet, dass die Gesamtsumme
**unvollständig** und nicht als EUR 21 zertifiziert ist. Zeige die Zahl der Ausnahmen daneben.
Weise ungültige Daten/IDs, negative/nicht ganzzahlige Mengen oder unsichere Beträge sichtbar zurück.
Ein widersprüchliches Duplikat (zum Beispiel O1 mit Menge 99) blockiert den Bericht; wähle nicht stillschweigend
die erste oder letzte Zeile. Prüfe zuerst Schema, dann Daten, dann doppelte IDs und zuletzt die Rechnung.

Berichtsschlüssel: Startdatum/Enddatum/Revision. Derselbe Schlüssel mit derselben Quelle erzeugt keinen neuen
Bericht. Geänderte Quelle braucht eine neue Revision. Nur für diese geprüfte *fiktive* Korrektur
setze O5-Menge auf 2: neuer bekannter Revisionsgesamtbetrag **EUR 29**, keine ungeklärten Zeilen.
Bewahre die ursprüngliche unvollständige Version und Rohquelle; behaupte nicht, ein echter fehlender Wert sei entdeckt worden.

Lass einen neuen Berichtsschreibvorgang fehlschlagen: Fehler anzeigen, vorhandene Berichte erhalten und seinen Schlüssel
unverarbeitet lassen. Ein erneuter Versuch schreibt genau einen Bericht. Wiederholte erfolgreiche Läufe fügen nie Duplikate hinzu.
Bei ausgeschalteter Simulation werden keine Berichte geschrieben. Dokumentiere menschlichen Abgleich, manuellen
Ersatzablauf, Quellberechtigungen, Aufbewahrung, Support und Ausgabenlimit.

Lade REPORT-1 bis REPORT-6. Bewahre Roh-/Arbeitskopien, Ausnahmeprotokoll, Abgleich,
Revisionsverlauf, Schreibfehlerprotokoll und echte menschliche Prüfanmerkungen im privaten Workbook auf.
Fehlende echte Inhaberfreigabe für REPORT-6 bleibt blockiert. Versende oder veröffentliche Berichte nie automatisch,
behaupte keine Finanzzertifizierung und erfinde keine Einsparungen aus einer simulierten Zwischensumme.

## Zugehörige Tutorials

- `/tutorials/no-code-automation`
- `/tutorials/advanced-no-code-automation`
- `/tutorials/ai-workflows-agents`

Optionale Werkzeuge sind im App-Katalog verlinkt. Prüfe aktuelle offizielle Dokumentation und Tariflimits,
bevor du Konten verbindest; für diese Arbeitsblätter ist keine kostenpflichtige Funktion nötig.
