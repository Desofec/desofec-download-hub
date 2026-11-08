# Excel-Kit: Daten bereinigen und PDF-zu-Excel-Konvertierung prüfen

Von Desofec AI Studio. Nutze Excel oder Google Sheets; kostenpflichtige KI-Funktionen sind optional.

Die sechs ursprünglichen Lernpfad-IDs und die ursprüngliche Übung mit fünf Bestellungen unten bleiben unverändert.
Bearbeite nach den Grundlagen die drei Serviceübungen der Reihe nach. Verwende nur fiktive Daten.
Das Labor ist unter `/business-launchpad/spreadsheet-lab`; wähle `ai-spreadsheets` im privaten Arbeitsbereich.
Keine Uploads, automatische OCR, kein KI-Modell, keine echte Finanzberatung und kein automatisches Speichern im Konto.
CSV-Downloads sind Excel-kompatible Daten, keine XLSX-Dateien mit Tabellenblättern oder Formeln.

## In A1 importieren

Importiere die kommagetrennten Daten in vier Spalten. Bewahre Raw auf und arbeite mit einer Kopie.

```csv
Order,Item,Quantity,UnitPrice
A1,Notebook,2,5
A2,Pen,3,2
A3,Notebook,1,5
A4,Pen,0,2
A5,Folder,,4
```

CSV-Überschriften und -Daten bleiben zur Übereinstimmung mit dem Labor englisch; ändere sie nicht.

## Berechnen

Setze `Total` in E1. Kopiere in E2 die Formel bis E6:

```text
=IF(AND(ISNUMBER(C2),ISNUMBER(D2)),C2*D2,"REVIEW")
```

Erwartet: 10, 6, 5, 0, REVIEW.
Die englischen Funktionsnamen und Kommas sind dargestellt; passe Funktionsnamen und Trennzeichen an deine Region an, ohne die Ergebnisse zu ändern.

## Abgleichen

- `=SUM(E2:E6)` muss 21 ergeben: eine bekannte Zwischensumme, keine vollständige Summe.
- `=COUNTIF(E2:E6,"REVIEW")` muss 1 ergeben.
- Bekannter Notebook-Wert: 15. Pen: 6. Folder: ungeklärt, nicht null.
- Stelle bekannte Werte mit Null-Basis, Übungswährung und dem Hinweis „A5 Folder unresolved“ grafisch dar.

## Übergabe

Speichere Raw, Working, Summary und Notes. Dokumentiere Quelle, Formelregion, Prüfungen und die ungeklärte Zeile. Öffne die Datei erneut und prüfe die Ergebnisse.
Nutze nur fiktive oder angemessen freigegebene Daten. Prüfe KI-Vorschläge selbst.

## Serviceprojekt 1: Excel-Daten bereinigen

Bewahre diese siebzeilige Raw-Tabelle auf; dupliziere sie vor jeder Bearbeitung als Working.

```csv
Order,Item,DateUTC,Quantity,UnitPriceEUR
 A1 , Notebook ,2030/01/07,2,5
A2,Pen,2030-01-08,3,2
A3,Notebook,2030-01-09,1,5
A4,Pen,2030-01-13,0,2
A5,Folder,2030-01-13,,4
A1,Notebook,2030-01-07,2,5
A6,Folder,01/02/2030,1,4
```

Entferne Leerzeichen und wandle das eindeutige Datum `YYYY/MM/DD` in `YYYY-MM-DD` um. Vergleiche alle
Felder, bevor du eine identische wiederholte ID entfernst. Erwartet: sieben Rohzeilen, sechs eindeutige
Arbeitszeilen, ein Duplikat entfernt. Ein widersprüchliches Duplikat muss die Bereinigung blockieren, bis die Quelle
geklärt ist; es darf nicht stillschweigend entfernt werden.

Bewahre zwei Ausnahmen: fehlende Menge A5 und mehrdeutiges Datum A6. Leite Tag/Monat-Reihenfolge nicht aus
den Regionseinstellungen deines Computers ab, fülle keinen fehlenden Wert und setze Unbekanntes nicht mit null gleich.
A4 mit null ist gültig. Dokumentiere für jede Änderung alten und neuen Wert, Grund und verbleibende Ausnahme.
Öffne die exportierte CSV in Excel/Sheets erneut und prüfe sechs Zeilen, Zahlentypen und Leerzellen.
CSV enthält weder Formeln noch mehrere Tabellenblätter; speichere deine eigentliche Arbeitsmappe separat.

## Serviceprojekt 2: PDF-zu-Excel-Konvertierung prüfen

