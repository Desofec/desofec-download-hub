import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const codingTranslations: Record<string, Partial<Record<'fr' | 'de' | 'es', TutorialTranslation>>> = {
  'coding-foundations': {
    fr: {
      title: 'Apprenez à coder avec Python',
      intro: 'Partez de zéro et créez votre premier vrai programme. Vous allez installer les outils, apprendre les bases, enregistrer votre travail avec Git et terminer par un petit jeu à partager.',
      steps: {
        'setup': {
          title: 'Installer et lancer votre premier programme',
          explanation: [
            'Installez Visual Studio Code (un éditeur gratuit) depuis code.visualstudio.com et Python depuis python.org. Sous Windows, cochez « Add Python to PATH » dans le programme d’installation.',
            'Dans VS Code, créez un dossier nommé my-first-python, ouvrez-le et ajoutez un fichier nommé main.py. Collez le code ci-dessous, puis cliquez sur le bouton Run (lecture) en haut à droite.'
          ],
          check: 'Un terminal s’ouvre en bas de VS Code et affiche : Hello, world !',
          aiPrompt: 'Je viens d’installer Python et VS Code. À quoi sert print() ? Explique-le comme si je débutais en programmation.'
        },
        'variables': {
          title: 'Variables, types et affichage',
          explanation: [
            'Une variable est une boîte étiquetée qui contient une valeur. Python possède quelques types de base : le texte (str), les nombres entiers (int), les nombres décimaux (float) et les valeurs vrai/faux (bool).',
            'Une f-string, écrite f"...", permet d’insérer des variables dans du texte en les plaçant entre accolades.'
          ],
          check: 'Quatre lignes s’affichent. La dernière indique <class \'int\'>. Remplacez maintenant name et age par les vôtres, puis relancez le programme.',
          aiPrompt: 'Explique str, int, float et bool en Python, avec un exemple de la vie quotidienne pour chacun.'
        },
        'conditions-loops': {
          title: 'Conditions et boucles',
          explanation: [
            'Une instruction if permet à votre programme de faire un choix. Une boucle for répète une tâche. Python utilise l’indentation (4 espaces) pour savoir quelles lignes en font partie.',
            'Ici, la boucle compte de 1 à 5 et if/else détermine si chaque nombre est pair ou impair. Le symbole % donne le reste d’une division.'
          ],
          check: 'Vous voyez cinq lignes, qui alternent pair et impair, en commençant par « 1 is odd ». Remplacez 6 par 11 et vérifiez que le compte va jusqu’à 10.',
          aiPrompt: 'Explique ce que produit range(1, 6) et pourquoi la boucle s’arrête à 5.'
        },
        'functions-lists': {
          title: 'Fonctions et listes',
          explanation: [
            'Une fonction est une recette réutilisable. Vous la définissez une fois avec def et vous l’utilisez autant de fois que vous le souhaitez. Une liste contient plusieurs valeurs dans un ordre donné.',
            'Ce programme conserve une liste de courses et utilise une fonction pour la décrire. Remarquez que append ajoute un élément et que len les compte.'
          ],
          check: 'Le programme affiche : You have 3 items: bread, milk, apples. Ajoutez un autre élément de votre choix et regardez le nombre changer.',
          aiPrompt: 'Explique comment la fonction describe reçoit une entrée et renvoie un résultat, en utilisant l’analogie d’un distributeur automatique.'
        },
        'git-github': {
          title: 'Suivre votre code avec Git et GitHub',
          explanation: [
            'Git enregistre des instantanés de votre projet pour vous permettre de revenir en arrière en cas de problème. GitHub en conserve une copie en ligne pour que vous puissiez la partager.',
            'Installez Git depuis git-scm.com, créez un compte GitHub gratuit et créez un dépôt vide nommé my-first-python (remplacez YOUR-NAME dans les commandes ci-dessous par votre nom d’utilisateur GitHub). Exécutez ensuite ces commandes une par une dans le terminal de VS Code.'
          ],
          check: 'Actualisez la page de votre dépôt sur GitHub. Vous pouvez voir main.py et le message de votre commit.',
          aiPrompt: 'Explique en termes simples ce que font git init, git add, git commit et git push.'
        },
        'ai-explain': {
          title: 'Demander à un assistant IA d’expliquer du code',
          explanation: [
            'Les assistants IA comme GitHub Copilot ou OpenAI Codex sont de formidables tuteurs si vous leur demandez d’expliquer le code, et pas seulement d’en écrire. C’est en comprenant le code que vous progressez.',
            'Collez votre programme de fonctions et de listes dans l’assistant avec la requête ci-dessous, puis lisez la réponse avant de continuer. Si quelque chose n’est pas clair, posez une question complémentaire.'
          ],
          check: 'Vous pouvez expliquer avec vos propres mots ce que fait chaque ligne de votre programme.',
          aiPrompt: 'Explique ce programme Python ligne par ligne pour une personne qui débute. Pose-moi ensuite 3 petites questions pour vérifier que j’ai compris. Ne modifie pas le code.'
        },
        'mini-project': {
          title: 'Créer et partager un mini-projet',
          explanation: [
            'Mettez tout en pratique avec un jeu où il faut deviner un nombre. Il utilise une variable, une boucle, des conditions et une fonction des étapes précédentes.',
            'Lancez le jeu, jouez, puis modifiez-le : agrandissez la plage de nombres ou ajoutez une limite de 5 essais. Enregistrez vos changements avec Git et partagez le lien GitHub avec un ami.'
          ],
          check: 'Vous pouvez terminer une partie et le programme ne plante pas si vous saisissez des lettres. Vous avez envoyé la nouvelle version sur GitHub.',
          aiPrompt: 'Voici mon jeu de devinettes. Aide-moi à ajouter une limite de 5 essais, un petit changement à la fois, et explique chaque changement.'
        }
      }
    },
    de: {
      title: 'Programmieren mit Python lernen',
      intro: 'Starte ganz von vorn und schreibe dein erstes richtiges Programm. Du installierst die Werkzeuge, lernst die Grundlagen, speicherst deine Arbeit mit Git und beendest das Tutorial mit einem kleinen Spiel zum Teilen.',
      steps: {
        'setup': {
          title: 'Dein erstes Programm einrichten und starten',
          explanation: [
            'Installiere Visual Studio Code (einen kostenlosen Editor) von code.visualstudio.com und Python von python.org. Aktiviere unter Windows im Installer die Option „Add Python to PATH“.',
            'Erstelle in VS Code einen Ordner namens my-first-python, öffne ihn und lege eine neue Datei namens main.py an. Füge den Code unten ein und klicke dann oben rechts auf die Run-Schaltfläche (Play-Symbol).'
          ],
          check: 'Unten in VS Code öffnet sich ein Terminal und zeigt: Hello, world!',
          aiPrompt: 'Ich habe gerade Python und VS Code installiert. Was macht print()? Erkläre es so, als wäre ich neu beim Programmieren.'
        },
        'variables': {
          title: 'Variablen, Typen und Ausgabe',
          explanation: [
            'Eine Variable ist eine beschriftete Box, die einen Wert enthält. Python hat einige grundlegende Typen: Text (str), ganze Zahlen (int), Kommazahlen (float) und Wahr/Falsch-Werte (bool).',
            'Mit einem f-String, geschrieben als f"...", kannst du Variablen in Text einsetzen, indem du sie in geschweifte Klammern setzt.'
          ],
          check: 'Es erscheinen vier Zeilen. In der letzten steht <class \'int\'>. Ändere jetzt name und age zu deinen eigenen Angaben und starte das Programm erneut.',
          aiPrompt: 'Erkläre str, int, float und bool in Python mit je einem Beispiel aus dem Alltag.'
        },
        'conditions-loops': {
          title: 'Bedingungen und Schleifen',
          explanation: [
            'Mit einer if-Anweisung kann dein Programm eine Entscheidung treffen. Eine for-Schleife wiederholt eine Aufgabe. Python verwendet Einrückungen (4 Leerzeichen), um zu erkennen, welche Zeilen dazugehören.',
            'Hier zählt die Schleife von 1 bis 5, und if/else entscheidet, ob jede Zahl gerade oder ungerade ist. Das Symbol % liefert den Rest einer Division.'
          ],
          check: 'Du siehst fünf Zeilen im Wechsel, beginnend mit „1 is odd“. Ändere 6 zu 11 und prüfe, ob bis 10 gezählt wird.',
          aiPrompt: 'Erkläre, welche Werte range(1, 6) liefert und warum die Schleife bei 5 endet.'
        },
        'functions-lists': {
          title: 'Funktionen und Listen',
          explanation: [
            'Eine Funktion ist ein wiederverwendbares Rezept. Du definierst sie einmal mit def und kannst sie beliebig oft verwenden. Eine Liste enthält mehrere Werte in einer bestimmten Reihenfolge.',
            'Dieses Programm verwaltet eine Einkaufsliste und beschreibt sie mit einer Funktion. Beachte: append fügt einen Eintrag hinzu und len zählt sie.'
          ],
          check: 'Das Programm gibt aus: You have 3 items: bread, milk, apples. Füge einen weiteren Eintrag deiner Wahl hinzu und beobachte, wie sich die Anzahl ändert.',
          aiPrompt: 'Erkläre mit dem Bild eines Verkaufsautomaten, wie die Funktion describe eine Eingabe erhält und eine Ausgabe zurückgibt.'
        },
        'git-github': {
          title: 'Deinen Code mit Git und GitHub nachverfolgen',
          explanation: [
            'Git speichert Momentaufnahmen deines Projekts, damit du bei Problemen zu einem früheren Stand zurückkehren kannst. GitHub bewahrt eine Kopie online auf, damit du sie teilen kannst.',
            'Installiere Git von git-scm.com, erstelle ein kostenloses GitHub-Konto und ein leeres Repository namens my-first-python (ersetze YOUR-NAME in den Befehlen unten durch deinen GitHub-Benutzernamen). Führe die Befehle dann einzeln im VS-Code-Terminal aus.'
          ],
          check: 'Aktualisiere die Seite deines Repositorys auf GitHub. Dort siehst du main.py und deine Commit-Nachricht.',
          aiPrompt: 'Erkläre in einfachen Worten, was git init, git add, git commit und git push jeweils machen.'
        },
        'ai-explain': {
          title: 'Einen KI-Assistenten um eine Code-Erklärung bitten',
          explanation: [
            'KI-Assistenten wie GitHub Copilot oder OpenAI Codex sind tolle Lernhelfer, wenn du sie bittest, Code zu erklären und nicht nur zu schreiben. Du kommst voran, indem du den Code verstehst.',
            'Füge dein Programm mit Funktionen und Listen zusammen mit dem Prompt unten in den Assistenten ein und lies die Antwort, bevor du weitermachst. Wenn etwas unklar ist, frage nach.'
          ],
          check: 'Du kannst mit eigenen Worten erklären, was jede Zeile deines Programms macht.',
          aiPrompt: 'Erkläre dieses Python-Programm für Anfänger Zeile für Zeile. Stelle mir danach 3 kurze Fragen, um zu prüfen, ob ich es verstanden habe. Ändere den Code nicht.'
        },
        'mini-project': {
          title: 'Ein kleines Projekt bauen und teilen',
          explanation: [
            'Setze alles mit einem Zahlenratespiel zusammen. Es verwendet eine Variable, eine Schleife, Bedingungen und eine Funktion aus den vorherigen Schritten.',
            'Starte das Spiel, spiele es und ändere es dann: Vergrößere den Zahlenbereich oder begrenze die Anzahl der Versuche auf 5. Speichere deine Änderungen mit Git und teile den GitHub-Link mit einem Freund.'
          ],
          check: 'Du kannst das Spiel zu Ende spielen, und die Eingabe von Buchstaben lässt es nicht abstürzen. Du hast die neue Version zu GitHub hochgeladen.',
          aiPrompt: 'Hier ist mein Ratespiel. Hilf mir, eine Begrenzung auf 5 Versuche hinzuzufügen, eine kleine Änderung nach der anderen, und erkläre jede Änderung.'
        }
      }
    },
    es: {
      title: 'Aprende a programar con Python',
      intro: 'Empieza desde cero y crea tu primer programa de verdad. Instalarás las herramientas, aprenderás los conceptos básicos, guardarás tu trabajo con Git y terminarás con un pequeño juego que podrás compartir.',
      steps: {
        'setup': {
          title: 'Prepara y ejecuta tu primer programa',
          explanation: [
            'Instala Visual Studio Code (un editor gratuito) desde code.visualstudio.com y Python desde python.org. En Windows, marca «Add Python to PATH» en el instalador.',
            'En VS Code, crea una carpeta llamada my-first-python, ábrela y añade un archivo nuevo llamado main.py. Pega el código de abajo y pulsa el botón Run (reproducir) de la esquina superior derecha.'
          ],
          check: 'Se abre un terminal en la parte inferior de VS Code y muestra: Hello, world!',
          aiPrompt: 'Acabo de instalar Python y VS Code. ¿Qué hace print()? Explícamelo como si estuviera empezando a programar.'
        },
        'variables': {
          title: 'Variables, tipos y salida',
          explanation: [
            'Una variable es una caja etiquetada que guarda un valor. Python tiene algunos tipos básicos: texto (str), números enteros (int), decimales (float) y valores verdadero/falso (bool).',
            'Una f-string, escrita como f"...", permite insertar variables en un texto colocándolas entre llaves.'
          ],
          check: 'Aparecen cuatro líneas. La última dice <class \'int\'>. Ahora cambia name y age por tus propios datos y vuelve a ejecutarlo.',
          aiPrompt: 'Explícame str, int, float y bool en Python con un ejemplo cotidiano de cada uno.'
        },
        'conditions-loops': {
          title: 'Condiciones y bucles',
          explanation: [
            'Una instrucción if permite que tu programa elija. Un bucle for repite una tarea. Python usa la indentación (4 espacios) para saber qué líneas forman parte del bloque.',
            'Aquí, el bucle cuenta del 1 al 5 e if/else decide si cada número es par o impar. El símbolo % da el resto de una división.'
          ],
          check: 'Ves cinco líneas alternando entre pares e impares; la primera dice «1 is odd». Cambia 6 por 11 y comprueba que cuenta hasta 10.',
          aiPrompt: 'Explícame qué produce range(1, 6) y por qué el bucle se detiene en 5.'
        },
        'functions-lists': {
          title: 'Funciones y listas',
          explanation: [
            'Una función es una receta reutilizable. La defines una vez con def y la usas tantas veces como quieras. Una lista guarda varios valores en orden.',
            'Este programa guarda una lista de la compra y usa una función para describirla. Fíjate en que append añade un elemento y len los cuenta.'
          ],
          check: 'Imprime: You have 3 items: bread, milk, apples. Añade otro elemento que quieras y observa cómo cambia el recuento.',
          aiPrompt: 'Explícame cómo la función describe recibe una entrada y devuelve un resultado usando la analogía de una máquina expendedora.'
        },
        'git-github': {
          title: 'Haz un seguimiento de tu código con Git y GitHub',
          explanation: [
            'Git guarda instantáneas de tu proyecto para que puedas volver atrás si algo falla. GitHub conserva una copia en línea para que puedas compartirla.',
            'Instala Git desde git-scm.com, crea una cuenta gratuita de GitHub y un repositorio vacío llamado my-first-python (sustituye YOUR-NAME en los comandos de abajo por tu nombre de usuario de GitHub). Después ejecuta estos comandos de uno en uno en el terminal de VS Code.'
          ],
          check: 'Actualiza la página de tu repositorio en GitHub. Verás main.py y el mensaje de tu commit.',
          aiPrompt: 'Explícame con palabras sencillas qué hacen git init, git add, git commit y git push.'
        },
        'ai-explain': {
          title: 'Pide a un asistente de IA que explique código',
          explanation: [
            'Los asistentes de IA como GitHub Copilot o OpenAI Codex son excelentes tutores si les pides que expliquen el código, no solo que lo escriban. Progresas cuando entiendes el código.',
            'Pega tu programa de funciones y listas en el asistente junto con el prompt de abajo, y lee la respuesta antes de continuar. Si algo no está claro, haz una pregunta de seguimiento.'
          ],
          check: 'Puedes explicar con tus propias palabras qué hace cada línea de tu programa.',
          aiPrompt: 'Explica este programa de Python línea por línea para alguien que está empezando. Después, hazme 3 preguntas breves para comprobar que lo he entendido. No cambies el código.'
        },
        'mini-project': {
          title: 'Crea y comparte un miniproyecto',
          explanation: [
            'Ponlo todo en práctica con un juego de adivinar un número. Usa una variable, un bucle, condiciones y una función de los pasos anteriores.',
            'Ejecuta el juego, juégalo y luego cámbialo: amplía el rango o añade un límite de 5 intentos. Guarda tus cambios con Git y comparte el enlace de GitHub con un amigo.'
          ],
          check: 'Puedes terminar el juego y escribir letras no hace que se bloquee. Has subido la nueva versión a GitHub.',
          aiPrompt: 'Este es mi juego de adivinar. Ayúdame a añadir un límite de 5 intentos, con un pequeño cambio cada vez, y explícame cada cambio.'
        }
      }
    }
  },
  'ai-assisted-coding': {
    fr: {
      title: 'Coder avec un assistant IA',
      intro: 'Apprenez à travailler avec Copilot ou Codex sans perdre le contrôle. Vous écrirez une petite fonction Python avec l’aide de l’IA, puis vous la lirez, la testerez, la déboguerez et l’améliorerez. Si Python est nouveau pour vous, commencez par le tutoriel Python.',
      steps: {
        'pick-assistant': {
          title: 'Choisir et configurer un assistant',
          explanation: [
            'Un assistant de programmation IA vous aide en suggérant et en expliquant du code. GitHub Copilot (qui fonctionne dans VS Code) et OpenAI Codex sont deux bons choix. Choisissez-en un : vous n’avez pas besoin des deux.',
            'Dans VS Code, ouvrez le panneau Extensions, recherchez GitHub Copilot, installez-le et connectez-vous avec votre compte GitHub. Créez ensuite un dossier nommé ai-practice et ajoutez un fichier nommé palindrome.py. Votre projet est prêt.'
          ],
          check: 'Vous pouvez ouvrir la conversation avec l’assistant dans VS Code, lui envoyer un message comme « bonjour » et recevoir une réponse.',
          aiPrompt: 'Je débute et j’utilise VS Code. En quoi peux-tu m’aider et que dois-je toujours vérifier moi-même ?'
        },
        'clear-prompt': {
          title: 'Décrire une petite tâche avec une requête claire',
          explanation: [
            'Plus votre requête est précise, plus l’aide sera utile. Une requête claire indique ce que vous voulez, le langage à utiliser et les règles à respecter. Demandez une seule petite chose à la fois.',
            'Comparez une requête vague, « crée un vérificateur de mots », à une requête claire. La seconde précise la fonction, l’entrée et le résultat attendu. Envoyez la requête ci-dessous à votre assistant.'
          ],
          code: 'Écris une fonction Python is_palindrome(text) qui renvoie True si le texte se lit de la même façon à l’endroit et à l’envers, en ignorant les espaces et les majuscules. Ajoute 3 exemples d’appel avec print(). Fais simple pour une personne qui débute.',
          check: 'L’assistant vous donne une courte fonction et trois exemples d’appel. Collez le code dans palindrome.py.',
          aiPrompt: 'Aide-moi à améliorer cette requête pour qu’elle soit plus claire. Pose-moi des questions s’il manque quelque chose.'
        },
        'understand-code': {
          title: 'Lire et comprendre le code généré',
          explanation: [
            'N’exécutez jamais du code que vous ne comprenez pas. L’IA peut se tromper avec assurance, et vous restez responsable de ce que vous livrez.',
            'Lisez le code de haut en bas. Pour chaque ligne que vous ne pouvez pas expliquer, posez une question à l’assistant. Votre objectif est de pouvoir décrire toute la fonction avec vos propres mots.'
          ],
          code: 'Explique cette fonction ligne par ligne pour une personne qui débute. Pose-moi ensuite 2 questions pour vérifier ce que j’ai compris. Ne modifie pas le code.',
          check: 'Sans regarder le code, vous pouvez expliquer ce que fait chaque ligne et pourquoi les espaces et les majuscules sont supprimés en premier.',
          aiPrompt: 'Fais-moi un quiz sur ce code avec 3 petites questions et dis-moi si mes réponses sont correctes.'
        },
        'run-test': {
          title: 'Lancer le programme et écrire un test simple',
          explanation: [
            'Un test vérifie que votre code fait ce que vous attendez. Une instruction assert ne fait rien si la condition est vraie et arrête le programme avec une erreur si elle est fausse.',
            'Ajoutez ces lignes en bas de palindrome.py, sous la fonction, puis exécutez le fichier. Si tout fonctionne, vous ne verrez que le message que vous avez affiché.'
          ],
          check: 'Le terminal affiche : All tests passed! Si vous voyez AssertionError, un test a détecté un vrai problème : c’est justement le but des tests.',
          aiPrompt: 'Propose 4 autres cas limites à tester pour is_palindrome, par exemple la ponctuation, et explique l’intérêt de chacun.'
        },
        'find-bugs': {
          title: 'Demander à l’assistant de trouver des bugs',
          explanation: [
            'La ponctuation est une bonne piste pour chercher un bug. Essayez l’assert ci-dessous. S’il échoue, votre fonction n’ignore pas encore les virgules et les points.',
            'Au lieu de demander à l’assistant de corriger directement le problème, demandez-lui d’abord de l’expliquer. Appliquez ensuite la correction vous-même et relancez vos tests.'
          ],
          check: 'Vous comprenez pourquoi le test a échoué (ou réussi) et, après la correction, tous les tests réussissent de nouveau.',
          aiPrompt: 'Cet assert échoue avec ma fonction is_palindrome. Explique d’abord pourquoi en termes simples, puis montre le plus petit changement qui la corrige.'
        },
        'refactor': {
          title: 'Refactoriser avec des noms clairs et de petites fonctions',
          explanation: [
            'Refactoriser consiste à rendre le code plus lisible sans modifier son fonctionnement. Des noms clairs et de petites fonctions rendent le code plus facile à comprendre et à modifier en toute confiance.',
            'Demandez à l’assistant une version plus claire, puis comparez-la à la vôtre. Relancez vos tests. S’ils réussissent toujours, le comportement n’a pas changé.'
          ],
          code: 'Refactorise ma fonction is_palindrome pour rendre les noms plus clairs et ajouter une petite fonction auxiliaire. Ne change pas le comportement. Explique chaque changement en une phrase.',
          check: 'Après la refactorisation, vos tests affichent toujours All tests passed! et vous pouvez expliquer ce qui a été renommé ou déplacé.',
          aiPrompt: 'Qu’est-ce qui rend un nom de variable clair ? Donne-moi 3 bons et mauvais exemples tirés de mon code.'
        },
        'commit-reflect': {
          title: 'Créer un commit Git et noter vos apprentissages',
          explanation: [
            'Enregistrez votre travail avec un message de commit clair, puis notez ce que vous avez appris. Ces notes transforment une séance d’entraînement en compétences durables.',
            'Exécutez ces commandes dans le terminal de VS Code. Écrivez ensuite trois lignes : ce que l’IA a bien fait, ce qu’elle a mal fait et ce que vous demanderiez différemment la prochaine fois.'
          ],
          check: 'git log affiche votre commit et vous avez écrit trois lignes de notes sur votre travail avec l’assistant.',
          aiPrompt: 'Aide-moi à rédiger un bon message de commit pour ces changements et explique pourquoi un message clair est important.'
        }
      }
    },
    de: {
      title: 'Mit einem KI-Assistenten programmieren',
      intro: 'Lerne, mit Copilot oder Codex zusammenzuarbeiten, ohne die Kontrolle abzugeben. Mit KI-Hilfe schreibst du eine kleine Python-Funktion und liest, testest, debugst und verbesserst sie anschließend. Wenn Python für dich neu ist, beginne zuerst mit dem Python-Tutorial.',
      steps: {
        'pick-assistant': {
          title: 'Einen Assistenten auswählen und einrichten',
          explanation: [
            'Ein KI-Programmierassistent hilft dir, indem er Code vorschlägt und erklärt. GitHub Copilot (funktioniert direkt in VS Code) und OpenAI Codex sind zwei gute Optionen. Wähle eine davon; beide brauchst du nicht.',
            'Öffne in VS Code den Bereich Extensions, suche nach GitHub Copilot, installiere es und melde dich mit deinem GitHub-Konto an. Erstelle dann einen Ordner namens ai-practice und füge eine Datei namens palindrome.py hinzu. Dein Projekt ist bereit.'
          ],
          check: 'Du kannst den Chat des Assistenten in VS Code öffnen, ihm eine Nachricht wie „Hallo“ schicken und eine Antwort erhalten.',
          aiPrompt: 'Ich bin Programmieranfänger und nutze VS Code. Wobei kannst du mir helfen, und was sollte ich immer selbst überprüfen?'
        },
        'clear-prompt': {
          title: 'Eine kleine Aufgabe mit einem klaren Prompt beschreiben',
          explanation: [
            'Je besser dein Prompt, desto hilfreicher die Antwort. Ein klarer Prompt sagt, was du möchtest, welche Sprache verwendet werden soll und welche Regeln gelten. Bitte immer nur um eine kleine Sache auf einmal.',
            'Vergleiche einen unklaren Prompt – „mach einen Wortprüfer“ – mit einem klaren. Der klare Prompt nennt die Funktion, die Eingabe und die erwartete Ausgabe. Sende den Prompt unten an deinen Assistenten.'
          ],
          code: 'Schreibe eine Python-Funktion is_palindrome(text), die True zurückgibt, wenn sich der Text vorwärts und rückwärts gleich liest; ignoriere dabei Leerzeichen und Großbuchstaben. Füge 3 Beispielaufrufe mit print() hinzu. Halte es für Anfänger einfach.',
          check: 'Der Assistent liefert eine kurze Funktion und drei Beispielaufrufe. Füge den Code in palindrome.py ein.',
          aiPrompt: 'Hilf mir, diesen Prompt klarer zu formulieren. Stelle mir Fragen, falls noch etwas fehlt.'
        },
        'understand-code': {
          title: 'Den generierten Code lesen und verstehen',
          explanation: [
            'Führe niemals Code aus, den du nicht verstehst. KI kann sich sehr überzeugend irren, und du bist für den veröffentlichten Code verantwortlich.',
            'Lies den Code von oben nach unten. Frage den Assistenten zu jeder Zeile, die du nicht erklären kannst. Dein Ziel ist, die ganze Funktion mit eigenen Worten beschreiben zu können.'
          ],
          code: 'Erkläre diese Funktion für Anfänger Zeile für Zeile. Stelle mir danach 2 Fragen, um mein Verständnis zu prüfen. Ändere den Code nicht.',
          check: 'Du kannst ohne nachzusehen erklären, was jede Zeile macht und warum Leerzeichen und Großbuchstaben zuerst entfernt werden.',
          aiPrompt: 'Prüfe mein Verständnis dieses Codes mit 3 kurzen Fragen und sage mir, ob meine Antworten richtig sind.'
        },
        'run-test': {
          title: 'Das Programm ausführen und einen einfachen Test schreiben',
          explanation: [
            'Ein Test prüft, ob dein Code wie erwartet funktioniert. Eine assert-Anweisung macht nichts, wenn die Bedingung wahr ist, und stoppt das Programm mit einem Fehler, wenn sie falsch ist.',
            'Füge diese Zeilen unter der Funktion am Ende von palindrome.py ein und führe die Datei aus. Wenn alles stimmt, siehst du nur deine eigene ausgegebene Nachricht.'
          ],
          check: 'Das Terminal zeigt: All tests passed! Wenn du AssertionError siehst, hat ein Test ein echtes Problem gefunden – genau darum geht es beim Testen.',
          aiPrompt: 'Schlage 4 weitere Grenzfälle für is_palindrome vor, zum Beispiel Satzzeichen, und erkläre, warum jeder wichtig ist.'
        },
        'find-bugs': {
          title: 'Den Assistenten nach Fehlern suchen lassen',
          explanation: [
            'Satzzeichen sind eine gute Stelle, um nach einem Fehler zu suchen. Probiere das assert unten aus. Wenn es fehlschlägt, ignoriert deine Funktion Kommas und Punkte noch nicht.',
            'Bitte den Assistenten nicht einfach um eine Korrektur, sondern zuerst um eine Erklärung des Fehlers. Setze die Korrektur dann selbst um und führe deine Tests erneut aus.'
          ],
          check: 'Du verstehst, warum der Test fehlgeschlagen ist (oder bestanden wurde), und nach der Korrektur bestehen alle Tests wieder.',
          aiPrompt: 'Dieses assert schlägt mit meiner Funktion is_palindrome fehl. Erkläre zuerst in einfachen Worten warum und zeige dann die kleinste Änderung, die es behebt.'
        },
        'refactor': {
          title: 'Mit klaren Namen und kleinen Funktionen refaktorieren',
          explanation: [
            'Beim Refactoring wird Code leichter lesbar, ohne seine Funktion zu verändern. Klare Namen und kleine Funktionen machen Code verständlicher und sicherer änderbar.',
            'Bitte den Assistenten um eine übersichtlichere Version und vergleiche sie mit deiner. Führe deine Tests erneut aus. Wenn sie weiterhin bestehen, hat sich das Verhalten nicht geändert.'
          ],
          code: 'Refaktorisiere meine Funktion is_palindrome mit klareren Namen und einer kleinen Hilfsfunktion. Ändere das Verhalten nicht. Erkläre jede Änderung in einem Satz.',
          check: 'Nach dem Refactoring zeigen deine Tests weiterhin All tests passed! und du kannst erklären, was umbenannt oder verschoben wurde.',
          aiPrompt: 'Was macht einen Variablennamen klar? Nenne mir 3 gute und schlechte Beispiele aus meinem Code.'
        },
        'commit-reflect': {
          title: 'Mit Git committen und festhalten, was du gelernt hast',
          explanation: [
            'Speichere deine Arbeit mit einer aussagekräftigen Commit-Nachricht und notiere anschließend, was du gelernt hast. Notizen machen aus einer Übung dauerhafte Fähigkeiten.',
            'Führe diese Befehle im VS-Code-Terminal aus. Schreibe danach drei Zeilen auf: was die KI richtig gemacht hat, was sie falsch gemacht hat und was du beim nächsten Mal anders fragen würdest.'
          ],
          check: 'git log zeigt deinen Commit und du hast drei Zeilen darüber geschrieben, was du bei der Arbeit mit dem Assistenten gelernt hast.',
          aiPrompt: 'Hilf mir, eine gute Commit-Nachricht für diese Änderungen zu schreiben, und erkläre, warum eine klare Nachricht wichtig ist.'
        }
      }
    },
    es: {
      title: 'Programa con un asistente de IA',
      intro: 'Aprende a trabajar con Copilot o Codex sin perder el control. Con ayuda de la IA, escribirás una pequeña función de Python y luego la leerás, probarás, depurarás y mejorarás. Si Python es nuevo para ti, empieza primero con el tutorial de Python.',
      steps: {
        'pick-assistant': {
          title: 'Elige y configura un asistente',
          explanation: [
            'Un asistente de programación con IA te ayuda sugiriendo y explicando código. GitHub Copilot (funciona dentro de VS Code) y OpenAI Codex son dos buenas opciones. Elige una; no necesitas las dos.',
            'En VS Code, abre el panel Extensions, busca GitHub Copilot, instálalo e inicia sesión con tu cuenta de GitHub. Después crea una carpeta llamada ai-practice y añade un archivo llamado palindrome.py. Tu proyecto ya está listo.'
          ],
          check: 'Puedes abrir el chat del asistente en VS Code, enviarle un mensaje como «hola» y recibir una respuesta.',
          aiPrompt: 'Estoy empezando y uso VS Code. ¿En qué puedes ayudarme y qué debería comprobar siempre por mi cuenta?'
        },
        'clear-prompt': {
          title: 'Describe una tarea pequeña con un prompt claro',
          explanation: [
            'Cuanto mejor sea tu prompt, más útil será la ayuda. Un prompt claro dice qué quieres, qué lenguaje usar y qué reglas seguir. Pide una sola cosa pequeña cada vez.',
            'Compara un prompt vago, «haz un comprobador de palabras», con uno claro. El claro indica la función, la entrada y el resultado esperado. Envía el prompt de abajo a tu asistente.'
          ],
          code: 'Escribe una función de Python is_palindrome(text) que devuelva True si el texto se lee igual hacia delante y hacia atrás, ignorando los espacios y las mayúsculas. Añade 3 ejemplos de llamada con print(). Que sea sencilla para alguien que está empezando.',
          check: 'El asistente te da una función breve y tres ejemplos de llamada. Pega el código en palindrome.py.',
          aiPrompt: 'Ayúdame a mejorar este prompt para que sea más claro. Hazme preguntas si falta algo.'
        },
        'understand-code': {
          title: 'Lee y entiende el código generado',
          explanation: [
            'Nunca ejecutes código que no entiendas. La IA puede equivocarse con mucha seguridad, y tú eres responsable del código que publiques.',
            'Lee el código de arriba abajo. Pregunta al asistente por cada línea que no puedas explicar. Tu objetivo es poder describir toda la función con tus propias palabras.'
          ],
          code: 'Explica esta función línea por línea para alguien que está empezando. Luego hazme 2 preguntas para comprobar lo que he entendido. No cambies el código.',
          check: 'Sin mirar el código, puedes explicar qué hace cada línea y por qué primero se eliminan los espacios y las mayúsculas.',
          aiPrompt: 'Hazme un cuestionario sobre este código con 3 preguntas breves y dime si mis respuestas son correctas.'
        },
        'run-test': {
          title: 'Ejecuta el programa y escribe una prueba sencilla',
          explanation: [
            'Una prueba comprueba que tu código hace lo que esperas. Una instrucción assert no hace nada cuando la condición es verdadera y detiene el programa con un error cuando es falsa.',
            'Añade estas líneas al final de palindrome.py, debajo de la función, y ejecuta el archivo. Si todo está bien, solo verás el mensaje que has imprimido.'
          ],
          check: 'El terminal muestra: All tests passed! Si ves AssertionError, una prueba ha encontrado un problema real; ese es precisamente el objetivo de probar.',
          aiPrompt: 'Sugiere 4 casos límite más para probar is_palindrome, como la puntuación, y explica por qué importa cada uno.'
        },
        'find-bugs': {
          title: 'Pide al asistente que busque errores',
          explanation: [
            'La puntuación es un buen aspecto para buscar errores. Prueba el assert de abajo. Si falla, tu función todavía no ignora las comas y los puntos.',
            'En lugar de pedir al asistente que lo arregle sin más, pídele primero que explique el error. Después aplica tú la corrección y vuelve a ejecutar las pruebas.'
          ],
          check: 'Entiendes por qué la prueba falló (o pasó) y, después de corregirlo, todas las pruebas vuelven a pasar.',
          aiPrompt: 'Este assert falla con mi función is_palindrome. Primero explica por qué con palabras sencillas y luego muestra el cambio más pequeño para corregirlo.'
        },
        'refactor': {
          title: 'Refactoriza con nombres claros y funciones pequeñas',
          explanation: [
            'Refactorizar significa mejorar la legibilidad del código sin cambiar lo que hace. Los nombres claros y las funciones pequeñas hacen que sea más fácil confiar en el código y modificarlo.',
            'Pide al asistente una versión más clara y compárala con la tuya. Vuelve a ejecutar las pruebas. Si siguen pasando, el comportamiento no ha cambiado.'
          ],
          code: 'Refactoriza mi función is_palindrome para que tenga nombres más claros y una pequeña función auxiliar. No cambies su comportamiento. Explica cada cambio en una frase.',
          check: 'Después de refactorizar, tus pruebas siguen mostrando All tests passed! y puedes explicar qué se renombró o se movió.',
          aiPrompt: '¿Qué hace que el nombre de una variable sea claro? Dame 3 ejemplos buenos y malos de mi código.'
        },
        'commit-reflect': {
          title: 'Haz un commit con Git y anota lo que aprendiste',
          explanation: [
            'Guarda tu trabajo con un mensaje de commit claro y luego apunta lo que has aprendido. Las notas convierten una sesión de práctica en una habilidad duradera.',
            'Ejecuta estos comandos en el terminal de VS Code. Después escribe tres líneas: qué hizo bien la IA, qué hizo mal y qué preguntarías de otra manera la próxima vez.'
          ],
          check: 'git log muestra tu commit y has escrito tres líneas sobre lo que aprendiste al trabajar con el asistente.',
          aiPrompt: 'Ayúdame a escribir un buen mensaje de commit para estos cambios y explícame por qué importa que sea claro.'
        }
      }
    }
  }
};
