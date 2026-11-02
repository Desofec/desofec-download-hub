import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const webNocodeTranslations: Record<string, Partial<Record<'fr' | 'de' | 'es', TutorialTranslation>>> = {
  'web-starter': {
    fr: {
      title: 'Créer et publier votre première page web',
      intro: 'Découvrez le fonctionnement des pages web, concevez une mise en page simple, créez-la avec HTML et publiez-la gratuitement.',
      steps: {
        'web-basics': {
          title: 'Découvrir les bases du web',
          explanation: [
            'Chaque page web repose sur trois couches. HTML définit le contenu et la structure, CSS détermine le style et JavaScript gère le comportement. Aujourd’hui, vous avez seulement besoin de HTML et d’un peu de CSS.',
            'Votre page se trouve dans un fichier appelé index.html. Un navigateur lit ce fichier et affiche la page. Ouvrez n’importe quel site, faites un clic droit et choisissez « Afficher le code source de la page » pour voir du vrai HTML.'
          ],
          check: 'Vous avez ouvert le code source d’un site et trouvé une balise de titre comme <h1> ou <h2>.',
          aiPrompt: 'Explique HTML, CSS et JavaScript en prenant une maison comme exemple. Limite-toi à 6 phrases.'
        },
        'design-layout': {
          title: 'Concevoir la mise en page',
          explanation: [
            'Avant de coder, dessinez la page sur papier ou dans Figma ou Canva. Une page personnelle simple a besoin d’un en-tête avec votre nom, d’une section de présentation, d’une courte liste et d’un lien de contact.',
            'Faites simple : une seule colonne, un texte facile à lire et une couleur principale. Vous pourrez toujours ajouter des éléments plus tard.'
          ],
          check: 'Vous avez un croquis rapide avec quatre blocs nommés : en-tête, présentation, centres d’intérêt et contact.',
          aiPrompt: 'Propose une mise en page simple d’une page personnelle pour une personne débutante et explique le rôle de chaque section.'
        },
        'build-page': {
          title: 'Créer une page simple',
          explanation: [
            'Créez un compte gratuit sur replit.com (ou utilisez VS Code), créez un nouveau projet HTML et ouvrez index.html. Remplacez tout son contenu par le code ci-dessous, puis modifiez le texte pour parler de vous.',
            'Le bloc <style> contient le CSS. Essayez de remplacer la couleur #2563eb par une autre et observez le changement dans l’aperçu.'
          ],
          check: 'L’aperçu affiche un en-tête coloré avec votre nom et les sections en dessous. Vous avez remplacé les exemples par vos propres mots.',
          aiPrompt: 'Explique ce fichier index.html ligne par ligne à une personne débutante. Ne le modifie pas.'
        },
        'publish-share': {
          title: 'Publier et partager',
          explanation: [
            'Publier consiste à placer votre fichier sur un serveur afin que tout le monde puisse l’ouvrir avec un lien. Une solution gratuite est GitHub Pages : créez un compte GitHub, créez un nouveau dépôt public, téléversez index.html, puis ouvrez Settings, ensuite Pages, et choisissez de déployer depuis la branche main.',
            'Après une ou deux minutes, GitHub affiche l’adresse de votre page. Ouvrez-la aussi sur votre téléphone. Ne partagez que ce que vous êtes à l’aise de montrer au monde entier et ne publiez jamais de détails privés comme votre adresse personnelle.'
          ],
          check: 'Vous avez ouvert votre lien public sur un autre appareil et l’avez partagé avec une personne.',
          aiPrompt: 'Guide-moi pas à pas pour publier un seul fichier index.html avec GitHub Pages.'
        }
      }
    },
    de: {
      title: 'Deine erste Webseite erstellen und veröffentlichen',
      intro: 'Lerne, wie Webseiten funktionieren, entwirf ein einfaches Layout, erstelle es mit HTML und veröffentliche es kostenlos.',
      steps: {
        'web-basics': {
          title: 'Die Grundlagen des Webs kennenlernen',
          explanation: [
            'Jede Webseite besteht aus drei Ebenen. HTML enthält den Inhalt und die Struktur, CSS bestimmt das Aussehen und JavaScript das Verhalten. Heute brauchst du nur HTML und ein wenig CSS.',
            'Deine Seite liegt in einer Datei namens index.html. Ein Browser liest diese Datei und zeigt die Seite an. Öffne eine beliebige Webseite, klicke mit der rechten Maustaste und wähle „Seitenquelltext anzeigen“, um echtes HTML zu sehen.'
          ],
          check: 'Du hast den Seitenquelltext einer Webseite geöffnet und ein Überschriften-Tag wie <h1> oder <h2> gefunden.',
          aiPrompt: 'Erkläre HTML, CSS und JavaScript mit einem Haus als Vergleich. Beschränke dich auf 6 Sätze.'
        },
        'design-layout': {
          title: 'Das Layout entwerfen',
          explanation: [
            'Skizziere die Seite vor dem Programmieren auf Papier oder in Figma oder Canva. Eine einfache persönliche Seite braucht eine Kopfzeile mit deinem Namen, einen Über-mich-Bereich, eine kurze Liste und einen Kontaktlink.',
            'Halte es einfach: eine Spalte, gut lesbarer Text und eine Hauptfarbe. Du kannst später jederzeit mehr hinzufügen.'
          ],
          check: 'Du hast eine schnelle Skizze mit vier beschrifteten Bereichen: Kopfzeile, Über mich, Interessen und Kontakt.',
          aiPrompt: 'Schlage ein einfaches einseitiges Layout für eine persönliche Webseite für Anfänger vor und erkläre, wozu die einzelnen Bereiche dienen.'
        },
        'build-page': {
          title: 'Eine einfache Seite erstellen',
          explanation: [
            'Erstelle ein kostenloses Konto auf replit.com (oder verwende VS Code), lege ein neues HTML-Projekt an und öffne index.html. Ersetze den gesamten Inhalt durch den Code unten und passe den Text dann an dich an.',
            'Der <style>-Block enthält das CSS. Ändere testweise die Farbe #2563eb und beobachte, wie sich die Vorschau verändert.'
          ],
          check: 'Die Vorschau zeigt eine farbige Kopfzeile mit deinem Namen und darunter die Abschnitte. Du hast die Platzhalter durch eigene Worte ersetzt.',
          aiPrompt: 'Erkläre diese index.html für Anfänger Zeile für Zeile. Ändere sie nicht.'
        },
        'publish-share': {
          title: 'Veröffentlichen und teilen',
          explanation: [
            'Beim Veröffentlichen legst du deine Datei auf einem Server ab, damit alle sie über einen Link öffnen können. Eine kostenlose Möglichkeit ist GitHub Pages: Erstelle ein GitHub-Konto und ein neues öffentliches Repository, lade index.html hoch, öffne dann Settings und Pages und wähle die Bereitstellung über den main-Branch.',
            'Nach ein oder zwei Minuten zeigt GitHub die Adresse deiner Seite an. Öffne sie auch auf deinem Smartphone. Teile nur, was die ganze Welt sehen darf, und veröffentliche niemals private Angaben wie deine Wohnadresse.'
          ],
          check: 'Du hast deinen öffentlichen Link auf einem anderen Gerät geöffnet und mit einer Person geteilt.',
          aiPrompt: 'Führe mich Schritt für Schritt durch die Veröffentlichung einer einzelnen index.html-Datei mit GitHub Pages.'
        }
      }
    },
    es: {
      title: 'Crea y publica tu primera página web',
      intro: 'Aprende cómo funcionan las páginas web, diseña una estructura sencilla, créala con HTML y publícala gratis.',
      steps: {
        'web-basics': {
          title: 'Aprende los conceptos básicos de la web',
          explanation: [
            'Toda página web se construye con tres capas. HTML contiene el contenido y la estructura, CSS define el estilo y JavaScript controla el comportamiento. Hoy solo necesitas HTML y un poco de CSS.',
            'Tu página está en un archivo llamado index.html. Un navegador lee ese archivo y muestra la página. Abre cualquier sitio web, haz clic con el botón derecho y elige «Ver código fuente de la página» para ver HTML real.'
          ],
          check: 'Has abierto el código fuente de un sitio web y encontrado una etiqueta de encabezado como <h1> o <h2>.',
          aiPrompt: 'Explica HTML, CSS y JavaScript usando una casa como comparación. Limítate a 6 frases.'
        },
        'design-layout': {
          title: 'Diseña la estructura',
          explanation: [
            'Antes de programar, dibuja la página en papel o en Figma o Canva. Una página personal sencilla necesita un encabezado con tu nombre, una sección sobre ti, una lista breve y un enlace de contacto.',
            'Que sea sencilla: una columna, texto fácil de leer y un color principal. Siempre puedes añadir más cosas después.'
          ],
          check: 'Tienes un boceto rápido con cuatro bloques etiquetados: encabezado, sobre mí, intereses y contacto.',
          aiPrompt: 'Sugiere una estructura sencilla de una página personal para alguien que está empezando y explica para qué sirve cada sección.'
        },
        'build-page': {
          title: 'Crea una página sencilla',
          explanation: [
            'Crea una cuenta gratuita en replit.com (o usa VS Code), crea un proyecto HTML nuevo y abre index.html. Sustituye todo su contenido por el código siguiente y luego cambia el texto para que hable de ti.',
            'El bloque <style> contiene el CSS. Prueba a cambiar el color #2563eb por otro y observa cómo cambia la vista previa.'
          ],
          check: 'La vista previa muestra un encabezado de color con tu nombre y las secciones debajo. Has sustituido los textos de ejemplo por tus propias palabras.',
          aiPrompt: 'Explica este archivo index.html línea por línea para alguien que está empezando. No lo cambies.'
        },
        'publish-share': {
          title: 'Publica y comparte',
          explanation: [
            'Publicar significa colocar tu archivo en un servidor para que cualquiera pueda abrirlo con un enlace. Una opción gratuita es GitHub Pages: crea una cuenta de GitHub, crea un repositorio público, sube index.html, abre Settings y después Pages, y elige implementar desde la rama main.',
            'Al cabo de uno o dos minutos, GitHub mostrará la dirección de tu página. Ábrela también en tu teléfono. Comparte solo aquello que quieras que vea todo el mundo y nunca publiques datos privados como la dirección de tu casa.'
          ],
          check: 'Has abierto tu enlace público en otro dispositivo y lo has compartido con una persona.',
          aiPrompt: 'Guíame paso a paso para publicar un único archivo index.html con GitHub Pages.'
        }
      }
    }
  },
  'no-code-builder': {
    fr: {
      title: 'Créer un petit outil sans code',
      intro: 'Transformez un vrai problème en outil fonctionnel avec un tableau de données et une automatisation, sans écrire de code.',
      steps: {
        'pick-problem': {
          title: 'Choisir un problème simple à résoudre',
          explanation: [
            'Le meilleur premier projet répond à un petit problème que vous rencontrez vraiment : suivre les livres que vous voulez lire, des candidatures, des demandes de clients ou des inscriptions à un événement.',
            'Écrivez une phrase selon ce modèle : « Je veux suivre ___ pour pouvoir ___. » Gardez une première version très simple.'
          ],
          code: 'Je veux créer un petit outil sans code pour suivre [votre idée]. Propose la version la plus simple possible : quelles informations stocker, ce qu’il doit faire automatiquement et ce qu’il faut laisser de côté pour la version 1.',
          check: 'Vous avez formulé votre problème en une phrase et choisi 4 à 6 informations à suivre.',
          aiPrompt: 'Aide-moi à simplifier cette idée pour qu’une personne débutante puisse la réaliser en un après-midi.'
        },
        'organize-data': {
          title: 'Organiser les données dans un tableau',
          explanation: [
            'Un tableau se compose de lignes et de colonnes. Chaque ligne représente un élément, par exemple un livre. Chaque colonne contient une information à son sujet, comme le titre, le statut ou la date. Créez un compte Airtable gratuit et une nouvelle base avec un tableau.',
            'Choisissez un type adapté pour chaque colonne : texte, date, case à cocher ou sélection unique pour un statut comme « À faire », « En cours » et « Terminé ». Ajoutez cinq vraies lignes.'
          ],
          check: 'Votre tableau comporte 4 à 6 colonnes et 5 vraies lignes, et Statut est une colonne à sélection unique.',
          aiPrompt: 'Propose des noms et des types de colonnes pour un tableau qui suit [votre idée].'
        },
        'connect-automation': {
          title: 'Relier une automatisation à l’outil',
          explanation: [
            'Une automatisation dit : quand ceci se produit, fais cela. Par exemple, quand le statut d’une ligne passe à « Terminé », envoyez-vous un e-mail. Zapier et Make se connectent tous deux à Airtable et proposent une offre gratuite. Vérifiez les limites gratuites actuelles avant de commencer.',
            'Créez l’automatisation la plus simple : un déclencheur qui se lance lorsqu’un enregistrement est créé ou modifié, et une action. Testez-la avec une vraie ligne avant de l’activer.'
          ],
          code: 'J’utilise Airtable et je veux créer une automatisation dans [Zapier ou Make]. Quand le statut d’une ligne passe à « Terminé », envoie-moi un e-mail avec le titre de la ligne. Donne-moi les étapes de configuration dans l’ordre, en utilisant les noms actuels des écrans si tu les connais.',
          check: 'Vous avez modifié le statut d’une ligne en « Terminé » et reçu l’e-mail. Sinon, consultez l’historique des exécutions de l’automatisation pour trouver l’erreur.',
          aiPrompt: 'Mon automatisation ne s’est pas lancée. Voici ce que je vois : [décrivez-le]. Quelles sont les 3 causes les plus probables ?'
        },
        'share-improve': {
          title: 'Partager l’outil et l’améliorer',
          explanation: [
            'Partagez votre tableau avec une personne de confiance et demandez-lui d’ajouter une ligne sans votre aide. Observez ce qui la déroute : cela vous indique quoi améliorer.',
            'Faites une seule amélioration à la fois, par exemple une vue qui masque les éléments terminés ou un formulaire pour ajouter des lignes. Ne mettez jamais de données privées ou sensibles dans un outil partagé.'
          ],
          check: 'Une autre personne a utilisé votre outil et vous l’avez amélioré à partir de ses commentaires.',
          aiPrompt: 'Propose 5 questions à poser à une personne qui utilise mon outil pour la première fois, et explique comment transformer ses réponses en améliorations.'
        }
      }
    },
    de: {
      title: 'Ein kleines No-Code-Tool erstellen',
      intro: 'Mach aus einem echten Problem ein funktionierendes Tool mit einer Datentabelle und einer Automatisierung – ganz ohne Code.',
      steps: {
        'pick-problem': {
          title: 'Ein einfaches Problem auswählen',
          explanation: [
            'Das beste erste Projekt löst ein kleines Problem, das du wirklich hast: Bücher, die du lesen möchtest, Bewerbungen, Kundenanfragen oder Anmeldungen für eine Veranstaltung verwalten.',
            'Schreibe einen Satz nach diesem Muster: „Ich möchte ___ nachverfolgen, damit ich ___.“ Halte die erste Version klein.'
          ],
          code: 'Ich möchte ein kleines No-Code-Tool erstellen, um [deine Idee] zu verwalten. Schlage die einfachste mögliche Version vor: welche Informationen gespeichert werden sollen, was automatisch passieren soll und was in Version 1 weggelassen werden kann.',
          check: 'Du hast dein Problem in einem Satz formuliert und 4 bis 6 Informationen ausgewählt, die du verfolgen möchtest.',
          aiPrompt: 'Hilf mir, diese Idee so weit zu vereinfachen, dass ein Anfänger sie an einem Nachmittag umsetzen kann.'
        },
        'organize-data': {
          title: 'Daten in einer Tabelle organisieren',
          explanation: [
            'Eine Tabelle besteht aus Zeilen und Spalten. Jede Zeile steht für einen Eintrag, zum Beispiel ein Buch. Jede Spalte enthält eine Information dazu, etwa Titel, Status oder Datum. Erstelle ein kostenloses Airtable-Konto und eine neue Base mit einer Tabelle.',
            'Wähle für jede Spalte den passenden Typ: Text, Datum, Kontrollkästchen oder eine Einzelauswahl für einen Status wie „Zu erledigen“, „In Arbeit“ und „Erledigt“. Füge fünf echte Zeilen hinzu.'
          ],
          check: 'Deine Tabelle hat 4 bis 6 Spalten und 5 echte Zeilen. Status ist eine Spalte mit Einzelauswahl.',
          aiPrompt: 'Schlage Spaltennamen und Spaltentypen für eine Tabelle vor, mit der ich [deine Idee] verwalte.'
        },
        'connect-automation': {
          title: 'Eine Automatisierung damit verbinden',
          explanation: [
            'Eine Automatisierung folgt dem Prinzip: Wenn das passiert, dann tu das. Wenn zum Beispiel der Status einer Zeile auf „Erledigt“ wechselt, wird dir eine E-Mail geschickt. Sowohl Zapier als auch Make lassen sich mit Airtable verbinden und bieten einen kostenlosen Tarif. Prüfe vor dem Start die aktuellen Gratis-Limits.',
            'Baue die kleinstmögliche Automatisierung: einen Auslöser, der beim Erstellen oder Aktualisieren eines Datensatzes startet, und eine Aktion. Teste sie mit einer echten Zeile, bevor du sie einschaltest.'
          ],
          code: 'Ich nutze Airtable und möchte eine Automatisierung in [Zapier oder Make] einrichten. Wenn der Status einer Zeile auf „Erledigt“ wechselt, soll mir eine E-Mail mit dem Titel der Zeile gesendet werden. Gib mir die Einrichtungsschritte der Reihe nach und verwende, wenn möglich, die aktuellen Namen der Menüs und Bildschirme.',
          check: 'Du hast den Status einer Zeile auf „Erledigt“ geändert und die E-Mail erhalten. Falls nicht, prüfe den Ausführungsverlauf der Automatisierung auf den Fehler.',
          aiPrompt: 'Meine Automatisierung wurde nicht ausgeführt. Das sehe ich: [beschreibe es]. Was sind die 3 wahrscheinlichsten Ursachen?'
        },
        'share-improve': {
          title: 'Teilen und verbessern',
          explanation: [
            'Teile deine Tabelle mit einer vertrauten Person und bitte sie, ohne deine Hilfe eine Zeile hinzuzufügen. Beobachte, wobei sie unsicher ist – das zeigt dir, was du verbessern kannst.',
            'Nimm jeweils nur eine Änderung vor, zum Beispiel eine Ansicht, die erledigte Einträge ausblendet, oder ein Formular zum Hinzufügen von Zeilen. Speichere niemals private oder sensible Daten in einem geteilten Tool.'
          ],
          check: 'Eine andere Person hat dein Tool benutzt und du hast es anhand ihres Feedbacks verbessert.',
          aiPrompt: 'Nenne mir 5 Fragen für jemanden, der mein Tool zum ersten Mal nutzt, und erkläre, wie ich die Antworten in Verbesserungen umsetzen kann.'
        }
      }
    },
    es: {
      title: 'Crea una pequeña herramienta sin código',
      intro: 'Convierte un problema real en una herramienta funcional con una tabla de datos y una automatización, sin escribir código.',
      steps: {
        'pick-problem': {
          title: 'Elige un problema sencillo que resolver',
          explanation: [
            'El mejor primer proyecto resuelve un problema pequeño que tengas de verdad: llevar un seguimiento de los libros que quieres leer, las solicitudes de empleo, las peticiones de clientes o las inscripciones a un evento.',
            'Escribe una frase con este formato: «Quiero hacer un seguimiento de ___ para poder ___.» Mantén muy sencilla la primera versión.'
          ],
          code: 'Quiero crear una pequeña herramienta sin código para hacer un seguimiento de [tu idea]. Sugiere la versión más sencilla posible: qué información guardar, qué debería hacer automáticamente y qué dejar fuera de la versión 1.',
          check: 'Has escrito tu problema en una frase y has elegido entre 4 y 6 datos que quieres seguir.',
          aiPrompt: 'Ayúdame a simplificar esta idea para que alguien que está empezando pueda crearla en una tarde.'
        },
        'organize-data': {
          title: 'Organiza los datos en una tabla',
          explanation: [
            'Una tabla tiene filas y columnas. Cada fila representa un elemento, como un libro. Cada columna contiene un dato, como el título, el estado o la fecha. Crea una cuenta gratuita de Airtable y una base nueva con una tabla.',
            'Elige el tipo adecuado para cada columna: texto, fecha, casilla o selección única para un estado como «Por hacer», «En curso» y «Hecho». Añade cinco filas reales.'
          ],
          check: 'Tu tabla tiene entre 4 y 6 columnas y 5 filas reales, y Estado es una columna de selección única.',
          aiPrompt: 'Sugiere nombres y tipos de columnas para una tabla que haga un seguimiento de [tu idea].'
        },
        'connect-automation': {
          title: 'Conecta una automatización',
          explanation: [
            'Una automatización funciona así: cuando pasa esto, haz aquello. Por ejemplo, cuando el estado de una fila cambia a «Hecho», envíate un correo electrónico. Tanto Zapier como Make se conectan con Airtable y ofrecen un plan gratuito. Comprueba los límites gratuitos actuales antes de empezar.',
            'Crea la automatización más sencilla: un desencadenador que se active cuando se cree o actualice un registro y una acción. Pruébala con una fila real antes de activarla.'
          ],
          code: 'Uso Airtable y quiero crear una automatización en [Zapier o Make]. Cuando el estado de una fila pase a «Hecho», envíame un correo con el título de la fila. Dame los pasos de configuración en orden y usa los nombres actuales de las pantallas si los conoces.',
          check: 'Has cambiado el estado de una fila a «Hecho» y has recibido el correo. Si no, consulta el historial de ejecuciones de la automatización para ver el error.',
          aiPrompt: 'Mi automatización no se ha ejecutado. Esto es lo que veo: [descríbelo]. ¿Cuáles son las 3 causas más probables?'
        },
        'share-improve': {
          title: 'Compártela y mejórala',
          explanation: [
            'Comparte tu tabla con alguien de confianza y pídele que añada una fila sin tu ayuda. Fíjate en lo que le resulte confuso: eso te indica qué puedes mejorar.',
            'Haz una mejora cada vez, como una vista que oculte los elementos terminados o un formulario para añadir filas. Nunca pongas datos privados o sensibles en una herramienta compartida.'
          ],
          check: 'Otra persona ha usado tu herramienta y has hecho una mejora a partir de sus comentarios.',
          aiPrompt: 'Dame 5 preguntas para hacerle a alguien que usa mi herramienta por primera vez y explícame cómo convertir sus respuestas en mejoras.'
        }
      }
    }
  },
  'no-code-automation': {
    fr: {
      title: 'Automatiser votre première tâche',
      intro: 'Découvrez les flux de travail, connectez vos applications et créez une automatisation qui vous fait gagner du temps.',
      steps: {
        'understand-workflows': {
          title: 'Comprendre les flux de travail',
          explanation: [
            'Un flux de travail est une suite d’étapes qui s’exécutent dans l’ordre. Toute automatisation comporte un déclencheur (ce qui la lance), une ou plusieurs actions (ce qu’elle fait) et parfois des conditions (à exécuter uniquement si quelque chose est vrai).',
            'Pensez à une tâche répétitive que vous faites chaque semaine, puis décrivez-la ainsi : Quand ___ se produit, si ___, alors faire ___. '
          ],
          code: 'Explique les déclencheurs, les actions et les conditions avec 3 exemples du quotidien. Demande-moi ensuite quelle tâche répétitive je fais et aide-moi à la décrire comme un flux de travail en une phrase.',
          check: 'Vous avez écrit une phrase décrivant un flux de travail, avec un déclencheur et au moins une action.',
          aiPrompt: 'Qu’est-ce qui fait d’une tâche une bonne candidate à l’automatisation, et qu’est-ce qui en fait une mauvaise candidate ?'
        },
        'connect-tools': {
          title: 'Connecter des outils simples',
          explanation: [
            'Les outils d’automatisation comme Zapier, Make et n8n relient les applications que vous utilisez déjà. Zapier et Make sont hébergés et faciles à prendre en main. n8n peut être auto-hébergé, ce qui convient aux personnes à l’aise avec une configuration technique.',
            'Créez un compte gratuit sur l’un de ces outils et connectez deux applications, par exemple Gmail et Google Sheets. N’accordez que les autorisations nécessaires et vérifiez-les plus tard.'
          ],
          check: 'Deux applications sont connectées dans votre outil d’automatisation et leur statut indique qu’elles sont reliées.',
          aiPrompt: 'Compare Zapier, Make et n8n pour une personne totalement débutante en 6 lignes. Mentionne les limites des offres gratuites à vérifier.'
        },
        'automate-task': {
          title: 'Automatiser une tâche',
          explanation: [
            'Créez votre première automatisation à partir de la phrase décrivant votre flux de travail. Un excellent exemple pour commencer : quand un formulaire est envoyé, ajouter une ligne à un tableur et envoyer un message de remerciement.',
            'Faites d’abord un test avec de fausses données. Vérifiez que le résultat est correct avant d’activer l’automatisation pour de vrai.'
          ],
          check: 'Un test s’est terminé avec succès et le résultat est apparu à l’endroit prévu.',
          aiPrompt: 'Voici mon flux de travail : [collez-le]. Donne-moi les étapes de configuration pour [Zapier, Make ou n8n] et indique ce qui pourrait mal se passer.'
        },
        'review-improve': {
          title: 'Examiner les résultats et améliorer',
          explanation: [
            'Une automatisation peut échouer sans que vous le remarquiez. Après quelques jours, consultez l’historique des exécutions. Repérez les erreurs, les doublons et les étapes qui donnent des résultats étranges.',
            'Ajoutez une mesure de sécurité pour les tâches importantes, par exemple un e-mail envoyé en cas d’échec. Si une automatisation ne vous fait pas gagner de temps, désactivez-la.'
          ],
          check: 'Vous avez consulté l’historique, corrigé ou supprimé les éléments en échec et noté le temps gagné.',
          aiPrompt: 'Quelles sont les erreurs les plus fréquentes dans les automatisations sans code et comment les éviter ?'
        }
      }
    },
    de: {
      title: 'Deine erste Aufgabe automatisieren',
      intro: 'Lerne Workflows kennen, verbinde deine Apps und erstelle eine Automatisierung, die dir Zeit spart.',
      steps: {
        'understand-workflows': {
          title: 'Workflows verstehen',
          explanation: [
            'Ein Workflow ist eine Reihe von Schritten, die nacheinander ablaufen. Jede Automatisierung hat einen Auslöser (was sie startet), eine oder mehrere Aktionen (was sie tut) und manchmal Bedingungen (nur wenn etwas zutrifft).',
            'Denk an eine wiederkehrende Aufgabe, die du jede Woche erledigst, und formuliere sie so: Wenn ___ passiert, falls ___, dann ___ tun.'
          ],
          code: 'Erkläre Auslöser, Aktionen und Bedingungen anhand von 3 Beispielen aus dem Alltag. Frage mich anschließend nach einer wiederkehrenden Aufgabe und hilf mir, sie in einem Satz als Workflow zu formulieren.',
          check: 'Du hast einen Workflow-Satz mit einem Auslöser und mindestens einer Aktion geschrieben.',
          aiPrompt: 'Was macht eine Aufgabe zu einer guten oder schlechten Möglichkeit für eine Automatisierung?'
        },
        'connect-tools': {
          title: 'Einfache Tools verbinden',
          explanation: [
            'Automatisierungstools wie Zapier, Make und n8n verbinden Apps, die du bereits nutzt. Zapier und Make werden gehostet und sind anfängerfreundlich. n8n kannst du selbst hosten; das eignet sich für Menschen, die sich mit technischer Einrichtung wohlfühlen.',
            'Erstelle bei einem dieser Tools ein kostenloses Konto und verbinde zwei Apps, zum Beispiel Gmail und Google Sheets. Erteile nur die nötigen Berechtigungen und überprüfe sie später erneut.'
          ],
          check: 'Zwei Apps sind in deinem Automatisierungstool verbunden und werden als verbunden angezeigt.',
          aiPrompt: 'Vergleiche Zapier, Make und n8n für absolute Anfänger in 6 Zeilen. Erwähne kostenlose Nutzungslimits, die ich prüfen sollte.'
        },
        'automate-task': {
          title: 'Eine Aufgabe automatisieren',
          explanation: [
            'Erstelle deine erste Automatisierung anhand deines Workflow-Satzes. Ein guter Einstieg: Wenn ein Formular abgeschickt wird, eine Zeile zu einer Tabelle hinzufügen und eine Dankesnachricht senden.',
            'Führe zuerst einen Test mit erfundenen Daten durch. Prüfe, ob das Ergebnis stimmt, bevor du die Automatisierung aktivierst.'
          ],
          check: 'Ein Testlauf wurde erfolgreich abgeschlossen und das Ergebnis ist am erwarteten Ort erschienen.',
          aiPrompt: 'Hier ist mein Workflow: [füge ihn ein]. Gib mir die Einrichtungsschritte für [Zapier, Make oder n8n] und liste auf, was schiefgehen könnte.'
        },
        'review-improve': {
          title: 'Ergebnisse prüfen und verbessern',
          explanation: [
            'Jede Automatisierung kann unbemerkt fehlschlagen. Prüfe nach ein paar Tagen den Ausführungsverlauf. Achte auf Fehler, Duplikate und Schritte mit ungewöhnlichen Ergebnissen.',
            'Füge bei wichtigen Aufgaben eine Sicherheitsmaßnahme hinzu, zum Beispiel eine E-Mail an dich, wenn etwas fehlschlägt. Wenn eine Automatisierung keine Zeit spart, schalte sie aus.'
          ],
          check: 'Du hast den Ausführungsverlauf geprüft, Fehler behoben oder die Automatisierung entfernt und die eingesparte Zeit notiert.',
          aiPrompt: 'Was sind die häufigsten Fehler bei No-Code-Automatisierungen und wie kann ich sie verhindern?'
        }
      }
    },
    es: {
      title: 'Automatiza tu primera tarea',
      intro: 'Aprende cómo funcionan los flujos de trabajo, conecta tus aplicaciones y crea una automatización que te ahorre tiempo.',
      steps: {
        'understand-workflows': {
          title: 'Entiende los flujos de trabajo',
          explanation: [
            'Un flujo de trabajo es una serie de pasos que se ejecutan en orden. Toda automatización tiene un desencadenador (lo que la inicia), una o varias acciones (lo que hace) y, a veces, condiciones (solo si algo se cumple).',
            'Piensa en una tarea repetitiva que haces cada semana y escríbela así: Cuando ocurra ___, si ___, entonces haz ___. '
          ],
          code: 'Explica los desencadenadores, las acciones y las condiciones con 3 ejemplos cotidianos. Después pregúntame por una tarea repetitiva que hago y ayúdame a escribirla como un flujo de trabajo en una frase.',
          check: 'Has escrito una frase de flujo de trabajo con un desencadenador y al menos una acción.',
          aiPrompt: '¿Qué hace que una tarea sea una buena candidata para automatizar y qué hace que no lo sea?'
        },
        'connect-tools': {
          title: 'Conecta herramientas sencillas',
          explanation: [
            'Las herramientas de automatización, como Zapier, Make y n8n, conectan aplicaciones que ya usas. Zapier y Make están alojadas en la nube y son fáciles para principiantes. n8n se puede alojar por tu cuenta, una opción adecuada si te manejas bien con la configuración técnica.',
            'Crea una cuenta gratuita en una de ellas y conecta dos aplicaciones, por ejemplo Gmail y Google Sheets. Concede solo los permisos que necesites y revísalos más adelante.'
          ],
          check: 'Hay dos aplicaciones conectadas en tu herramienta de automatización y aparecen como conectadas.',
          aiPrompt: 'Compara Zapier, Make y n8n para alguien que empieza desde cero en 6 líneas. Menciona los límites del plan gratuito que debería comprobar.'
        },
        'automate-task': {
          title: 'Automatiza una tarea',
          explanation: [
            'Crea tu primera automatización a partir de la frase de tu flujo de trabajo. Una buena opción para empezar: cuando se envíe un formulario, añade una fila a una hoja de cálculo y envía un mensaje de agradecimiento.',
            'Haz primero una prueba con datos ficticios. Comprueba que el resultado sea correcto antes de activar la automatización de verdad.'
          ],
          check: 'La prueba se ha completado correctamente y el resultado ha aparecido donde esperabas.',
          aiPrompt: 'Este es mi flujo de trabajo: [pégalo]. Dame los pasos de configuración para [Zapier, Make o n8n] y enumera lo que podría salir mal.'
        },
        'review-improve': {
          title: 'Revisa los resultados y mejora',
          explanation: [
            'Cualquier automatización puede fallar sin que te des cuenta. Al cabo de unos días, consulta el historial de ejecuciones. Busca errores, duplicados y pasos con resultados extraños.',
            'Añade una medida de seguridad para las tareas importantes, como enviarte un correo cuando algo falle. Si una automatización no te ahorra tiempo, desactívala.'
          ],
          check: 'Has revisado el historial, has corregido o eliminado lo que fallaba y has anotado el tiempo ahorrado.',
          aiPrompt: '¿Cuáles son los errores más comunes en las automatizaciones sin código y cómo puedo evitarlos?'
        }
      }
    }
  }
};