Lade `/business-launchpad/spreadsheet-lab/source.pdf` herunter. Es ist ein echtes, einseitiges,
textbasiertes PDF der ursprünglichen fünf Bestellungen mit Datums- und EUR-Angaben.
Das Labor liefert eine fehlerhafte Übertragung: Menge A2 ist 8 statt 3 und A5s Leerzelle wurde fälschlich
mit null gefüllt. Vergleiche alle Zeilen und Zellen, nicht nur die Zwischensumme.
Korrigiere A2 auf 3 und leere A5; die Zahl der Quellzeilen bleibt fünf und A4 null bleibt erhalten.

Bewahre Quell-PDF, Seitenverweise, ungeprüfte Extraktion, korrigierte Übertragung und Korrekturverzeichnis auf.
Beschreibe die Methode ehrlich: bereitgestellte Demo, manuelle Eingabe oder freigegebenes externes Werkzeug.
Diese App lädt keine PDFs hoch, führt keine OCR aus und verspricht keine fehlerfreie Konvertierung.
Gescannte Seiten, verbundene Zellen, getrennte Zeilen und mehrdeutige Zeichen müssen zusätzlich von Menschen geprüft werden.
Echte unbekannte Zellen bleiben ungeklärt, bis der Quellenverantwortliche Belege liefert.

## Serviceprojekt 3: Excel-Geschäftsberichte

Verwende die fünf ursprünglichen Quellzeilen, nicht alle sechs bereinigten Zeilen. Der inklusive UTC-Berichtszeitraum
läuft vom 2030-01-07 bis 2030-01-13. Filtere nach Datum, bevor du summierst.
Gleiche 10 + 6 + 5 + 0 = EUR 21 ab; eine ungeklärte Menge bedeutet, dass die Summe unvollständig ist.
Bekannte Notebook-Zwischensumme: EUR 15, Pen: EUR 6, Folder: unbekannt. Stelle Folder nicht als null dar.

Erstelle die Blätter Raw, Working, Summary und Notes. Dokumentiere Quellrevision, Zeitraum, Währung,
Formelsprache/-trennzeichen, Änderungen und eine ungeklärte Zeile. Nutze ein Diagramm mit Null-Basis für
bekannte Werte, ergänzt um eine zugängliche Texttabelle und einen sichtbaren Hinweis auf den fehlenden Wert.
Wenn du stattdessen die sechs bereinigten Zeilen berichtest, ist A6s mehrdeutiges Datum eine zweite ungeklärte
Ausnahme: Schließe es nicht stillschweigend aus und erwecke nicht den Eindruck eines vollständigen Berichts.
Öffne die Arbeitsmappe erneut und prüfe die Formeln. Dieses Beispiel belegt weder Geschäftstrends noch echte Umsätze,
Steuerrichtigkeit oder verifizierte Einsparungen.

## Privates Angebot, Prüfung und Übergabe

Erstelle ein Tabellenprojekt unter `/business-launchpad/projects?path=ai-spreadsheets`.
Bewahre alle drei Übungen im Briefing und Workbook auf. Begrenze den Umfang auf Datenbereinigung,
Quellprüfung, einen Bericht und eine Korrekturrunde. Liste Eingabeformate, Zeilen-/Seitenlimits,
Ausschlüsse, Fristen, Quellberechtigungen, Aufbewahrung/Löschung, menschliche Prüfung,
Anbieterkosten und Unbekanntes auf. Keine Versprechen perfekter OCR, von Einkommen oder Finanzzertifizierung.

Lade die Projektergebnisse neu und lade SHEET-1 bis SHEET-7 ausdrücklich. Sie beginnen ausstehend;
schreibe deine tatsächlichen Beobachtungen selbst auf. Dokumentiere Korrekturen und erneute Tests.
Fehlende echte Inhaberfreigabe bleibt **blockiert**, nicht bestanden. Die Selbstprüfung im Review Center
prüft kopierten Text, keine externen Dateien. Eine passende fiktive Quelle ist keine Kundenfreigabe.

Private Übergabe: Raw und Working, Original-PDF, korrigierte CSV, tatsächliche Arbeitsmappe, Summary,
Notes, Ausnahme-/Korrekturverzeichnis, Quellrevision, echte Prüfungen nach erneutem Öffnen und nächste Prüfung.
Nutze fiktives/anonymisiertes Material. Konto-Snapshots enthalten erst nach Zustimmung eingegebene Projektbelege;
PDF-, CSV- und XLSX-Dateien werden nicht automatisch hochgeladen. Downloads separat löschen.

## Offizielle Werkzeugreferenzen

- https://support.microsoft.com/en-gb/excel/copilot/get-started-with-copilot-in-excel
- https://workspace.google.com/products/sheets/
- https://workspace.google.com/resources/spreadsheet-ai/

Kernfunktionen anhand indexierter offizieller Dokumentation am 2026-11-05 geprüft.
KI-Verfügbarkeit hängt von Abonnement und Einstellungen ab. Für diese Übungen ist keine kostenpflichtige KI-Funktion nötig.
