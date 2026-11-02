import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const mlDesignTranslations: Record<string, Partial<Record<'fr' | 'de' | 'es', TutorialTranslation>>> = {
  'ml-foundations': {
    fr: {
      title: 'Entraînez votre premier modèle de machine learning',
      intro: 'Découvrez les idées essentielles du machine learning et entraînez un petit modèle dans un notebook Google Colab gratuit.',
      steps: {
        'ml-basics': {
          title: 'Découvrir les bases du machine learning',
          explanation: [
            'Le machine learning (ML) permet d’apprendre à un ordinateur à repérer des motifs dans des exemples, au lieu de programmer chaque règle à la main. Montrez-lui beaucoup de photos étiquetées « chat » ou « chien » et il apprendra à les distinguer.',
            'Trois mots à connaître : les données (les exemples), un modèle (ce qui apprend le motif) et une prédiction (la réponse du modèle pour un nouvel élément).'
          ],
          code: 'Explique le machine learning à une personne qui débute complètement, avec l’exemple de la détection des e-mails indésirables. Définis les données, le modèle, l’entraînement et la prédiction en une phrase chacun.',
          check: 'Vous pouvez expliquer avec vos propres mots ce que sont les données, un modèle et une prédiction.',
          aiPrompt: 'Quelle est la différence entre la programmation classique et le machine learning ? Donnez un exemple simple.'
        },
        'data-patterns': {
          title: 'Comprendre les données et les motifs',
          explanation: [
            'La qualité d’un modèle dépend de celle de ses données. Chaque ligne représente un exemple et chaque colonne une caractéristique, c’est-à-dire un fait à son sujet. L’étiquette est la réponse que vous voulez prédire.',
            'Le célèbre jeu de données iris contient des mesures de fleurs (les caractéristiques) et leur type (l’étiquette). Vous l’utiliserez à l’étape suivante.'
          ],
          check: 'Vous pouvez nommer les caractéristiques et l’étiquette dans cet exemple : prédire le prix d’une maison à partir de sa superficie et de son emplacement.',
          aiPrompt: 'Donne-moi 3 petits jeux de données que je pourrais imaginer pour le ML, et nomme les caractéristiques et l’étiquette de chacun.'
        },
        'try-notebook': {
          title: 'Essayer un notebook',
          explanation: [
            'Ouvrez colab.research.google.com et créez un notebook. Colab exécute gratuitement Python dans votre navigateur, sans rien installer. Un notebook est composé de cellules que vous exécutez une par une avec le bouton de lecture.',
            'Collez ce code dans une cellule et exécutez-la. Il entraîne un petit modèle avec les données iris, puis le teste sur des fleurs qu’il n’a encore jamais vues.'
          ],
          check: 'Le résultat affiche une précision proche de 1.0 (100 %) et les trois types de fleurs. La précision correspond à la proportion de prédictions correctes sur de nouvelles données.',
          aiPrompt: 'Explique chaque ligne de cette cellule Colab à une personne qui débute, en particulier train_test_split et la raison pour laquelle on garde les données de test à part.'
        },
        'practice': {
          title: 'S’entraîner avec des exemples',
          explanation: [
            'Changez un seul élément à la fois et observez le résultat. Essayez n_neighbors=1 puis n_neighbors=15, ou modifiez test_size. Voyez comment la précision évolue.',
            'Quand vous voudrez aller plus loin, kaggle.com propose des jeux de données gratuits et des cours pour débutants. N’oubliez pas qu’un score élevé sur un petit jeu de données ne prouve pas qu’un modèle fonctionne dans le monde réel.'
          ],
          check: 'Vous avez essayé au moins deux réglages différents et noté ce qui a changé.',
          aiPrompt: 'Proposez-moi 3 petites expériences de ML à essayer avec le jeu de données iris et indiquez ce que je pourrais apprendre de chacune.'
        }
      }
    },
    de: {
      title: 'Trainiere dein erstes Machine-Learning-Modell',
      intro: 'Lerne die wichtigsten Grundlagen des maschinellen Lernens kennen und trainiere ein kleines Modell in einem kostenlosen Google-Colab-Notebook.',
      steps: {
        'ml-basics': {
          title: 'Die Grundlagen des maschinellen Lernens kennenlernen',
          explanation: [
            'Mit maschinellem Lernen (ML) bringst du einem Computer bei, Muster in Beispielen zu erkennen, statt jede Regel von Hand zu programmieren. Zeig ihm viele Fotos mit der Beschriftung „Katze“ oder „Hund“, und er lernt, sie zu unterscheiden.',
            'Drei wichtige Begriffe: Daten (die Beispiele), ein Modell (das Musterlernende) und eine Vorhersage (die Antwort des Modells auf etwas Neues).'
          ],
          code: 'Erkläre maschinelles Lernen für absolute Anfänger anhand des Beispiels, Spam-E-Mails zu erkennen. Definiere Daten, Modell, Training und Vorhersage jeweils in einem Satz.',
          check: 'Du kannst mit eigenen Worten erklären, was Daten, ein Modell und eine Vorhersage sind.',
          aiPrompt: 'Was ist der Unterschied zwischen normaler Programmierung und maschinellem Lernen? Verwende ein einfaches Beispiel.'
        },
        'data-patterns': {
          title: 'Daten und Muster verstehen',
          explanation: [
            'Ein Modell ist nur so gut wie seine Daten. Jede Zeile ist ein Beispiel und jede Spalte ein Merkmal, also eine Information darüber. Das Label ist die Antwort, die du vorhersagen möchtest.',
            'Der bekannte Iris-Datensatz enthält Messwerte von Blumen (die Merkmale) und den jeweiligen Blumentyp (das Label). Im nächsten Schritt verwendest du ihn.'
          ],
          check: 'Du kannst für dieses Beispiel die Merkmale und das Label nennen: Hauspreise anhand von Größe und Lage vorhersagen.',
          aiPrompt: 'Nenne mir 3 kleine Datensätze, die ich mir für ML vorstellen könnte, und gib für jeden die Merkmale und das Label an.'
        },
        'try-notebook': {
          title: 'Ein Notebook ausprobieren',
          explanation: [
            'Öffne colab.research.google.com und erstelle ein neues Notebook. Colab führt Python kostenlos in deinem Browser aus, du musst also nichts installieren. Ein Notebook besteht aus Zellen, die du mit der Wiedergabe-Schaltfläche einzeln ausführst.',
            'Füge diesen Code in eine Zelle ein und führe ihn aus. Er trainiert ein kleines Modell mit den Iris-Daten und testet es anschließend mit Blumen, die es noch nie gesehen hat.'
          ],
          check: 'Es wird eine Genauigkeit nahe 1.0 (100 %) und die drei Blumentypen ausgegeben. Die Genauigkeit ist der Anteil richtiger Vorhersagen bei neuen Daten.',
          aiPrompt: 'Erkläre einem Anfänger jede Zeile dieser Colab-Zelle, besonders train_test_split und warum wir die Testdaten getrennt aufbewahren.'
        },
        'practice': {
          title: 'Mit Beispielen üben',
          explanation: [
            'Ändere immer nur eine Sache und beobachte, was passiert. Probiere n_neighbors=1 und n_neighbors=15 aus oder ändere test_size. Achte darauf, wie sich die Genauigkeit verändert.',
            'Wenn du mehr lernen möchtest, findest du auf kaggle.com kostenlose Datensätze und Anfängerkurse. Denk daran: Ein hoher Wert bei einem kleinen Datensatz beweist nicht, dass ein Modell in der echten Welt funktioniert.'
          ],
          check: 'Du hast mindestens zwei verschiedene Einstellungen ausprobiert und notiert, was sich geändert hat.',
          aiPrompt: 'Schlage mir 3 kleine ML-Experimente mit dem Iris-Datensatz vor und erkläre, was ich jeweils daraus lernen kann.'
        }
      }
    },
    es: {
      title: 'Entrena tu primer modelo de machine learning',
      intro: 'Aprende las ideas fundamentales del machine learning y entrena un modelo pequeño en un notebook gratuito de Google Colab.',
      steps: {
        'ml-basics': {
          title: 'Aprende los fundamentos del machine learning',
          explanation: [
            'El machine learning (ML) es una forma de enseñar a un ordenador a encontrar patrones en ejemplos, en vez de escribir cada regla a mano. Muéstrale muchas fotos etiquetadas como «gato» o «perro» y aprenderá a distinguirlas.',
            'Tres palabras que conviene conocer: datos (los ejemplos), un modelo (lo que aprende el patrón) y una predicción (la respuesta del modelo para algo nuevo).'
          ],
          code: 'Explícame el machine learning para alguien que empieza desde cero usando el ejemplo de detectar correos no deseados. Define datos, modelo, entrenamiento y predicción en una frase cada uno.',
          check: 'Puedes explicar con tus propias palabras qué son los datos, un modelo y una predicción.',
          aiPrompt: '¿Cuál es la diferencia entre la programación normal y el machine learning? Usa un ejemplo sencillo.'
        },
        'data-patterns': {
          title: 'Entiende los datos y los patrones',
          explanation: [
            'Un modelo solo es tan bueno como sus datos. Cada fila es un ejemplo y cada columna es una característica, es decir, un dato sobre ese ejemplo. La etiqueta es la respuesta que quieres predecir.',
            'El famoso conjunto de datos iris contiene medidas de flores (las características) y el tipo de flor (la etiqueta). Lo usarás en el siguiente paso.'
          ],
          check: 'Puedes nombrar las características y la etiqueta de este ejemplo: predecir el precio de una casa a partir de su tamaño y ubicación.',
          aiPrompt: 'Dame 3 conjuntos de datos pequeños que pueda imaginar para ML e indica las características y la etiqueta de cada uno.'
        },
        'try-notebook': {
          title: 'Prueba un notebook',
          explanation: [
            'Abre colab.research.google.com y crea un notebook nuevo. Colab ejecuta Python gratis en tu navegador, así que no tienes que instalar nada. Un notebook está formado por celdas que ejecutas de una en una con el botón de reproducción.',
            'Pega este código en una celda y ejecútalo. Entrena un modelo pequeño con los datos iris y después lo prueba con flores que nunca ha visto.'
          ],
          check: 'Muestra una precisión cercana a 1.0 (100 %) y los tres tipos de flores. La precisión es la proporción de predicciones correctas con datos nuevos.',
          aiPrompt: 'Explícame cada línea de esta celda de Colab para principiantes, especialmente train_test_split y por qué mantenemos separados los datos de prueba.'
        },
        'practice': {
          title: 'Practica con ejemplos',
          explanation: [
            'Cambia una sola cosa cada vez y observa qué ocurre. Prueba n_neighbors=1 y n_neighbors=15, o cambia test_size. Fíjate en cómo varía la precisión.',
            'Cuando quieras aprender más, kaggle.com tiene conjuntos de datos gratuitos y cursos para principiantes. Recuerda que una puntuación alta con un conjunto de datos pequeño no demuestra que un modelo funcione en el mundo real.'
          ],
          check: 'Has probado al menos dos configuraciones distintas y has anotado qué ha cambiado.',
          aiPrompt: 'Sugiere 3 experimentos pequeños de ML que pueda probar con el conjunto de datos iris y qué puedo aprender de cada uno.'
        }
      }
    }
  },
  'design-basics': {
    fr: {
      title: 'Concevez un prototype : du croquis à la CAO et à l’IA',
      intro: 'Découvrez les bases du design, transformez une idée en prototype 3D, essayez les outils de conversion de texte en CAO et lancez une première simulation.',
      steps: {
        'design-principles': {
          title: 'Découvrir les principes de base du design',
          explanation: [
            'Un bon design est d’abord clair, puis esthétique. Cinq idées couvrent la plupart des besoins des débutants : le contraste (les éléments importants ressortent), l’alignement (les éléments sont alignés), la répétition (les éléments semblables se ressemblent), l’espacement (on laisse de la place pour respirer) et la hiérarchie (l’élément le plus important est le plus grand).',
            'Observez une affiche ou une application que vous aimez et repérez chacune de ces cinq idées.'
          ],
          check: 'Vous avez trouvé un exemple de contraste et un exemple de hiérarchie dans un objet ou service que vous utilisez.',
          aiPrompt: 'Explique le contraste, l’alignement, la répétition, l’espacement et la hiérarchie avec un exemple concret pour chacun.'
        },
        'sketch-choose-tool': {
          title: 'Esquisser une idée et choisir un outil',
          explanation: [
            'Commencez par un objet simple que vous pouvez décrire en une phrase, comme un support de téléphone, un pot à crayons ou une petite boîte avec un couvercle. Dessinez-le de face et de côté, puis notez ses dimensions principales en millimètres.',
            'Choisissez un outil adapté. Pour des visuels en 2D, utilisez Canva ou Figma. Pour les objets 3D, les débutants peuvent commencer avec un outil simple dans le navigateur, comme Tinkercad, puis passer à Fusion 360 lorsqu’ils ont besoin de pièces précises. Vérifiez les conditions d’utilisation gratuite ou personnelle actuellement proposées par chaque outil.'
          ],
          check: 'Vous avez un croquis en deux vues avec des dimensions et vous avez choisi un outil.',
          aiPrompt: 'Aidez-moi à transformer cette idée en une liste de mesures et en un plan de forme simple : [décrivez votre objet].'
        },
        'build-prototype': {
          title: 'Créer un prototype simple',
          explanation: [
            'Construisez la forme dans votre outil en commençant par la forme la plus grande et la plus simple, puis ajoutez des détails. Enregistrez souvent et choisissez des noms clairs pour les pièces.',
            'L’IA peut vous aider de deux façons : elle peut expliquer les étapes à suivre dans votre outil, et certains outils récents peuvent générer un modèle 3D à partir d’une description en langage courant. Considérez les modèles générés comme un premier brouillon : vous devez vérifier les dimensions et la faisabilité de la pièce.'
          ],
          code: 'Je débute avec [votre outil]. Donne-moi des instructions étape par étape pour modéliser un support de téléphone de 80 mm de large, 100 mm de haut et 60 mm de profondeur, avec une fente de 12 mm pour le téléphone. Utilise les vrais noms des menus de l’outil et précise si tu as un doute sur une étape.',
          check: 'Vous avez un prototype visuel ou 3D dont les dimensions mesurées correspondent à votre croquis.',
          aiPrompt: 'Mon modèle ne ressemble pas aux instructions. Voici ce que je vois : [décrivez-le]. Qu’est-ce que j’ai probablement fait différemment ?'
        },
        'cad-ai-simulation': {
          title: 'Aller plus loin : texte vers CAO et simulation',
          explanation: [
            'Certains outils récents peuvent créer une pièce 3D à partir d’une requête textuelle, par exemple un service de conversion de texte en CAO comme Zoo. Décrivez clairement la pièce : sa forme, ses dimensions en millimètres, ses trous et ses unités. Vérifiez toujours les dimensions du résultat avant de l’utiliser.',
            'Des outils de CAO professionnels comme Fusion 360 et Onshape peuvent aussi lancer des simulations, par exemple pour voir où une pièce se plie ou se casse sous une charge. Pour débuter, faites un test de contrainte statique simple sur une seule pièce. Les fonctionnalités et les limites des offres gratuites évoluent : consultez d’abord la documentation actuelle de chaque outil.',
            'Important : une simulation n’est qu’une estimation. Pour tout ce qui touche à la sécurité, comme un objet qui supporte un poids ou des personnes, demandez à un ingénieur qualifié de vérifier le résultat.'
          ],
          code: 'Créez une équerre rectangulaire de 60 mm de long, 30 mm de large et 5 mm d’épaisseur, fabriquée d’une seule pièce, avec deux trous de 6 mm centrés à 10 mm de chaque extrémité. Les unités sont en millimètres.',
          check: 'Vous avez généré ou modélisé l’équerre, vérifié ses dimensions par rapport à la requête et essayé une simulation simple, par exemple une force vers le bas sur une extrémité.',
          aiPrompt: 'Explique simplement ce que montre une simulation de contrainte statique, ce que signifie « facteur de sécurité » et quelles sont les limites de cette simulation.'
        },
        'feedback-refine': {
          title: 'Recueillir des avis et améliorer le prototype',
          explanation: [
            'Montrez votre prototype à deux personnes et demandez-leur : qu’est-ce que c’est, que changeraient-elles et qu’est-ce qui les déroute ? Ne défendez pas votre design. Notez simplement leurs réponses.',
            'Choisissez une modification, créez une nouvelle version et nommez-la v2. Si vous prévoyez de l’imprimer en 3D, testez d’abord une petite version.'
          ],
          check: 'Vous avez recueilli l’avis de deux personnes et créé une v2 avec une modification claire.',
          aiPrompt: 'Donnez-moi 5 bonnes questions à poser aux gens quand je leur présente un prototype de design.'
        }
      }
    },
    de: {
      title: 'Einen Prototyp entwerfen: von der Skizze zu CAD und KI',
      intro: 'Lerne die Grundlagen des Designs kennen, verwandle eine Idee in einen 3D-Prototyp, probiere Text-zu-CAD-Tools aus und führe eine erste Simulation durch.',
      steps: {
        'design-principles': {
          title: 'Grundlegende Designprinzipien kennenlernen',
          explanation: [
            'Gutes Design ist erst verständlich und dann hübsch. Fünf Ideen decken die meisten Bedürfnisse von Einsteigern ab: Kontrast (Wichtiges fällt auf), Ausrichtung (Elemente liegen auf einer Linie), Wiederholung (Ähnliches sieht ähnlich aus), Abstände (genug Raum zum Atmen) und Hierarchie (das Wichtigste ist am größten).',
            'Schau dir ein Poster oder eine App an, die dir gefällt, und zeige auf jedes der fünf Prinzipien.'
          ],
          check: 'Du hast bei etwas, das du verwendest, ein Beispiel für Kontrast und eines für Hierarchie gefunden.',
          aiPrompt: 'Erkläre Kontrast, Ausrichtung, Wiederholung, Abstände und Hierarchie mit jeweils einem Beispiel aus dem Alltag.'
        },
        'sketch-choose-tool': {
          title: 'Eine Idee skizzieren und ein Tool auswählen',
          explanation: [
            'Beginne mit einem einfachen Gegenstand, den du in einem Satz beschreiben kannst, zum Beispiel einem Handyhalter, einem Stiftehalter oder einer kleinen Schachtel mit Deckel. Skizziere ihn von vorne und von der Seite und notiere die wichtigsten Maße in Millimetern.',
            'Wähle ein passendes Tool. Für flache Grafiken eignen sich Canva oder Figma. Für 3D-Objekte können Einsteiger mit einem einfachen Browser-Tool wie Tinkercad starten und später zu Fusion 360 wechseln, wenn sie präzise Teile brauchen. Prüfe die aktuellen Bedingungen für die kostenlose oder private Nutzung jedes Tools.'
          ],
          check: 'Du hast eine Skizze mit zwei Ansichten und Maßen erstellt und ein Tool ausgewählt.',
          aiPrompt: 'Hilf mir, diese Idee in eine Maßliste und einen einfachen Formplan umzuwandeln: [beschreibe deinen Gegenstand].'
        },
        'build-prototype': {
          title: 'Einen einfachen Prototyp bauen',
          explanation: [
            'Baue die Form in deinem Tool auf. Beginne mit der größten, einfachsten Form und füge später Details hinzu. Speichere regelmäßig und verwende klare Namen für die Teile.',
            'KI kann auf zwei Arten helfen: Sie kann dir die Schritte für dein Tool erklären, und manche neueren Tools können aus einer Beschreibung in normaler Sprache ein 3D-Modell erstellen. Betrachte generierte Modelle als ersten Entwurf, denn du musst die Maße und die tatsächliche Herstellbarkeit des Teils prüfen.'
          ],
          code: 'Ich bin Anfänger und benutze [dein Tool]. Gib mir eine Schritt-für-Schritt-Anleitung, um einen Handyhalter mit 80 mm Breite, 100 mm Höhe und 60 mm Tiefe sowie einem 12 mm breiten Schlitz für das Handy zu modellieren. Verwende die echten Menünamen des Tools und sage dazu, wenn du dir bei einem Schritt nicht sicher bist.',
          check: 'Du hast einen 3D- oder visuellen Prototyp, dessen gemessene Maße mit deiner Skizze übereinstimmen.',
          aiPrompt: 'Mein Modell sieht anders aus als in der Anleitung. Das sehe ich: [beschreibe es]. Was habe ich wahrscheinlich anders gemacht?'
        },
        'cad-ai-simulation': {
          title: 'Weiterlernen: Text-zu-CAD und Simulation',
          explanation: [
            'Manche neueren Tools können aus einem Textprompt ein 3D-Teil erstellen, zum Beispiel ein Text-zu-CAD-Angebot wie Zoo. Beschreibe das Teil genau: Form, Maße in Millimetern, Löcher und Einheiten. Prüfe die Maße des Ergebnisses immer, bevor du es verwendest.',
            'Professionelle CAD-Tools wie Fusion 360 und Onshape können auch Simulationen ausführen, zum Beispiel um zu sehen, wo sich ein Teil unter Belastung biegt oder bricht. Beginne als Einsteiger mit einem einfachen statischen Belastungstest an einem Teil. Funktionen und kostenlose Nutzungslimits ändern sich; lies deshalb zuerst die aktuelle Dokumentation des jeweiligen Tools.',
            'Wichtig: Eine Simulation ist nur eine Schätzung. Bei allem, was die Sicherheit betrifft, etwa bei Gegenständen, die Gewicht oder Menschen tragen, sollte eine qualifizierte Ingenieurin oder ein qualifizierter Ingenieur das Ergebnis prüfen.'
          ],
          code: 'Erstelle einen rechteckigen Winkel mit 60 mm Länge, 30 mm Breite und 5 mm Dicke aus einem einzigen Stück. Er hat zwei 6-mm-Löcher, deren Mittelpunkte jeweils 10 mm vom Ende entfernt liegen. Die Einheiten sind Millimeter.',
          check: 'Du hast den Winkel erstellt oder modelliert, seine Maße mit dem Prompt verglichen und eine einfache Simulation ausprobiert, zum Beispiel eine nach unten gerichtete Kraft an einem Ende.',
          aiPrompt: 'Erkläre einfach, was eine statische Belastungssimulation zeigt, was „Sicherheitsfaktor“ bedeutet und wo die Grenzen liegen.'
        },
        'feedback-refine': {
          title: 'Feedback einholen und verbessern',
          explanation: [
            'Zeige deinen Prototyp zwei Personen und frage: Was ist das? Was würdest du ändern? Was ist unklar? Verteidige dein Design nicht. Schreibe einfach die Antworten auf.',
            'Wähle eine Änderung aus, erstelle eine neue Version und nenne sie v2. Wenn du sie 3D-drucken möchtest, teste zuerst eine kleine Version.'
          ],
          check: 'Du hast Feedback von zwei Personen gesammelt und eine v2 mit einer klaren Änderung erstellt.',
          aiPrompt: 'Nenne mir 5 gute Fragen, die ich Leuten stellen kann, wenn ich ihnen einen Designprototyp zeige.'
        }
      }
    },
    es: {
      title: 'Diseña un prototipo: del boceto al CAD y la IA',
      intro: 'Aprende los fundamentos del diseño, convierte una idea en un prototipo 3D, prueba herramientas de texto a CAD y realiza una primera simulación.',
      steps: {
        'design-principles': {
          title: 'Aprende los principios básicos del diseño',
          explanation: [
            'Un buen diseño es claro antes que bonito. Cinco ideas cubren la mayoría de las necesidades de quien empieza: contraste (lo importante destaca), alineación (los elementos quedan alineados), repetición (lo parecido se ve parecido), espacio (deja sitio para respirar) y jerarquía (lo más importante es lo más grande).',
            'Mira un póster o una aplicación que te guste e identifica cada una de las cinco ideas.'
          ],
          check: 'Has encontrado un ejemplo de contraste y otro de jerarquía en algo que utilizas.',
          aiPrompt: 'Explica el contraste, la alineación, la repetición, el espacio y la jerarquía con un ejemplo de la vida real para cada uno.'
        },
        'sketch-choose-tool': {
          title: 'Haz un boceto y elige una herramienta',
          explanation: [
            'Empieza con un objeto sencillo que puedas describir en una frase, como un soporte para el móvil, un portalápices o una caja pequeña con tapa. Haz un boceto de frente y de lado, y anota las medidas principales en milímetros.',
            'Elige una herramienta adecuada. Para imágenes planas, usa Canva o Figma. Para objetos 3D, puedes empezar con una herramienta sencilla en el navegador, como Tinkercad, y pasar a Fusion 360 cuando necesites piezas precisas. Comprueba las condiciones actuales de uso gratuito o personal de cada herramienta.'
          ],
          check: 'Tienes un boceto con dos vistas y medidas, y has elegido una herramienta.',
          aiPrompt: 'Ayúdame a convertir esta idea en una lista de medidas y un plan de formas sencillo: [describe tu objeto].'
        },
        'build-prototype': {
          title: 'Construye un prototipo sencillo',
          explanation: [
            'Construye la forma en tu herramienta. Empieza por la forma más grande y sencilla y añade los detalles después. Guarda a menudo y pon nombres claros a las piezas.',
            'La IA puede ayudar de dos maneras: puede explicarte los pasos para usar tu herramienta, y algunas herramientas recientes pueden generar un modelo 3D a partir de una descripción en lenguaje sencillo. Toma los modelos generados como un primer borrador: tienes que comprobar las medidas y si la pieza realmente se puede fabricar.'
          ],
          code: 'Soy principiante y uso [tu herramienta]. Dame instrucciones paso a paso para modelar un soporte para el móvil de 80 mm de ancho, 100 mm de alto y 60 mm de profundidad, con una ranura de 12 mm para el móvil. Usa los nombres reales de los menús de la herramienta y dime si tienes dudas sobre algún paso.',
          check: 'Tienes un prototipo visual o 3D cuyas medidas coinciden con las de tu boceto.',
          aiPrompt: 'Mi modelo no se parece a las instrucciones. Esto es lo que veo: [descríbelo]. ¿Qué es probable que haya hecho de otra manera?'
        },
        'cad-ai-simulation': {
          title: 'Ve más allá: texto a CAD y simulación',
          explanation: [
            'Algunas herramientas recientes pueden crear una pieza 3D a partir de un prompt de texto; por ejemplo, un servicio de texto a CAD como Zoo. Describe bien la pieza: su forma, las medidas en milímetros, los agujeros y las unidades. Comprueba siempre las dimensiones del resultado antes de usarlo.',
            'Las herramientas CAD profesionales, como Fusion 360 y Onshape, también pueden ejecutar simulaciones para ver, por ejemplo, dónde se dobla o se rompe una pieza bajo una carga. Si estás empezando, haz una prueba sencilla de tensión estática con una sola pieza. Las funciones y los límites gratuitos cambian, así que consulta primero la documentación actual de cada herramienta.',
            'Importante: una simulación es solo una estimación. Para cualquier cosa relacionada con la seguridad, como un objeto que soporta peso o personas, pide a un ingeniero cualificado que la revise.'
          ],
          code: 'Crea un soporte angular rectangular de 60 mm de largo, 30 mm de ancho y 5 mm de grosor, fabricado en una sola pieza, con dos agujeros de 6 mm centrados a 10 mm de cada extremo. Las unidades son milímetros.',
          check: 'Has generado o modelado el soporte, has comparado sus medidas con el prompt y has probado una simulación sencilla, como aplicar una fuerza hacia abajo en un extremo.',
          aiPrompt: 'Explica con palabras sencillas qué muestra una simulación de tensión estática, qué significa «factor de seguridad» y cuáles son sus límites.'
        },
        'feedback-refine': {
          title: 'Recoge opiniones y mejora el diseño',
          explanation: [
            'Enseña tu prototipo a dos personas y pregúntales: ¿qué es?, ¿qué cambiarías? y ¿qué te confunde? No defiendas tu diseño. Limítate a anotar sus respuestas.',
            'Elige un cambio, crea una nueva versión y llámala v2. Si piensas imprimirla en 3D, prueba primero con una versión pequeña.'
          ],
          check: 'Has recogido comentarios de dos personas y has creado una v2 con un cambio claro.',
          aiPrompt: 'Dame 5 buenas preguntas para hacerle a la gente cuando le enseñe un prototipo de diseño.'
        }
      }
    }
  }
};
