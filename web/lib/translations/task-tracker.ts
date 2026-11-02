import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const taskTrackerTranslations: Record<string, Partial<Record<'fr' | 'de' | 'es', TutorialTranslation>>> = {
  'first-app': {
    fr: {
      title: 'Codez votre propre gestionnaire de tâches',
      intro: 'Créez vous-même l’application du laboratoire pratique, une petite étape à la fois. Vous avez besoin d’un compte Replit gratuit et d’un navigateur web. Aucune installation ni expérience n’est nécessaire.',
      steps: {
        'create-project': {
          title: 'Créez votre projet',
          explanation: [
            'Vous allez créer cette application avec trois fichiers : un pour la page (HTML), un pour son apparence (CSS) et un pour son comportement (JavaScript). Replit les exécute dans votre navigateur, donc rien n’est à installer.',
            'Créez un compte gratuit sur replit.com, démarrez un nouveau projet et choisissez le modèle HTML, CSS, JS. Vous devriez voir trois fichiers nommés index.html, style.css et script.js.'
          ],
          check: 'Vous voyez index.html, style.css et script.js dans la liste des fichiers, ainsi qu’un panneau d’aperçu.',
          aiPrompt: 'Je débute. Explique ce que font HTML, CSS et JavaScript dans une page web, en prenant une liste de tâches comme exemple. Fais court.'
        },
        'page-structure': {
          title: 'Ajoutez la structure de la page',
          explanation: [
            'HTML décrit les éléments de la page. Cette page contient un titre, un formulaire avec une zone de texte et un bouton, ainsi qu’une liste vide où les tâches apparaîtront.',
            'Les identifiants (comme `task-input`) sont des étiquettes. Plus tard, votre JavaScript les utilisera pour retrouver ces éléments.'
          ],
          check: 'L’aperçu affiche un titre, une zone de texte et un bouton Add task. Rien ne se passe encore quand vous cliquez dessus, et c’est normal.',
          aiPrompt: 'Explique ce fichier index.html ligne par ligne comme si je débutais. Ne le modifie pas.'
        },
        'style': {
          title: 'Donnez-lui une belle apparence',
          explanation: [
            'CSS gère les couleurs, l’espacement et la mise en page. Chaque bloc commence par un sélecteur, comme main ou li, qui indique quels éléments mettre en forme, puis contient les règles entre accolades.',
            'La règle .done n’est pas encore utilisée. À une prochaine étape, les tâches terminées recevront cette classe pour apparaître barrées.'
          ],
          check: 'La page a maintenant un fond clair et une carte blanche centrée.',
          aiPrompt: 'Explique ce que font les règles "main" et "li" dans ce CSS. Puis propose un petit changement à essayer, comme une nouvelle couleur.'
        },
        'add-tasks': {
          title: 'Ajoutez des tâches',
          explanation: [
            'L’application commence maintenant à réfléchir. La variable tasks contient vos données : une liste de tâches. La fonction render redessine la liste à l’écran à partir de ces données.',
            'Quand vous envoyez le formulaire, le code lit la zone de texte, ignore les textes vides, ajoute une tâche à la liste et appelle render. Remarquez qu’il utilise textContent, et non innerHTML, pour afficher votre texte. Ainsi, les caractères inattendus ne sont pas interprétés comme du code.'
          ],
          check: 'Saisissez une tâche et cliquez sur Add task. Elle apparaît dans la liste et la zone de texte s’efface. Si vous envoyez une zone vide, rien ne se passe.',
          aiPrompt: 'Explique comment la fonction render et le gestionnaire d’envoi fonctionnent ensemble dans ce script.js. Utilise une analogie simple.'
        },
        'complete-remove': {
          title: 'Terminez et supprimez des tâches',
          explanation: [
            'Chaque tâche a maintenant une case à cocher et un bouton Remove. La case modifie la valeur done de la tâche. Remove conserve toutes les tâches sauf celle sur laquelle vous avez cliqué.',
            'Ce code remplace tout le contenu de script.js. La seule nouvelle partie se trouve dans render, où la case à cocher et le bouton de suppression sont créés.'
          ],
          check: 'Cochez une tâche : elle est barrée. Décochez-la : elle redevient normale. Remove supprime uniquement cette tâche.',
          aiPrompt: 'Explique comment le bouton Remove supprime une seule tâche, en utilisant la fonction filter de ce code.'
        },
        'save-tasks': {
          title: 'Enregistrez vos tâches',
          explanation: [
            'Pour le moment, vos tâches disparaissent quand vous rechargez la page. Le navigateur dispose d’un petit espace de stockage appelé localStorage, qui peut conserver du texte entre vos visites.',
            'La fonction save transforme votre liste de tâches en texte (JSON) et l’enregistre. Au démarrage, le code la récupère. L’appel final à render() en bas affiche les tâches enregistrées.'
          ],
          check: 'Ajoutez deux tâches, cochez-en une, puis rechargez l’aperçu. Les deux tâches sont toujours là et la case cochée est mémorisée.',
          aiPrompt: 'Explique ce que font JSON.stringify et JSON.parse dans ce code, et pourquoi nous avons besoin des deux.'
        },
        'test-improve': {
          title: 'Testez et préparez la version 2',
          explanation: [
            'Les bons créateurs essaient de mettre leurs applications à l’épreuve. Testez ces cas : une tâche vide, uniquement des espaces, une tâche très longue, de nombreuses tâches et une tâche contenant des symboles comme < ou &.',
            'Choisissez ensuite une petite amélioration pour la version 2, par exemple un compteur de tâches, un filtre pour les tâches terminées ou une date d’échéance. Créez-la seule d’abord. N’ajoutez l’idée suivante qu’une fois qu’elle fonctionne.'
          ],
          check: 'Vous avez essayé tous les cas ci-dessus, corrigé les problèmes et noté une amélioration pour la version 2.',
          aiPrompt: 'Voici mon script.js. Propose 5 cas de test qui pourraient le mettre en difficulté, puis aide-moi à ajouter un compteur indiquant combien de tâches restent à faire. Explique chaque changement.'
        }
      }
    },
    de: {
      title: 'Programmiere deinen eigenen Aufgaben-Tracker',
      intro: 'Baue die App aus dem Praxis-Lab selbst nach, Schritt für Schritt. Du brauchst ein kostenloses Replit-Konto und einen Webbrowser. Installationen oder Vorkenntnisse sind nicht nötig.',
      steps: {
        'create-project': {
          title: 'Erstelle dein Projekt',
          explanation: [
            'Du baust diese App mit drei Dateien: eine für die Seite (HTML), eine für das Aussehen (CSS) und eine für das Verhalten (JavaScript). Replit führt sie in deinem Browser aus, du musst also nichts installieren.',
            'Erstelle ein kostenloses Konto auf replit.com, starte ein neues Projekt und wähle die Vorlage HTML, CSS, JS. Du solltest drei Dateien namens index.html, style.css und script.js sehen.'
          ],
          check: 'In der Dateiliste siehst du index.html, style.css und script.js sowie ein Vorschaufenster.',
          aiPrompt: 'Ich bin Anfänger. Erkläre anhand einer Aufgabenliste, was HTML, CSS und JavaScript jeweils auf einer Webseite tun. Halte dich kurz.'
        },
        'page-structure': {
          title: 'Füge die Seitenstruktur hinzu',
          explanation: [
            'HTML beschreibt, was auf der Seite zu sehen ist. Diese Seite hat eine Überschrift, ein Formular mit einem Textfeld und einer Schaltfläche sowie eine leere Liste, in der die Aufgaben erscheinen.',
            'Die IDs (wie `task-input`) sind Namensschilder. Später verwendet dein JavaScript sie, um diese Elemente zu finden.'
          ],
          check: 'In der Vorschau siehst du eine Überschrift, ein Textfeld und eine Add task-Schaltfläche. Wenn du darauf klickst, passiert noch nichts – das ist so vorgesehen.',
          aiPrompt: 'Erkläre diese index.html Zeile für Zeile, als wäre ich Anfänger. Ändere sie nicht.'
        },
        'style': {
          title: 'Lass es gut aussehen',
          explanation: [
            'CSS steuert Farben, Abstände und Layout. Jeder Block beginnt mit einem Selektor, zum Beispiel main oder li. Er gibt an, welche Elemente gestaltet werden; die Regeln stehen in geschweiften Klammern.',
            'Die .done-Regel wird noch nicht verwendet. In einem späteren Schritt bekommen erledigte Aufgaben diese Klasse und werden durchgestrichen angezeigt.'
          ],
          check: 'Die Seite hat jetzt einen hellen Hintergrund und eine mittig platzierte weiße Karte.',
          aiPrompt: 'Erkläre, was die Regeln "main" und "li" in diesem CSS machen. Schlage dann eine kleine Änderung vor, die ich ausprobieren kann, zum Beispiel eine neue Farbe.'
        },
        'add-tasks': {
          title: 'Füge Aufgaben hinzu',
          explanation: [
            'Jetzt beginnt die App zu denken. Die Variable tasks enthält deine Daten: eine Aufgabenliste. Die Funktion render zeichnet die Liste anhand dieser Daten auf dem Bildschirm neu.',
            'Wenn du das Formular absendest, liest der Code das Textfeld aus, ignoriert leere Eingaben, fügt der Liste eine neue Aufgabe hinzu und ruft render auf. Beachte, dass zum Anzeigen deines Textes textContent statt innerHTML verwendet wird. So werden unerwartete Zeichen nicht als Code behandelt.'
          ],
          check: 'Gib eine Aufgabe ein und klicke auf Add task. Sie erscheint in der Liste und das Textfeld wird geleert. Ein leeres Feld abzusenden, bewirkt nichts.',
          aiPrompt: 'Erkläre anhand einer einfachen Analogie, wie die Funktion render und der Submit-Handler in diesem script.js zusammenarbeiten.'
        },
        'complete-remove': {
          title: 'Erledige und entferne Aufgaben',
          explanation: [
            'Jede Aufgabe hat jetzt ein Kontrollkästchen und eine Remove-Schaltfläche. Das Kontrollkästchen ändert den Wert done der Aufgabe. Remove behält alle Aufgaben außer der angeklickten.',
            'Dieser Code ersetzt den gesamten Inhalt von script.js. Der einzige neue Teil ist in render, wo das Kontrollkästchen und die Entfernen-Schaltfläche erstellt werden.'
          ],
          check: 'Hake eine Aufgabe ab und sie wird durchgestrichen. Entferne das Häkchen und sie sieht wieder normal aus. Remove löscht nur diese Aufgabe.',
          aiPrompt: 'Erkläre, wie die Remove-Schaltfläche mithilfe der filter-Funktion in diesem Code nur eine Aufgabe löscht.'
        },
        'save-tasks': {
          title: 'Speichere deine Aufgaben',
          explanation: [
            'Im Moment verschwinden deine Aufgaben, wenn du die Seite neu lädst. Der Browser hat einen kleinen Speicherbereich namens localStorage, der Text zwischen deinen Besuchen aufbewahren kann.',
            'Die Funktion save wandelt deine Aufgabenliste in Text (JSON) um und speichert sie. Beim Start liest der Code sie wieder ein. Der abschließende Aufruf render() unten zeigt gespeicherte Aufgaben an.'
          ],
          check: 'Füge zwei Aufgaben hinzu, hake eine ab und lade dann die Vorschau neu. Beide Aufgaben sind noch da und das Häkchen ist gespeichert.',
          aiPrompt: 'Erkläre, was JSON.stringify und JSON.parse in diesem Code tun und warum wir beide brauchen.'
        },
        'test-improve': {
          title: 'Teste die App und plane Version 2',
          explanation: [
            'Gute Entwickler versuchen, ihre eigenen Apps an ihre Grenzen zu bringen. Teste diese Fälle: eine leere Aufgabe, nur Leerzeichen, eine sehr lange Aufgabe, viele Aufgaben und eine Aufgabe mit Zeichen wie < oder &.',
            'Wähle dann eine kleine Verbesserung für Version 2, zum Beispiel einen Aufgabenzähler, einen Filter für erledigte Aufgaben oder ein Fälligkeitsdatum. Baue zuerst nur diese Funktion ein. Füge die nächste Idee erst hinzu, wenn sie funktioniert.'
          ],
          check: 'Du hast alle Fälle oben ausprobiert, Fehler behoben und eine Verbesserung für Version 2 notiert.',
          aiPrompt: 'Hier ist mein script.js. Schlage 5 Testfälle vor, die Probleme verursachen könnten, und hilf mir dann, einen Zähler für die noch offenen Aufgaben hinzuzufügen. Erkläre jede Änderung.'
        }
      }
    },
    es: {
      title: 'Programa tu propio gestor de tareas',
      intro: 'Crea por tu cuenta la aplicación del laboratorio práctico, paso a paso. Necesitas una cuenta gratuita de Replit y un navegador web. No hace falta instalar nada ni tener experiencia.',
      steps: {
        'create-project': {
          title: 'Crea tu proyecto',
          explanation: [
            'Crearás esta aplicación con tres archivos: uno para la página (HTML), otro para su aspecto (CSS) y otro para su comportamiento (JavaScript). Replit los ejecuta en tu navegador, así que no tienes que instalar nada.',
            'Crea una cuenta gratuita en replit.com, inicia un proyecto nuevo y elige la plantilla HTML, CSS, JS. Deberías ver tres archivos llamados index.html, style.css y script.js.'
          ],
          check: 'Puedes ver index.html, style.css y script.js en la lista de archivos, además de un panel de vista previa.',
          aiPrompt: 'Soy principiante. Explícame qué hace HTML, CSS y JavaScript en una página web, usando una lista de tareas como ejemplo. Sé breve.'
        },
        'page-structure': {
          title: 'Añade la estructura de la página',
          explanation: [
            'HTML describe lo que hay en la página. Esta página tiene un encabezado, un formulario con un cuadro de texto y un botón, y una lista vacía donde aparecerán las tareas.',
            'Los identificadores (como `task-input`) son etiquetas con nombres. Más adelante, tu JavaScript los usará para encontrar estos elementos.'
          ],
          check: 'La vista previa muestra un encabezado, un cuadro de texto y un botón Add task. Al hacer clic todavía no pasa nada, y eso es lo esperado.',
          aiPrompt: 'Explícame este index.html línea por línea como si fuera principiante. No lo cambies.'
        },
        'style': {
          title: 'Dale un buen aspecto',
          explanation: [
            'CSS controla los colores, el espaciado y la disposición. Cada bloque empieza con un selector, como main o li, que indica qué elementos se van a diseñar, y después incluye las reglas entre llaves.',
            'La regla .done todavía no se usa. En un paso posterior, las tareas completadas recibirán esa clase para que aparezcan tachadas.'
          ],
          check: 'La página ahora tiene un fondo claro y una tarjeta blanca centrada.',
          aiPrompt: 'Explícame qué hacen las reglas "main" y "li" de este CSS. Después sugiere un pequeño cambio que pueda probar, como un color nuevo.'
        },
        'add-tasks': {
          title: 'Añade tareas',
          explanation: [
            'Ahora la aplicación empieza a pensar. La variable tasks contiene tus datos: una lista de tareas. La función render vuelve a dibujar la lista en pantalla a partir de esos datos.',
            'Cuando envías el formulario, el código lee el cuadro de texto, ignora el texto vacío, añade una tarea nueva a la lista y llama a render. Fíjate en que usa textContent, no innerHTML, para mostrar tu texto. Así, los caracteres inesperados no se interpretan como código.'
          ],
          check: 'Escribe una tarea y pulsa Add task. Aparece en la lista y se vacía el cuadro de texto. Si envías el cuadro vacío, no pasa nada.',
          aiPrompt: 'Explícame con una analogía sencilla cómo trabajan juntas la función render y la función que gestiona el envío en este script.js.'
        },
        'complete-remove': {
          title: 'Completa y elimina tareas',
          explanation: [
            'Ahora cada tarea tiene una casilla y un botón Remove. La casilla cambia el valor done de la tarea. Remove conserva todas las tareas excepto la que has seleccionado.',
            'Este código reemplaza todo el contenido de script.js. La única parte nueva está dentro de render, donde se crean la casilla y el botón para eliminar.'
          ],
          check: 'Marca una tarea y aparecerá tachada. Desmárcala y volverá a la normalidad. Remove elimina solo esa tarea.',
          aiPrompt: 'Explícame cómo el botón Remove elimina solo una tarea usando la función filter de este código.'
        },
        'save-tasks': {
          title: 'Guarda tus tareas',
          explanation: [
            'Ahora mismo, tus tareas desaparecen al recargar la página. El navegador tiene un pequeño espacio de almacenamiento llamado localStorage que puede conservar texto entre visitas.',
            'La función save convierte tu lista de tareas en texto (JSON) y la guarda. Al iniciar, el código la recupera. La llamada final a render() de abajo muestra las tareas guardadas.'
          ],
          check: 'Añade dos tareas, marca una y recarga la vista previa. Las dos tareas siguen ahí y se recuerda la que marcaste.',
          aiPrompt: 'Explícame qué hacen JSON.stringify y JSON.parse en este código y por qué necesitamos ambos.'
        },
        'test-improve': {
          title: 'Prueba la aplicación y planifica la versión 2',
          explanation: [
            'Quienes crean buenas aplicaciones intentan ponerlas a prueba. Prueba estos casos: una tarea vacía, solo espacios, una tarea muy larga, muchas tareas y una tarea con símbolos como < o &.',
            'Después, elige una pequeña mejora para la versión 2, como un contador de tareas, un filtro para las tareas terminadas o una fecha de vencimiento. Primero, crea solo esa mejora. Añade la siguiente idea cuando ya funcione.'
          ],
          check: 'Has probado todos los casos anteriores, corregido lo que fallaba y apuntado una mejora para la versión 2.',
          aiPrompt: 'Aquí está mi script.js. Sugiere 5 casos de prueba que podrían dar problemas y luego ayúdame a añadir un contador que muestre cuántas tareas quedan. Explícame cada cambio.'
        }
      }
    }
  }
};
