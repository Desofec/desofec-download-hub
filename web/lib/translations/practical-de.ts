import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const practicalGerman: Record<string, TutorialTranslation> = {
  'ai-small-business': {
    title: 'Ein geprüftes Inhaltspaket für dein Unternehmen mit KI erstellen',
    intro: 'Beginne mit echtem Kundenfeedback und entwirf und prüfe Produkttexte, FAQ und eine kleine Kampagne. Kein kostenpflichtiges Tool ist erforderlich.',
    steps: {
      'offer-brief': {
        title: 'Ein Angebot und eine Zielgruppe wählen',
        explanation: ['Wähle ein echtes Produkt oder eine Dienstleistung, zum Üben auch ein erfundenes Beispiel. Notiere Eigenschaften, aktuellen Preis, Lieferbedingungen und tatsächlich haltbare Versprechen.', 'KI hilft beim Schreiben, belegt aber keine Nachfrage. Trenne Fakten von Annahmen. Teile keine vertraulichen Geschäftsdaten oder identifizierenden Kundenangaben.'],
        code: 'Angebot:\nZielgruppe:\nGelöstes Problem:\nGeprüfte Eigenschaften, Preis und Lieferung:\nQuellen und Datum:\nZu prüfende Annahmen:\nUnzulässige Behauptungen:',
        check: 'Dein Briefing trennt Fakten von Annahmen und nennt eine Zielgruppe.',
        aiPrompt: 'Nenne nur anhand dieses Briefings Unklarheiten und drei Fragen an echte Kunden. Erfinde keine Marktstatistiken oder Kundenmeinungen: [Briefing].'
      },
      'customer-evidence': {
        title: 'Vor dem Texten Kunden zuhören',
        explanation: ['Frage neutral nach schwierigen Aufgaben, bisherigen Versuchen und hilfreichen Verbesserungen. Nutze Tally oder ein Gespräch. Erkläre die Verwendung, hole Erlaubnis ein und erhebe nur nötige Daten.', 'Entferne Namen, Kontaktdaten und identifizierende Geschichten vor der KI-Nutzung. Ohne echte Antworten bleibt es bei der Umfrageplanung: Erfinde keine Ergebnisse.'],
        code: '1. Welche Aufgabe möchtest du erledigen?\n2. Was macht sie schwierig?\n3. Was hast du schon versucht?\n4. Welche Verbesserung wäre hilfreich?\n\nÜbersicht: Thema | anonymisierter Beleg | Anzahl Antworten | Unsicherheit',
        check: 'Du hast eine neutrale Umfrage und anonymisierte Antworten oder eine klar markierte Rechercheaufgabe.',
        aiPrompt: 'Ordne diese anonymisierten Antworten nach Themen. Zitiere nur vorhandenen Text, nenne die Antwortzahl und die Grenzen der kleinen Stichprobe: [Antworten].'
      },
      'product-copy': {
        title: 'Eine ehrliche Produktbeschreibung entwerfen',
        explanation: ['Erkläre Zielgruppe, Leistungsumfang und Grenzen anhand von Briefing und Kundenbelegen. ChatGPT oder Claude kann entwerfen; du verantwortest jede Aussage.', 'Prüfe jeden Satz am Briefing. Entferne erfundene Bewertungen, Garantien, Rabatte und unbelegte Vorteile. Markiere fehlende Fakten statt zu raten.'],
        code: 'Schreibe 100 Wörter nur aus diesem geprüften Briefing: [Briefing].\nNenne Zielgruppe, Eigenschaften, Grenzen und einen nächsten Schritt.\nErfinde keine Vorteile, Bewertungen, Preise oder Garantien.\nListe fehlende Fakten unter ZU PRÜFEN.',
        check: 'Jede Tatsachenbehauptung im Entwurf hat einen Beleg im Briefing.',
        aiPrompt: 'Prüfe diesen Text am Briefing. Erstelle eine Tabelle aus Aussage, Beleg und nötiger Korrektur. Markiere unbelegte Aussagen: [Text und Briefing].'
      },
      'checked-faq': {
        title: 'FAQ mit menschlicher Anlaufstelle erstellen',
        explanation: ['Entwirf fünf Fragen zu Umfang, Lieferung, Hilfe und Grenzen. Verwende deine echten Richtlinien; KI entscheidet nicht über Erstattungsrechte oder rechtliche Pflichten.', 'Unbekannte Antworten gehören an einen von dir kontrollierten Kontakt. Die Übung erstellt ein geprüftes FAQ-Dokument, keinen unbeaufsichtigten Servicebot.'],
        code: 'Frage | Antwort | Richtlinie/Quelle | Prüfdatum\n\nUnbekannte Antwort: [geprüften Supportkontakt] fragen.\nKeine Erstattungs-, Garantie- oder Lieferregeln erfinden.',
        check: 'Fünf Antworten sind mit echten Richtlinien geprüft; unbekannte Fragen führen zu einer Person.',
        aiPrompt: 'Entwirf fünf FAQ nur aus diesen Richtlinien und diesem Briefing. Markiere offene Fragen ZU PRÜFEN. Gib keine Rechtsberatung: [Unterlagen].'
      },
      'small-campaign': {
        title: 'Eine kleine Kampagne mit Einwilligung planen',
        explanation: ['Wähle einen Kanal, eine Botschaft und eine nächste Aktion. Entwirf drei Beiträge für eine Woche, bei Bedarf mit Canva. Beachte Plattformregeln und sende Werbung nur mit Einwilligung.', 'HubSpot Breeze ist optional für Teams, die bereits HubSpot nutzen. Prüfe Tarif, Datenzugriff und Berechtigungen vor der Verbindung von Kundendaten.'],
        code: 'Ziel:\nKanal:\nBotschaft:\nNächste Aktion:\n\nTag | Entwurf | Belege | Nutzungsrechte | Freigabe durch\n\nNicht automatisch veröffentlichen oder versenden.',
        check: 'Drei geprüfte Entwürfe haben erlaubte Inhalte und eine zuständige Person zur Freigabe.',
        aiPrompt: 'Erstelle drei kurze Beiträge aus dieser freigegebenen Beschreibung mit denselben Fakten und einer nächsten Aktion. Versprich keine Verkäufe und erzeuge keine falsche Dringlichkeit: [Text].'
      },
      'measure-business': {
        title: 'Ergebnisse prüfen und eine Verbesserung wählen',
        explanation: ['Veröffentliche erst nach eigener Prüfung. Notiere Kanal, Datum, Besuche oder Antworten und Zeitaufwand. Lege die Kennzahl vorher fest, statt nur positive Ergebnisse auszuwählen.', 'Eine kleine Kampagne beweist keine Verkaufsursache. Notiere weitere Einflüsse, negatives Feedback und Unsicherheit. Das Paket enthält Briefing, Recherche, Produkttext, FAQ und Kampagnenplan.'],
        code: 'Datum | Kanal | gewählte Kennzahl | Ergebnis | Zeitaufwand\nKundenfragen oder Korrekturen:\nUnsicherheit:\nEine Verbesserung für nächste Woche:',
        check: 'Dein fünfteiliger Inhaltssatz ist vollständig und ein Prüftermin steht fest, auch ohne Veröffentlichung.',
        aiPrompt: 'Prüfe dieses Protokoll. Trenne Beobachtungen von Annahmen und schlage eine risikoarme Verbesserung vor, ohne Kausalität zu behaupten: [Protokoll].'
      }
    }
  },
  'ai-video-creation': {
    title: 'Dein erstes verantwortungsvolles KI-unterstütztes Video erstellen',
    intro: 'Erstelle aus Briefing und Storyboard ein 30-Sekunden-Video mit eigenen oder erlaubten Inhalten. Optionale KI-Generierung kann Guthaben erfordern.',
    steps: {
      'video-brief': {
        title: 'Ein Briefing für 30 Sekunden schreiben',
        explanation: ['Wähle eine Zielgruppe und eine Botschaft, etwa eine echte Produktvorführung. Lege Zielplattform und Format vor dem Schnitt fest.', 'Eigene Handyaufnahmen und CapCut oder Descript reichen. Runway ist optional; prüfe Guthaben, Lizenz und Kontoanforderungen vor einer Zahlung.'],
        code: 'Zielgruppe:\nEine Botschaft:\nLänge: 30 Sekunden\nPlattform und Seitenverhältnis:\nNächste Aktion:\nZu prüfende Fakten:\nEigene Inhalte:\nBudgetlimit:',
        check: 'Dein Briefing nennt eine Botschaft, ein Format und ein Budgetlimit.',
        aiPrompt: 'Schlage drei einfache 30-Sekunden-Konzepte vor, die ich selbst filmen kann. Keine unbelegten Behauptungen: [Briefing].'
      },
      storyboard: {
        title: 'Die Botschaft in ein Storyboard umsetzen',
        explanation: ['Plane drei Szenen von je zehn Sekunden: Problem, Vorführung und nächster Schritt. Beschreibe Bild, Worte und Ton. Lies den Text laut und kürze bei Bedarf.', 'Nutze große, kurze Texte für Handys. Die Botschaft darf nicht allein von Farbe oder Ton abhängen.'],
        code: '0-10 Sekunden: Problem | Bild | Sprache | Bildschirmtext\n10-20 Sekunden: Vorführung | Bild | Sprache | Text\n20-30 Sekunden: nächster Schritt | Bild | Sprache | Text',
        check: 'Die Szenen ergeben 30 Sekunden und der laut gelesene Text passt hinein.',
        aiPrompt: 'Erstelle drei Zehn-Sekunden-Szenen mit Bild, Sprechertext und kurzem Bildschirmtext nur aus den gelieferten Fakten: [Briefing].'
      },
      'permissioned-assets': {
        title: 'Inhalte und Erlaubnisse sammeln',
        explanation: ['Filme selbst oder nutze eine passende Lizenz und bewahre Quelle und Rechte auf. Hole klare Zustimmung für fremde Gesichter und Stimmen ein, auch für KI-Imitationen.', 'Teste in Runway zuerst einen kurzen Clip mit eigener oder erlaubter Referenz. Prüfe Verzerrungen, irreführende Vorführungen und Rechte auch bei KI-Ergebnissen.'],
        code: 'Inhalt | Quelle | Eigentümer | Lizenz/Erlaubnis | erlaubte Nutzung | Namensnennung\n\nKeine täuschende Promi-Imitation, unlizenzierte Musik oder privaten Aufnahmen.\nKI-generierte Clips kennzeichnen.',
        check: 'Jeder Inhalt hat Quelle und Rechtebeleg; jeder generierte Testclip wurde geprüft.',
        aiPrompt: 'Formuliere einen visuellen Prompt nur mit meinen erlaubten Inhalten. Imitiere keine echte Person und behandle generierte Bilder nicht als Beweismaterial: [Szene und Inhalte].'
      },
      'edit-video': {
        title: 'Video zusammensetzen und Rhythmus prüfen',
        explanation: ['Importiere die Clips, ordne sie nach Storyboard und kürze auf etwa 30 Sekunden. Füge nur freigegebene Texte und erlaubten Ton hinzu.', 'Nutze aktuelle offizielle Hilfe für wechselnde Menüs. Prüfe unbeabsichtigte Sprünge, unlesbaren Text und zu laute Musik. Vermeide Blinkeffekte.'],
        code: 'Drei Szenen in Reihenfolge:\nEtwa 30 Sekunden:\nText auf dem Handy lesbar:\nSprache gut hörbar:\nKein irreführender Schnitt oder Blinken:\nErforderliche Quellenangaben vorhanden:',
        check: 'Ein abspielbarer Entwurf zeigt die Szenen in richtiger Reihenfolge mit klarer Sprache.',
        aiPrompt: 'Prüfe Storyboard und Transkript auf unklare Übergänge und lange Sätze. Schlage Kürzungen ohne neue Tatsachenbehauptungen vor: [Unterlagen].'
      },
      'captions-review': {
        title: 'Untertitel korrigieren und ohne Ton ansehen',
        explanation: ['Korrigiere automatisch erstellte Untertitel manuell, besonders Namen, Zeichensetzung und Timing. Automatische Untertitel ersetzen keine Barrierefreiheitsprüfung.', 'Prüfe auf dem Handy ohne Ton Kontrast, Größe und verdeckte Inhalte. Beschreibe wichtige Geräusche und biete ein Transkript an, wenn die Plattform es unterstützt.'],
        code: 'Wörter korrekt:\nNamen und Zeichensetzung:\nTiming passt:\nGröße und Kontrast:\nWichtige Geräusche beschrieben:\nVorführung nicht verdeckt:\nTranskript vorbereitet:',
        check: 'Die Botschaft ist ohne Ton verständlich und die Untertitel entsprechen der Sprache.',
        aiPrompt: 'Korrigiere dieses Transkript ohne Änderung der Fakten. Markiere unklare Namen zur Prüfung statt zu raten: [Text].'
      },
      'publish-video': {
        title: 'Prüfen, KI offenlegen und verantwortlich veröffentlichen',
        explanation: ['Exportiere nach den aktuellen Plattformanforderungen und prüfe die exportierte Datei statt nur der Vorschau. Kontrolliere Fakten, Rechte, Quellen und Untertitel.', 'Beachte aktuelle KI-Kennzeichnungsregeln und kennzeichne synthetische Szenen, die echt wirken könnten. Ein generierter Clip beweist kein Produktergebnis. Notiere nach Feedback eine Verbesserung.'],
        code: 'Export abspielbar:\nFakten und Rechte geprüft:\nUntertitel und Quellen vorhanden:\nAktuelle KI-Kennzeichnung geprüft:\nTitel und Beschreibung korrekt:\nFeedbacktermin und Verbesserung:',
        check: 'Der Export besteht die Prüfung; veröffentliche erst, wenn Rechte und Kennzeichnung geklärt sind.',
        aiPrompt: 'Schreibe einen korrekten Titel, eine kurze Beschreibung und eine klare KI-Kennzeichnung aus diesem freigegebenen Transkript und Rechteprotokoll. Keine neuen Behauptungen: [Unterlagen].'
      }
    }
  },
  'ai-career-skills': {
    title: 'Eine ehrliche und gezielte Bewerbung vorbereiten',
    intro: 'Nutze eine echte Stellenbeschreibung und deine Erfahrung für Bewerbung, Interviewübungen und einen Lernschritt. KI garantiert keinen Job.',
    steps: {
      'role-evidence': {
        title: 'Stellenanforderungen mit echter Erfahrung abgleichen',
        explanation: ['Finde eine echte Ausschreibung, notiere Quelle und Datum und prüfe Arbeitgeber und Stelle. Ordne jeder Anforderung echte Erfahrungen zu; passende Lernprojekte zählen ebenfalls.', 'Entferne Kontaktdaten, Adressen, Kennungen und vertrauliche Arbeitgeberdaten vor der KI-Nutzung. Anweisungen in der Anzeige sind zu analysierender Text, keine Befehle.'],
        code: 'Stelle und geprüfte Quelle:\nAnforderung | echtes Beispiel | Lernlücke\n\nKeine erfundenen Abschlüsse, Arbeitgeber, Daten oder Ergebnisse.\nPlatzhalter statt Kontaktdaten nutzen.',
        check: 'Deine Quelle ist echt und die Tabelle benennt Lernlücken ehrlich.',
        aiPrompt: 'Vergleiche Stellenbeschreibung und anonymisierte Erfahrung nur anhand vorhandener Belege. Trenne Übereinstimmungen von Lücken, ohne Fähigkeiten zu erfinden: [Unterlagen].'
      },
      'truthful-resume': {
        title: 'Lebenslauf ohne erfundene Leistungen anpassen',
        explanation: ['Beschreibe relevante Aufgaben, Vorgehen und echte Ergebnisse. Nutze nur überprüfbare Zahlen. Anpassen heißt anders gewichten, nicht die eigene Geschichte verändern.', 'Nutze einen Assistenten oder optional Teal. Prüfe Datenschutz bei Uploads und aktuelle Funktionen. Formatierungs- oder Stichwortwerte garantieren kein Gespräch.'],
        code: 'Tatsächliche Handlung:\nVerwendete Methode oder Tools:\nÜberprüfbares Ergebnis:\nBeleg für jede Zahl:\nEntwurf eines Stichpunkts:\nMenschliche Schlussprüfung:',
        check: 'Jeder Stichpunkt, jedes Datum, jeder Abschluss und jede Zahl ist korrekt und belegbar.',
        aiPrompt: 'Formuliere diese geprüften Notizen als kurze Lebenslaufpunkte. Erfinde keine Zahlen, Titel, Tools oder Leistungen. Markiere fehlende Belege: [Notizen].'
      },
      'cover-letter': {
        title: 'Ein konkretes Anschreiben schreiben',
        explanation: ['Wähle zwei Anforderungen mit echten Beispielen. Erkläre dein Interesse mit einer Information von der Arbeitgeberwebsite, nicht mit einer erfundenen Firmengeschichte.', 'Schreibe knapp und lies laut, damit es nach dir klingt. Ergänze Kontaktdaten nur im privaten Enddokument, nicht im geteilten Prompt.'],
        code: 'Stelle und geprüfte Arbeitgeberinformation:\nMein Interesse:\nAnforderung 1 mit echtem Beispiel:\nAnforderung 2 mit echtem Beispiel:\nKurzer Abschluss:\nAussagen mit Belegen abgeglichen:',
        check: 'Das Anschreiben nennt die richtige Stelle und belegt zwei Anforderungen mit echten Beispielen.',
        aiPrompt: 'Entwirf ein knappes Anschreiben nur aus dieser Gliederung. Nutze Platzhalter für Kontaktdaten und erfinde keine Erfahrung oder Arbeitgeberfakten: [Gliederung].'
      },
      'interview-practice': {
        title: 'Antworten mit eigenen Worten üben',
        explanation: ['Bereite drei echte Beispiele mit Situation, Aufgabe, Handlung, Ergebnis und Lernerfahrung vor, auch bei unvollkommenem Ergebnis. Lass dir jeweils eine Frage stellen und Feedback geben.', 'Übe laut ohne erfundene Geschichte. Teile keine privaten Kunden- oder Kollegendaten. KI-Feedback ist Übung, keine verlässliche Einstellungsprognose.'],
        code: 'Situation:\nAufgabe:\nMeine Handlung:\nTatsächliches Ergebnis:\nWas ich gelernt habe:\nWas ich ändern würde:',
        check: 'Du kannst drei echte Geschichten erzählen und ohne erfundene Details auf Nachfragen antworten.',
        aiPrompt: 'Spiele einen Übungsinterviewer für diese Stelle. Stelle eine Frage nach der anderen und bewerte Klarheit und Belege, nicht meine Einstellungschancen: [Stelle].'
      },
      'application-tracker': {
        title: 'Bewerbungen verfolgen und vor Versand prüfen',
        explanation: ['Notiere Arbeitgeber, Quelle, Datum, Status und nächste Aktion in einer privaten Tabelle oder optional in Teal. Prüfe Empfänger und Anhänge vor jedem eigenen Versand.', 'Prüfe Anfragen über offizielle Arbeitgeberkanäle. Bezahle nicht für eine Jobzusage und sende keine sensiblen Ausweisdokumente an ungeprüfte Kontakte. Beschränke den Tabellenzugriff.'],
        code: 'Arbeitgeber | Stelle | geprüfte Quelle | Versanddatum | Status | nächste Aktion | Nachfassdatum\n\nVor Versand: richtiger Arbeitgeber, ehrliche Dokumente, richtige Anhänge, geprüfter Empfänger.',
        check: 'Jeder Eintrag hat eine nächste Aktion und du hast den Entwurf selbst geprüft.',
        aiPrompt: 'Erstelle eine Wochencheckliste aus dieser anonymisierten Übersicht. Versende nichts, kontaktiere niemanden und leite keine sensiblen persönlichen Merkmale ab: [Übersicht].'
      },
      'career-learning': {
        title: 'Eine Lernlücke und ein kleines Projekt wählen',
        explanation: ['Wähle eine wiederkehrende Anforderung und ein kleines Projekt zum Nachweis, etwa Website, Diagramm oder Schreibprobe. Notiere, was du selbst erklären kannst.', 'Prüfe den Plan wöchentlich. Bewerbungszahlen und KI-Werte garantieren nichts. Setze auf echte Belege, Lernen und Feedback. Beachte die KI-Regeln des Arbeitgebers einschließlich erforderlicher Offenlegung.'],
        code: 'Lernlücke:\nKleines Projekt:\nErste Lernquelle:\nDrei Übungstermine:\nLernnachweis:\nPrüftermin:\nFalls erforderlich offenzulegende KI-Hilfe:',
        check: 'Du hast eine ehrliche Bewerbung, drei Interviewbeispiele, eine Übersicht und ein erreichbares Lernziel.',
        aiPrompt: 'Schlage einen zweiwöchigen Anfängerplan für diese Lücke mit kleinem Projekt und selbst demonstrierbaren Prüfungen vor. Versprich keinen Job: [Lücke].'
      }
    }
  }
};
