import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const cadServicesTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-cad-services': {
    fr: {
      title: 'Préparer un service de concepts CAO assisté par IA',
      intro: 'Créez et révisez un concept non fonctionnel de carte-présentoir avec dimensions cohérentes et vues versionnées. Suivez d’abord les bases du design et de la CAO si nécessaire. Environ 90 minutes ; configuration des outils parfois plus longue. Aucune fabrication ni approbation d’ingénierie.',
      steps: {
        'cad-service-boundaries': {
          title: 'Choisir un service de concept non fonctionnel',
          explanation: [
            'Ce parcours porte sur un concept de carte-présentoir : rectangle de 80 mm de large, 40 mm de haut et 3 mm d’épaisseur. Ce n’est ni une pièce porteuse, ni un composant de machine, ni une conception de fabrication validée. Si vous n’avez jamais dessiné ou modélisé, terminez d’abord Design & CAD Basics.',
            'Le livrable client est un croquis de concept clairement étiqueté, des vues cotées et une image de présentation. L’IA peut expliquer des commandes ou préparer la documentation ; elle ne certifie ni dimensions, résistance, ajustement ou sécurité. N’utilisez pas de dessins propriétaires ni de fichiers clients sans autorisation.'
          ],
          file: 'Brief réservé au concept',
          code: 'Projet fictif : concept simple de carte-présentoir\nUnités : mm\nLargeur 80 ; hauteur 40 ; épaisseur 3\nAucun trou, texte, exigence d’ajustement ou assemblage\nLivrables : croquis de concept + vues cotées + image de présentation\nExclus : fabrication, analyse structurelle, approbation de sécurité\nÉtiquetez chaque page : CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'Votre brief indique les unités et les trois dimensions, et exclut fabrication et approbation d’ingénierie.',
          aiPrompt: 'Transforme ce brief fictif de concept non fonctionnel en liste d’exigences. N’ajoute ni tolérances, affirmations sur les matériaux, charges admissibles ou approbation de fabrication : [brief].'
        },
        'cad-service-sketch': {
          title: 'Dessiner et rapprocher les dimensions',
          explanation: [
            'Dessinez un rectangle de face de 80 x 40 mm et une vue de côté de 3 x 40 mm sur papier ou dans un outil de croquis. Indiquez unités et dimensions. À l’échelle papier 1:2, la face mesure 40 x 20 mm sur la page, mais ses cotes décrivent toujours le concept réel de 80 x 40 mm.',
            'Vérifiez le rapport largeur/hauteur : 80/40 = 2. Un solide rectangulaire simple a un volume de 80 x 40 x 3 = 9600 millimètres cubes. C’est un contrôle géométrique, pas un calcul de matériau, résistance ou fabrication.'
          ],
          file: 'Feuille de dimensions',
          code: 'Face : 80 x 40 mm\nCôté : 3 x 40 mm\nDessus : 80 x 3 mm\nRapport face : 2:1\nVolume du solide simple : 9600 mm^3\nÀ l’échelle papier 1:2 : face dessinée 40 x 20 mm\nToutes les cotes indiquent les dimensions réelles.',
          check: 'Les trois vues concordent sur largeur, hauteur et épaisseur ; le calcul donne 9600 millimètres cubes.',
          aiPrompt: 'Vérifie par calcul ces dimensions en trois vues et le volume du rectangle. Signale les conflits sans inventer de tolérances ni certifier le concept : [feuille].'
        },
        'cad-service-model': {
          title: 'Créer le concept simple ou une maquette papier',
          explanation: [
            'Avec un outil de CAO, créez un nouveau dessin en millimètres, tracez un rectangle de 80 x 40 mm et extrudez-le de 3 mm. Vérifiez les dimensions avec les outils de mesure. Une image générée ne prouve pas l’exactitude géométrique.',
            'Aucun outil payant n’est nécessaire pour la feuille d’exercice : une maquette papier étiquetée peut documenter le concept, mais ce n’est pas un livrable CAO. Vérifiez les licences actuelles avant tout travail commercial. Une licence CAO personnelle peut exclure les projets clients payants ; ne présumez ni votre admissibilité ni que le dépôt public protège les dessins privés.'
          ],
          file: 'Registre de réalisation',
          code: 'Méthode : modèle CAO / maquette papier (à indiquer honnêtement)\nCAO : unités mm -> esquisse 80 x 40 -> extrusion 3\nLargeur / hauteur / épaisseur mesurées :\nSi solide simple : comparer au volume 9600 mm^3\nFichier natif ou emplacement du croquis :\nLicence et partage vérifiés avant usage commercial :\nStatut : CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'Vous avez mesuré le concept ou clairement signalé l’alternative papier ; vous ne prétendez pas qu’une maquette est un fichier CAO terminé.',
          aiPrompt: 'Explique comment tracer et extruder ce rectangle simple dans [mon outil CAO]. Demande ma version, évite les noms de menus supposés et garde le concept non fonctionnel : [brief].'
        },
        'cad-service-review': {
          title: 'Vérifier les vues, exports et une révision',
          explanation: [
            'Créez les vues de face, dessus et côté avec unités/cotes lisibles. Exportez un PDF ou une image pour revue ; si vous avez modélisé en CAO, gardez le fichier natif et exportez un format neutre uniquement si l’outil convenu le permet. Rouvrez les exports pour vérifier les cotes manquantes ou l’échelle modifiée.',
            'Pour une révision contrôlée, passez la largeur de 80 à 90 mm en gardant hauteur 40 et épaisseur 3. Le nouveau rapport est 2,25 et le volume du solide simple 10800 millimètres cubes. Enregistrez v2, conservez v1 et mettez à jour chaque vue. N’inventez pas de tolérances et ne qualifiez pas le document de prêt à produire.'
          ],
          file: 'Preuve de révision',
          code: 'v1 : 80 x 40 x 3 mm ; volume 9600 mm^3\nv2 : 90 x 40 x 3 mm ; volume 10800 mm^3\nRapport face v2 : 2.25:1\nContrôles : vues mises à jour ; unités conservées ; export rouvert\nPreuve : dimensions/mesures, pas seulement un rendu\nLes deux versions : CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'La v2 indique une largeur de 90 dans chaque vue, conserve les autres dimensions et le contrôle géométrique donne 10800 millimètres cubes.',
          aiPrompt: 'Compare ce registre de révision au concept requis. Repère les vues incohérentes et légendes manquantes. N’ajoute aucune déclaration de conformité ou fabrication : [registre].'
        },
        'cad-service-offer': {
          title: 'Définir le service concept et les besoins de revue',
          explanation: [
            'Utilisez le générateur de propositions pour définir un ensemble limité au concept, avec une révision, formats de fichiers, compatibilité logicielle et responsable de revue. Excluez fabrication, calcul structurel, conception réglementée et validation d’ingénieur.',
            'Consignez séparément temps et licences par rapport aux honoraires proposés. Pour tout vrai travail d’ingénierie fonctionnelle, les exigences et leur vérification doivent être définies et approuvées par un professionnel qualifié. Refusez un travail dépassant votre compétence et ne traitez pas la sortie IA comme cette approbation.'
          ],
          file: 'Offre de service conceptuel',
          code: 'Inclus : croquis conceptuel, vues cotées, une image de présentation, une révision\nMéthode/formats de livraison :\nExclus : conception fonctionnelle, fabrication, charges, validation sécurité/conformité\nTemps interne, licence et frais généraux :\nHonoraires proposés : choisis séparément\nRéviseur autorisé et voie d’approbation :\nExigences non résolues : TO CONFIRM',
          check: 'Votre offre promet uniquement des livrables conceptuels démontrables et précise quand une revue professionnelle est nécessaire.',
          aiPrompt: 'Examine cette proposition de service conceptuel pour repérer périmètre ambigu, suppositions de licence et affirmations d’ingénierie non étayées. Ne certifie pas la conception : [offre].'
        },
        'cad-service-handoff': {
          title: 'Livrer un ensemble conceptuel étiqueté et traçable',
          explanation: [
            'Rassemblez brief, croquis/modèle versionné, vues exportées, preuves de mesure et journal des modifications. Étiquetez chaque page exportée CONCEPT ONLY - NOT FOR MANUFACTURE. Indiquez s’il s’agit de CAO ou papier uniquement, ainsi que logiciel/version et unités.',
            'Dans le suivi des résultats, vérifiez cohérence des dimensions, réouverture des exports, complétude de révision et revue requise. Toute approbation qualifiée ou client manquante reste bloquée, jamais présumée réussie. Ne fabriquez, n’installez et n’utilisez aucune pièce issue de cet exercice.'
          ],
          file: 'Transmission conceptuelle',
          code: 'Brief | fichier natif ou croquis papier | vues | mesures | journal des modifications\nMéthode et logiciel/version :\nUnités : mm\nVersion livrée :\nÉtiquette sur chaque page : CONCEPT ONLY - NOT FOR MANUFACTURE\nContrôles et revue non résolue :\nDécision : réviser / arrêter / continuer la discussion conceptuelle seulement',
          check: 'Votre transmission est traçable, honnête sur le format et visiblement sans autorisation de fabrication.',
          aiPrompt: 'Vérifie cette liste de transmission : unités, versions, preuves et exclusions manquantes. Toute décision doit rester limitée à une discussion conceptuelle : [liste].'
        }
      }
    },
    de: {
      title: 'KI-gestützten CAD-Konzeptservice vorbereiten',
      intro: 'Erstelle und prüfe ein nicht funktionsfähiges Displaykartenkonzept mit konsistenten Maßen und versionierten Ansichten. Bei Bedarf zuerst Design- und CAD-Grundlagen bearbeiten. Etwa 90 Minuten; Werkzeugeinrichtung kann länger dauern. Keine Fertigung oder technische Freigabe.',
      steps: {
        'cad-service-boundaries': {
          title: 'Einen nicht funktionsfähigen Konzeptservice wählen',
          explanation: [
            'Dieser Pfad übt ein Displaykartenkonzept: Rechteck 80 mm breit, 40 mm hoch und 3 mm dick. Es ist weder tragendes Teil noch Maschinenkomponente oder validierte Fertigungskonstruktion. Wenn du noch nie skizziert oder modelliert hast, zuerst Design & CAD Basics abschließen.',
            'Das Kundenergebnis ist eine klar gekennzeichnete Konzeptskizze, bemaßte Ansichten und ein Präsentationsbild. KI kann Befehle erklären oder Dokumentation entwerfen; sie zertifiziert weder Maße, Festigkeit, Passung noch Sicherheit. Keine geschützten Zeichnungen oder Kundendateien ohne Genehmigung verwenden.'
          ],
          file: 'Briefing nur für Konzept',
          code: 'Fiktives Projekt: einfaches Displaykartenkonzept\nEinheiten: mm\nBreite 80; Höhe 40; Dicke 3\nKeine Löcher, Texte, Passungsanforderungen oder Baugruppe\nErgebnisse: Konzeptskizze + bemaßte Ansichten + Präsentationsbild\nAusgeschlossen: Fertigung, Strukturanalyse, Sicherheitsfreigabe\nJede Seite kennzeichnen: CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'Das Briefing nennt Einheiten und alle drei Maße und schließt Fertigung sowie technische Freigabe aus.',
          aiPrompt: 'Erstelle aus diesem fiktiven, nicht funktionsfähigen Konzeptbriefing eine Anforderungsliste. Keine Toleranzen, Materialbehauptungen, Belastungswerte oder Fertigungsfreigaben ergänzen: [Briefing].'
        },
        'cad-service-sketch': {
          title: 'Maße skizzieren und abgleichen',
          explanation: [
            'Zeichne Vorderseite 80 x 40 mm und Seitenansicht 3 x 40 mm auf Papier oder in einem Skizzierwerkzeug. Einheiten/Maße beschriften. Im Papiermaßstab 1:2 ist die Vorderseite 40 x 20 mm groß, die Maßangaben beschreiben aber weiterhin das tatsächliche Konzept 80 x 40 mm.',
            'Seitenverhältnis prüfen: 80/40 = 2. Ein einfacher Quader hat Volumen 80 x 40 x 3 = 9600 Kubikmillimeter. Das ist eine Geometrieprüfung, keine Material-, Festigkeits- oder Fertigungsberechnung.'
          ],
          file: 'Maßblatt',
          code: 'Vorne: 80 x 40 mm\nSeite: 3 x 40 mm\nOben: 80 x 3 mm\nSeitenverhältnis vorne: 2:1\nVolumen einfacher Quader: 9600 mm^3\nBei Papiermaßstab 1:2: vorne gezeichnet 40 x 20 mm\nAlle Maßangaben behalten die tatsächlichen Maße.',
          check: 'Alle drei Ansichten stimmen bei Breite, Höhe und Dicke überein; das Ergebnis ist 9600 Kubikmillimeter.',
          aiPrompt: 'Prüfe diese Drei-Ansichten-Maße und das einfache Quader-Volumen rechnerisch. Konflikte markieren, keine Toleranzen erfinden oder Konzeptzertifizierung behaupten: [Blatt].'
        },
        'cad-service-model': {
          title: 'Einfaches Konzept oder Papiermodell erstellen',
          explanation: [
            'In CAD eine neue Konstruktion in Millimetern anlegen, Rechteck 80 x 40 mm skizzieren und 3 mm extrudieren. Maße mit Messfunktionen des Werkzeugs prüfen. Ein generiertes Bild ist kein Nachweis geometrischer Genauigkeit.',
            'Für das Arbeitsblatt ist kein kostenpflichtiges Tool nötig: Ein beschriftetes Papiermodell kann das Konzept dokumentieren, ist aber kein CAD-Liefergegenstand. Vor kommerzieller Arbeit aktuelle Lizenz prüfen. Eine private CAD-Lizenz kann bezahlte Kundenprojekte ausschließen; weder Zulässigkeit noch Schutz privater Entwürfe in einem öffentlichen Arbeitsbereich unterstellen.'
          ],
          file: 'Erstellungsprotokoll',
          code: 'Methode: CAD-Modell / Papiermodell (ehrlich angeben)\nCAD: Einheiten mm -> Skizze 80 x 40 -> Extrusion 3\nGemessene Breite / Höhe / Dicke:\nBei einfachem Quader: Volumen mit 9600 mm^3 vergleichen\nSpeicherort der nativen Datei oder Skizze:\nLizenz und Freigabe vor kommerzieller Nutzung geprüft:\nStatus: CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'Du hast das Konzept vermessen oder die Papieralternative klar gekennzeichnet; du gibst ein Modell nicht als fertige CAD-Datei aus.',
          aiPrompt: 'Erkläre Skizze und Extrusion dieses einfachen Rechtecks in [meinem CAD-Werkzeug]. Frage nach meiner Version, rate keine Menünamen und halte es beim Konzept: [Briefing].'
        },
        'cad-service-review': {
          title: 'Ansichten, Exporte und Überarbeitung prüfen',
          explanation: [
            'Vorder-, Ober- und Seitenansicht mit lesbaren Einheiten/Maßen erstellen. PDF/Bild zur Prüfung exportieren; bei CAD-Modell die native Datei behalten und neutrales Format nur exportieren, wenn das vereinbarte Werkzeug dies unterstützt. Exporte erneut öffnen und auf fehlende Maße/geänderten Maßstab prüfen.',
            'Für eine kontrollierte Revision Breite von 80 auf 90 mm ändern, Höhe 40 und Dicke 3 beibehalten. Neues Seitenverhältnis 2.25 und Quader-Volumen 10800 Kubikmillimeter. v2 speichern, v1 bewahren und jede Ansicht aktualisieren. Keine Toleranzen erfinden und das Dokument nicht produktionsbereit nennen.'
          ],
          file: 'Revisionsnachweis',
          code: 'v1: 80 x 40 x 3 mm; Volumen 9600 mm^3\nv2: 90 x 40 x 3 mm; Volumen 10800 mm^3\nSeitenverhältnis vorne v2: 2.25:1\nPrüfungen: Ansichten aktualisiert; Einheiten beibehalten; Export erneut geöffnet\nNachweis: Maße/Messungen, nicht nur Rendering\nBeide Versionen: CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'v2 zeigt in jeder Ansicht Breite 90, behält die anderen Maße bei und ergibt im Geometriecheck 10800 Kubikmillimeter.',
          aiPrompt: 'Vergleiche dieses Revisionsprotokoll mit den Konzeptanforderungen. Finde widersprüchliche Ansichten und fehlende Beschriftungen. Keine Konformitäts- oder Fertigungsbehauptung ergänzen: [Protokoll].'
        },
        'cad-service-offer': {
          title: 'Konzeptservice und Prüfbedarf abgrenzen',
          explanation: [
            'Mit dem Angebotsgenerator ein reines Konzeptpaket mit einer Revision, Dateiformaten, Softwarekompatibilität und zuständiger Prüfung definieren. Fertigung, Strukturberechnungen, regulierte Konstruktion und technische Freigabe ausschließen.',
            'Zeit- und Lizenzkosten getrennt vom Angebotspreis erfassen. Bei echter funktionaler Ingenieursarbeit müssen Anforderungen und Verifizierung von einer qualifizierten Fachperson festgelegt und genehmigt werden. Keine Arbeit außerhalb eigener Kompetenz annehmen und KI-Ausgabe nicht als Freigabe behandeln.'
          ],
          file: 'Konzeptservice-Angebot',
          code: 'Enthalten: Konzeptskizze, bemaßte Konzeptansichten, ein Präsentationsbild, eine Revision\nLiefermethode/Dateiformate:\nAusgeschlossen: Funktionskonstruktion, Fertigung, Lastwerte, Sicherheits-/Konformitätsfreigabe\nInterne Zeit, Lizenz und Gemeinkosten:\nAngebotspreis: separat gewählt\nAutorisierter Prüfer und Freigabeweg:\nOffene Anforderungen: TO CONFIRM',
          check: 'Das Angebot verspricht nur nachweisbare Konzeptleistungen und benennt nötige Fachprüfung.',
          aiPrompt: 'Prüfe dieses Konzeptangebot auf unklaren Umfang, Lizenzannahmen und unbelegte technische Behauptungen. Design nicht zertifizieren: [Angebot].'
        },
        'cad-service-handoff': {
          title: 'Beschriftetes und nachvollziehbares Konzeptpaket übergeben',
          explanation: [
            'Briefing, versionierte Skizze/Modell, exportierte Ansichten, Messnachweis und Änderungsprotokoll bündeln. Jede exportierte Seite mit CONCEPT ONLY - NOT FOR MANUFACTURE kennzeichnen. CAD oder nur Papier, Software/Version und Einheiten angeben.',
            'Im Ergebnistracker Maßkonsistenz, erneut geöffnete Exporte, vollständige Revision und erforderliche Prüfung kontrollieren. Fehlende Fach- oder Kundenfreigabe bleibt blockiert, wird nie als bestanden angenommen. Aus dieser Übung kein Teil fertigen, installieren oder betreiben.'
          ],
          file: 'Konzeptübergabe',
          code: 'Briefing | native Datei oder Papierskizze | Ansichten | Messungen | Änderungsprotokoll\nMethode und Software/Version:\nEinheiten: mm\nGelieferte Version:\nKennzeichnung auf jeder Seite: CONCEPT ONLY - NOT FOR MANUFACTURE\nPrüfungen und offene Freigabe:\nEntscheidung: überarbeiten / stoppen / nur Konzeptgespräch fortsetzen',
          check: 'Die Übergabe ist nachvollziehbar, nennt das Format ehrlich und ist sichtbar keine Fertigungsfreigabe.',
          aiPrompt: 'Prüfe diese Übergabeliste auf fehlende Einheiten, Versionen, Belege und Ausschlüsse. Entscheidung auf Konzeptgespräch beschränken: [Liste].'
        }
      }
    },
    es: {
      title: 'Preparar un servicio de conceptos CAD con apoyo de IA',
      intro: 'Crea y revisa un concepto no funcional de tarjeta expositora con dimensiones coherentes y vistas versionadas. Si hace falta, completa primero los fundamentos de diseño y CAD. Unos 90 minutos; configurar herramientas puede llevar más. Sin fabricación ni aprobación de ingeniería.',
      steps: {
        'cad-service-boundaries': {
          title: 'Elegir un servicio de conceptos no funcional',
          explanation: [
            'Esta ruta practica un concepto de tarjeta expositora: rectángulo de 80 mm de ancho, 40 mm de alto y 3 mm de grosor. No es una pieza estructural, componente de máquina ni diseño de fabricación validado. Si nunca has dibujado o modelado, completa primero Design & CAD Basics.',
            'El entregable es un boceto conceptual claramente etiquetado, vistas acotadas e imagen de presentación. La IA puede explicar comandos o redactar documentación; no certifica dimensiones, resistencia, ajuste ni seguridad. No uses dibujos propietarios ni archivos de clientes sin autorización.'
          ],
          file: 'Brief solo conceptual',
          code: 'Proyecto ficticio: concepto sencillo de tarjeta expositora\nUnidades: mm\nAncho 80; alto 40; grosor 3\nSin agujeros, texto, requisitos de ajuste ni ensamblaje\nEntregables: boceto conceptual + vistas acotadas + imagen de presentación\nExcluye: fabricación, análisis estructural, aprobación de seguridad\nEtiqueta cada página: CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'El brief indica unidades y las tres dimensiones y excluye fabricación y aprobación de ingeniería.',
          aiPrompt: 'Convierte este brief ficticio de concepto no funcional en una lista de requisitos. No añadas tolerancias, afirmaciones de materiales, capacidades de carga ni aprobación de fabricación: [brief].'
        },
        'cad-service-sketch': {
          title: 'Dibujar y conciliar las dimensiones',
          explanation: [
            'Dibuja un rectángulo frontal de 80 x 40 mm y uno lateral de 3 x 40 mm en papel o en una herramienta de boceto. Etiqueta unidades y dimensiones. A escala de papel 1:2, el frontal mide 40 x 20 mm en la página, pero sus cotas describen el concepto real de 80 x 40 mm.',
            'Comprueba la proporción: 80/40 = 2. Un sólido rectangular simple tiene volumen 80 x 40 x 3 = 9600 milímetros cúbicos. Es una comprobación geométrica, no un cálculo de materiales, resistencia o fabricación.'
          ],
          file: 'Hoja de dimensiones',
          code: 'Frontal: 80 x 40 mm\nLateral: 3 x 40 mm\nSuperior: 80 x 3 mm\nProporción frontal: 2:1\nVolumen del sólido simple: 9600 mm^3\nA escala de papel 1:2: frontal dibujado 40 x 20 mm\nTodas las cotas mantienen las dimensiones reales.',
          check: 'Las tres vistas coinciden en ancho, alto y grosor; el cálculo da 9600 milímetros cúbicos.',
          aiPrompt: 'Comprueba aritméticamente estas dimensiones de tres vistas y el volumen rectangular. Señala conflictos sin inventar tolerancias ni certificar el concepto: [hoja].'
        },
        'cad-service-model': {
          title: 'Crear el concepto sencillo o una maqueta de papel',
          explanation: [
            'Si usas CAD, crea un diseño nuevo en milímetros, dibuja un rectángulo de 80 x 40 mm y extrúyelo 3 mm. Inspecciona las dimensiones con las herramientas de medición. Una imagen generada no prueba geometría precisa.',
            'La hoja no requiere herramienta de pago: una maqueta de papel etiquetada puede documentar el concepto, pero no es un entregable CAD. Comprueba la licencia vigente antes de trabajar comercialmente. Una licencia CAD personal puede excluir trabajos pagados para clientes; no supongas que eres elegible ni que un espacio público protege diseños privados.'
          ],
          file: 'Registro de creación',
          code: 'Método: modelo CAD / maqueta de papel (indicarlo honestamente)\nCAD: unidades mm -> boceto 80 x 40 -> extrusión 3\nAncho / alto / grosor medidos:\nSi es sólido simple: comparar volumen con 9600 mm^3\nArchivo nativo o ubicación del boceto:\nLicencia y permisos de uso compartido comprobados antes del uso comercial:\nEstado: CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'Mediste el concepto o etiquetaste claramente la alternativa de papel; no presentas una maqueta como archivo CAD terminado.',
          aiPrompt: 'Explica cómo dibujar y extruir este rectángulo sencillo en [mi herramienta CAD]. Pregunta qué versión uso, no adivines menús y mantén el concepto no funcional: [brief].'
        },
        'cad-service-review': {
          title: 'Revisar vistas, exportaciones y una modificación',
          explanation: [
            'Crea vistas frontal, superior y lateral con unidades y cotas legibles. Exporta PDF/imagen para revisión; si hiciste un modelo CAD, conserva el archivo nativo y exporta un formato neutro solo si la herramienta acordada lo permite. Reabre las exportaciones y comprueba cotas ausentes o cambios de escala.',
            'Para una revisión controlada, cambia el ancho de 80 a 90 mm y conserva alto 40 y grosor 3. La nueva proporción es 2.25 y el volumen del sólido simple 10800 milímetros cúbicos. Guarda v2, conserva v1 y actualiza cada vista. No inventes tolerancias ni llames al documento listo para producción.'
          ],
          file: 'Evidencia de revisión',
          code: 'v1: 80 x 40 x 3 mm; volumen 9600 mm^3\nv2: 90 x 40 x 3 mm; volumen 10800 mm^3\nProporción frontal v2: 2.25:1\nComprobaciones: vistas actualizadas; unidades conservadas; exportación reabierta\nEvidencia: dimensiones/mediciones, no solo un render\nAmbas versiones: CONCEPT ONLY - NOT FOR MANUFACTURE',
          check: 'La v2 muestra ancho 90 en cada vista, conserva las demás dimensiones y la comprobación geométrica da 10800 milímetros cúbicos.',
          aiPrompt: 'Compara este registro de revisión con los requisitos conceptuales. Identifica vistas incoherentes y etiquetas ausentes. No añadas afirmaciones de conformidad ni fabricación: [registro].'
        },
        'cad-service-offer': {
          title: 'Definir alcance del concepto y necesidades de revisión',
          explanation: [
            'Usa el generador de propuestas para definir un paquete solo conceptual, con una revisión, formatos de archivo, compatibilidad de software y quién lo revisa. Excluye fabricación, cálculos estructurales, diseño regulado y aprobación de ingeniería.',
            'Registra tiempo y licencias aparte de la tarifa propuesta. Para trabajos reales de ingeniería funcional, una persona profesional cualificada debe definir y aprobar requisitos y verificación. No aceptes trabajo fuera de tu competencia ni trates una salida de IA como aprobación.'
          ],
          file: 'Oferta de servicio conceptual',
          code: 'Incluye: boceto conceptual, vistas acotadas, una imagen de presentación, una revisión\nMétodo/formatos de entrega:\nExcluye: diseño funcional, fabricación, cargas, aprobación de seguridad/conformidad\nTiempo interno, licencias y gastos generales:\nTarifa propuesta: elegida por separado\nRevisor autorizado y proceso de aprobación:\nRequisitos sin resolver: TO CONFIRM',
          check: 'La oferta promete solo entregables conceptuales demostrables e identifica cuándo hace falta revisión profesional.',
          aiPrompt: 'Revisa esta propuesta conceptual para detectar alcance ambiguo, supuestos de licencia y afirmaciones de ingeniería sin respaldo. No certifiques el diseño: [oferta].'
        },
        'cad-service-handoff': {
          title: 'Entregar un paquete conceptual etiquetado y trazable',
          explanation: [
            'Reúne brief, boceto/modelo versionado, vistas exportadas, evidencia de medición y registro de cambios. Etiqueta cada página exportada CONCEPT ONLY - NOT FOR MANUFACTURE. Indica si es CAD o solo papel, y especifica software/versión y unidades.',
            'Usa el seguimiento de resultados para revisar coherencia dimensional, reapertura de exportaciones, revisión completa y revisión requerida. La falta de aprobación profesional o del cliente queda bloqueada, nunca se supone aprobada. No fabriques, instales ni operes una pieza a partir de este ejercicio.'
          ],
          file: 'Entrega conceptual',
          code: 'Brief | archivo nativo o boceto en papel | vistas | mediciones | registro de cambios\nMétodo y software/versión:\nUnidades: mm\nVersión entregada:\nEtiqueta en cada página: CONCEPT ONLY - NOT FOR MANUFACTURE\nComprobaciones y revisión pendiente:\nDecisión: revisar / parar / continuar solo conversación conceptual',
          check: 'La entrega es trazable, honesta sobre su formato y claramente no es una autorización de fabricación.',
          aiPrompt: 'Comprueba esta lista de entrega por unidades, versiones, evidencia y exclusiones ausentes. Limita cualquier decisión a conversar sobre el concepto: [lista].'
        }
      }
    }
  }
};
