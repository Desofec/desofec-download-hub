import type { LanguageCode } from '@/lib/i18n';
import { codingTranslations } from '@/lib/translations/coding';
import { mlDesignTranslations } from '@/lib/translations/ml-design';
import { taskTrackerTranslations } from '@/lib/translations/task-tracker';
import { webNocodeTranslations } from '@/lib/translations/web-nocode';
import { practicalFrench } from '@/lib/translations/practical-fr';
import { practicalGerman } from '@/lib/translations/practical-de';
import { practicalSpanish } from '@/lib/translations/practical-es';
import { contentServicesTranslations } from '@/lib/translations/content-services';
import { automationServicesTranslations } from '@/lib/translations/automation-services';
import { commerceServicesTranslations } from '@/lib/translations/commerce-services';
import { cadServicesTranslations } from '@/lib/translations/cad-services';
import { microSaasTranslations } from '@/lib/translations/micro-saas';
import { educationServicesTranslations } from '@/lib/translations/education-services';
import { videoBusinessTranslations } from '@/lib/translations/video-business';
import { contentCreationTranslations } from '@/lib/translations/content-creation';
import { privacyFactCheckingTranslations } from '@/lib/translations/privacy-fact-checking';
import { multilingualWorkTranslations } from '@/lib/translations/multilingual-work';
import { meetingNotesTranslations } from '@/lib/translations/meeting-notes';
import { workflowsAgentsTranslations } from '@/lib/translations/workflows-agents';
import { searchVisibilityResources } from '@/lib/search-visibility-tutorial';

const { googleProperty, googleSitemap, googleRecrawl, bingGettingStarted } = searchVisibilityResources;

export type StepTranslation = {
  title: string;
  explanation: string[];
  file?: string;
  code?: string;
  check: string;
  aiPrompt: string;
  resources?: { label: string; url: string }[];
};

export type TutorialTranslation = {
  title: string;
  intro: string;
  steps: Record<string, StepTranslation>;
};

// Keyed by tutorial id (the learning path id), then language. English lives in the tutorial source files.
const baseTranslations: Record<string, Partial<Record<Exclude<LanguageCode, 'en'>, TutorialTranslation>>> = {
  'search-visibility': {
    fr: {
      title: 'Configurer Google Search et Bing Webmaster Tools',
      intro: 'Choisissez une adresse canonique, vérifiez ou envoyez votre sitemap et consultez l’indexation dans Google Search Console et Bing Webmaster Tools. Microsoft Edge est un navigateur, pas le service webmaster de Bing.',
      steps: {
        'choose-canonical-origin': {
          title: 'Choisir une seule adresse publique',
          explanation: ['Choisissez un seul nom d’hôte HTTPS canonique, par exemple https://www.example.com. Vérifiez les versions avec et sans www pour l’accueil et une page interne. L’autre nom d’hôte doit rediriger dans un seul sens vers l’adresse canonique en conservant le chemin de la page.', 'Utilisez le même hôte canonique dans les métadonnées, le sitemap et les URL envoyées aux outils de recherche. Pour cette application, l’origine canonique configurée est https://www.desofec.com. Ne modifiez le DNS ou l’hébergement que si vous les contrôlez.'],
          check: 'Vous avez choisi un hôte HTTPS, vérifié l’autre version et constaté le même hôte dans le canonical et le sitemap.',
          aiPrompt: 'Aide-moi à vérifier un nom d’hôte canonique. Demande-moi de comparer les versions avec et sans www et la balise canonical. Ne demande aucun mot de passe, jeton de vérification ou accès DNS.',
          resources: [{ label: 'Ajouter une propriété dans Search Console', url: googleProperty.url }]
        },
        'verify-google-property': {
          title: 'Vérifier le site dans Google Search Console',
          explanation: ['Connectez-vous à Search Console et ajoutez une propriété Domaine pour le domaine racine, par exemple example.com. Elle couvre les protocoles et sous-domaines. Google fournit un enregistrement DNS TXT ; ajoutez-le chez le fournisseur du domaine uniquement si vous contrôlez le DNS, puis cliquez sur Vérifier. Une propriété de préfixe d’URL est une autre option si vous ne pouvez vérifier que ce préfixe.', 'Si la propriété est déjà vérifiée, continuez à l’utiliser ; ne créez pas de doublons pour www et sans www. Ne partagez jamais de mot de passe ni de jeton.'],
          check: 'Search Console affiche la bonne propriété et votre compte y a accès. Si elle est déjà vérifiée, notez-le et continuez.',
          aiPrompt: 'Explique la vérification d’une propriété Domaine Search Console. Rappelle-moi d’utiliser exactement le TXT fourni par Google et de ne pas copier d’identifiants dans le chat.',
          resources: [{ label: 'Ajouter une propriété dans Search Console', url: googleProperty.url }]
        },
        'submit-google-sitemap': {
          title: 'Vérifier ou envoyer le sitemap canonique à Google',
          explanation: ['Dans la propriété vérifiée, ouvrez Sitemaps. Vérifiez d’abord si l’URL complète du sitemap canonique, par exemple https://www.example.com/sitemap.xml, figure déjà dans la liste. Envoyez-la seulement si elle est absente ; sinon, conservez l’envoi existant et consultez son état.', 'Si le traitement est en attente, patientez plutôt que de renvoyer le même sitemap. Examinez les erreurs signalées et vérifiez que le sitemap contient les pages publiques à découvrir. Un sitemap aide Google à découvrir des URL sans imposer leur indexation.'],
          check: 'Le sitemap envoyé affiche un état de traitement réussi et son URL utilise l’hôte HTTPS canonique.',
          aiPrompt: 'Aide-moi à interpréter l’état du rapport Sitemaps. Demande seulement le texte de l’état, jamais les accès au compte.',
          resources: [{ label: 'Créer et envoyer un sitemap à Google', url: googleSitemap.url }]
        },
        'inspect-google-url': {
          title: 'Tester et inspecter une page dans Google',
          explanation: ['Collez l’URL canonique exacte dans l’inspection Search Console. Vérifiez l’état d’indexation et, si nécessaire, utilisez Tester l’URL publiée. Dans le résultat, confirmez que la récupération a réussi, que l’exploration et l’indexation sont autorisées et que le canonical déclaré correspond à l’URL choisie.', 'Si la page est disponible mais pas indexée, demandez une seule fois son indexation. Google indique que l’exploration peut prendre des jours ou des semaines et que la demande ne garantit pas l’inclusion ; répéter une demande ne l’accélère pas.'],
          check: 'Vous distinguez la disponibilité pour Google de l’indexation actuelle et votre page déclare le canonical attendu.',
          aiPrompt: 'Explique cet état Search Console sans termes techniques : [texte non sensible]. Distingue disponibilité et indexation ; ne promets pas de résultats de recherche.',
          resources: [{ label: 'Demander une nouvelle exploration Google', url: googleRecrawl.url }]
        },
        'set-up-bing-webmaster': {
          title: 'Vérifier le site dans Bing Webmaster Tools',
          explanation: ['Bing Webmaster Tools sert à Bing Search ; Microsoft Edge est un navigateur. Ouvrez Bing Webmaster Tools et connectez-vous. Vérifiez d’abord si le site canonique figure déjà dans la liste. S’il est présent, utilisez cette entrée et ne le vérifiez que si nécessaire. S’il est absent, utilisez l’importation Bing d’une propriété déjà vérifiée dans Search Console si elle est proposée ; sinon ajoutez le site et suivez une méthode de vérification affichée.', 'Vérifiez si le même sitemap canonique, par exemple https://www.example.com/sitemap.xml, figure déjà dans la liste. Envoyez-le seulement s’il est absent ; si le sitemap est en attente, surveillez l’envoi existant au lieu de le répéter. Suivez les instructions Bing actuelles en cas d’erreur et utilisez les outils d’inspection disponibles pour les nouvelles pages importantes.'],
          check: 'Bing Webmaster Tools affiche le site vérifié et le sitemap canonique sans erreur non résolue.',
          aiPrompt: 'Guide-moi dans la checklist officielle de Bing Webmaster Tools, écran par écran. Demande quelles options sont affichées. Ne demande aucun mot de passe ou jeton.',
          resources: [{ label: 'Ouvrir Bing Webmaster Tools', url: searchVisibilityResources.bingPortal.url }, { label: 'Checklist Bing Webmaster Tools', url: bingGettingStarted.url }]
        },
        'monitor-indexing': {
          title: 'Suivre les rapports et corriger la cause indiquée',
          explanation: ['Consultez périodiquement les rapports Pages et Sitemaps de Google et les rapports du site dans Bing. Une URL non indexée peut être normale ; suivez le motif indiqué, comme redirection, exploration bloquée, canonical en double ou découverte en attente. Vérifiez redirections et canonicals avant une nouvelle demande.', 'Rédigez des pages utiles, originales, accessibles et claires pour les personnes. Aucun réglage ne garantit indexation, classement, visites ou citations par une IA.'],
          check: 'Vous avez noté un problème réel ou l’absence de problème, trouvé sa cause et évité les demandes répétées pour une URL inchangée.',
          aiPrompt: 'Aide-moi à comprendre ce problème Search Console ou Bing non sensible. Explique ce qu’il indique et une vérification sûre, sans promettre de classement.',
          resources: [{ label: 'Ouvrir Bing Webmaster Tools', url: searchVisibilityResources.bingPortal.url }, { label: 'Checklist Bing Webmaster Tools', url: bingGettingStarted.url }, { label: 'Demander une nouvelle exploration Google', url: googleRecrawl.url }]
        }
      }
    },
    de: {
      title: 'Google Suche und Bing Webmaster Tools einrichten',
      intro: 'Wähle eine kanonische Website-Adresse, prüfe oder reiche die Sitemap ein und überprüfe die Indexierung in Google Search Console und Bing Webmaster Tools. Microsoft Edge ist ein Browser, nicht Bings Webmaster-Dienst.',
      steps: {
        'choose-canonical-origin': {
          title: 'Eine öffentliche Website-Adresse festlegen',
          explanation: ['Wähle genau einen kanonischen HTTPS-Host, zum Beispiel https://www.example.com. Prüfe www und ohne www für Startseite und Unterseite. Der alternative Host sollte in eine Richtung zur kanonischen Adresse weiterleiten und den Seitenpfad erhalten.', 'Verwende denselben Host in Metadaten, Sitemap und eingereichten URLs. Für diese App ist https://www.desofec.com konfiguriert. Ändere DNS oder Hosting-Weiterleitungen nur, wenn du sie kontrollierst.'],
          check: 'Du hast einen HTTPS-Host gewählt, die Weiterleitung geprüft und denselben Host in Canonical und Sitemap gefunden.',
          aiPrompt: 'Hilf mir, einen kanonischen Website-Host zu prüfen. Bitte mich, www, ohne www und Canonical zu vergleichen. Frage nicht nach Passwörtern, Prüftoken oder DNS-Zugang.',
          resources: [{ label: 'Property in Search Console hinzufügen', url: googleProperty.url }]
        },
        'verify-google-property': {
          title: 'Website in Google Search Console bestätigen',
          explanation: ['Melde dich in der Search Console an und füge eine Domain-Property für die Stammdomain hinzu, zum Beispiel example.com. Sie umfasst Protokolle und Subdomains. Google zeigt einen DNS-TXT-Eintrag an; füge ihn nur bei deinem DNS-Anbieter ein, wenn du den DNS kontrollierst, und wähle dann Bestätigen. Eine URL-Präfix-Property ist eine Alternative für einen einzelnen Präfix.', 'Ist die Property bereits bestätigt, nutze sie weiter und lege keine Duplikate für www und ohne www an. Teile niemals Passwörter oder Prüftoken.'],
          check: 'Die richtige Property wird angezeigt und dein Konto hat Zugriff. Falls sie bereits bestätigt ist, notiere das und fahre fort.',
          aiPrompt: 'Erkläre die Bestätigung einer Search-Console-Domain-Property. Erinnere mich, genau den Google-TXT-Wert zu verwenden und keine Zugangsdaten im Chat zu teilen.',
          resources: [{ label: 'Property in Search Console hinzufügen', url: googleProperty.url }]
        },
        'submit-google-sitemap': {
          title: 'Kanonische Sitemap bei Google prüfen oder einreichen',
          explanation: ['Öffne in der bestätigten Property den Bereich Sitemaps. Prüfe zuerst, ob die vollständige kanonische Sitemap-Adresse, zum Beispiel https://www.example.com/sitemap.xml, bereits aufgeführt ist. Reiche sie nur ein, wenn sie fehlt; andernfalls nutze den vorhandenen Eintrag und prüfe seinen Status.', 'Steht die Verarbeitung noch aus, warte ab, statt dieselbe Sitemap erneut einzureichen. Untersuche gemeldete Fehler und prüfe, ob die Sitemap die gewünschten öffentlichen Seiten enthält. Eine Sitemap hilft Google beim Entdecken, erzwingt aber keine Indexierung.'],
          check: 'Die Sitemap zeigt eine erfolgreiche Verarbeitung und verwendet den kanonischen HTTPS-Host.',
          aiPrompt: 'Hilf mir, den Status im Search-Console-Sitemapbericht zu verstehen. Frage nur nach dem Statustext, nicht nach Kontozugängen.',
          resources: [{ label: 'Sitemap bei Google erstellen und einreichen', url: googleSitemap.url }]
        },
        'inspect-google-url': {
          title: 'Eine wichtige Seite bei Google testen',
          explanation: ['Füge die genaue kanonische Seitenadresse in die Search-Console-Prüfung ein. Prüfe den Indexstatus und bei Bedarf Live-URL testen. Bestätige erfolgreichen Abruf, erlaubtes Crawling und Indexieren sowie das erwartete deklarierte Canonical.', 'Ist die Seite verfügbar, aber nicht indexiert, beantrage die Indexierung einmal. Google zufolge kann Crawling Tage oder Wochen dauern und die Anfrage garantiert keine Aufnahme; Wiederholungen beschleunigen es nicht.'],
          check: 'Du unterscheidest Erreichbarkeit von Indexierung und die Seite nennt das erwartete Canonical.',
          aiPrompt: 'Erkläre diesen Search-Console-Status einfach: [nicht vertraulicher Text]. Unterscheide Live-Erreichbarkeit von Indexierung und verspreche keine Suchergebnisse.',
          resources: [{ label: 'Google erneut crawlen lassen', url: googleRecrawl.url }]
        },
        'set-up-bing-webmaster': {
          title: 'Website in Bing Webmaster Tools prüfen oder bestätigen',
          explanation: ['Bing Webmaster Tools ist der Dienst für Bing Search; Microsoft Edge ist nur ein Browser. Melde dich bei Bing Webmaster Tools an. Prüfe zuerst, ob die kanonische Website bereits aufgeführt ist. Ist sie vorhanden, nutze den bestehenden Eintrag und bestätige sie nur bei Bedarf. Fehlt sie, nutze Bings Importoption für eine bereits in Search Console bestätigte Property, falls angeboten; andernfalls füge die Website hinzu und schließe eine angezeigte Bestätigungsmethode ab.', 'Prüfe, ob dieselbe kanonische Sitemap, zum Beispiel https://www.example.com/sitemap.xml, bereits aufgeführt ist. Reiche sie nur ein, wenn sie fehlt; ist die Sitemap noch in Bearbeitung, beobachte den vorhandenen Eintrag, statt sie erneut einzureichen. Folge bei Fehlern den aktuellen Bing-Hinweisen und nutze die verfügbaren URL-Prüfwerkzeuge für wichtige neue Seiten.'],
          check: 'Bing Webmaster Tools listet die bestätigte Website und die kanonische Sitemap ohne offenen Fehler.',
          aiPrompt: 'Führe mich Schritt für Schritt durch Bings offizielle Webmaster-Checkliste. Frage, welche Optionen ich sehe. Frage nicht nach Passwörtern oder Prüftoken.',
          resources: [{ label: 'Bing Webmaster Tools öffnen', url: searchVisibilityResources.bingPortal.url }, { label: 'Bing Webmaster Tools Checkliste', url: bingGettingStarted.url }]
        },
        'monitor-indexing': {
          title: 'Berichte beobachten und die Ursache beheben',
          explanation: ['Prüfe regelmäßig die Google-Berichte Pages und Sitemaps sowie die Site-Berichte in Bing. Nicht indexierte URLs sind nicht immer ein Problem. Nutze den angezeigten Grund, etwa Weiterleitung, blockiertes Crawling, doppeltes Canonical oder noch nicht entdeckte URL. Prüfe Weiterleitungen und Canonicals vor neuen Anfragen.', 'Veröffentliche nützliche, eigene, zugängliche und verständliche Inhalte. Keine Einstellung garantiert Indexierung, Ranking, Besucher oder KI-Zitate.'],
          check: 'Du hast ein echtes Problem oder keines notiert, die Ursache geprüft und unnötige Wiederholungsanfragen vermieden.',
          aiPrompt: 'Hilf mir, diesen nicht vertraulichen Search-Console- oder Bing-Fehler zu verstehen. Nenne eine sichere Prüfung und verspreche kein Ranking.',
          resources: [{ label: 'Bing Webmaster Tools öffnen', url: searchVisibilityResources.bingPortal.url }, { label: 'Bing Webmaster Tools Checkliste', url: bingGettingStarted.url }, { label: 'Google erneut crawlen lassen', url: googleRecrawl.url }]
        }
      }
    },
    es: {
      title: 'Configurar Google Search y Bing Webmaster Tools',
      intro: 'Elige una dirección canónica, comprueba o envía tu sitemap y revisa la indexación en Google Search Console y Bing Webmaster Tools. Microsoft Edge es un navegador, no el servicio para webmasters de Bing.',
      steps: {
        'choose-canonical-origin': {
          title: 'Elige una única dirección pública',
          explanation: ['Elige un único dominio HTTPS canónico, por ejemplo https://www.example.com. Comprueba las versiones con y sin www para la página principal y una página interna. El dominio alternativo debe redirigir en un solo sentido al canónico y conservar la ruta.', 'Usa el mismo dominio en metadatos, sitemap y URL enviadas a buscadores. Esta aplicación tiene configurado https://www.desofec.com. No cambies DNS ni redirecciones del alojamiento si no los controlas.'],
          check: 'Has elegido un dominio HTTPS, comprobado la redirección y visto el mismo dominio canónico en la página y el sitemap.',
          aiPrompt: 'Ayúdame a comprobar el dominio canónico de mi sitio. Pídeme comparar www, sin www y el canonical. No pidas contraseñas, tokens de verificación ni acceso DNS.',
          resources: [{ label: 'Añadir una propiedad en Search Console', url: googleProperty.url }]
        },
        'verify-google-property': {
          title: 'Verifica el sitio en Google Search Console',
          explanation: ['Inicia sesión en Search Console y añade una propiedad de dominio para el dominio raíz, por ejemplo example.com. Incluye protocolos y subdominios. Google mostrará un registro DNS TXT; añádelo en el proveedor del dominio solo si controlas DNS y pulsa Verificar. Una propiedad de prefijo de URL es una alternativa para un único prefijo.', 'Si ya verificaste la propiedad, sigue usándola; no crees duplicados para www y sin www. Nunca compartas contraseñas ni tokens.'],
          check: 'Search Console muestra la propiedad correcta y tu cuenta tiene acceso. Si ya está verificada, anótalo y continúa.',
          aiPrompt: 'Explícame cómo verificar una propiedad de dominio de Search Console. Recuérdame usar exactamente el TXT que muestra Google y no compartir credenciales en el chat.',
          resources: [{ label: 'Añadir una propiedad en Search Console', url: googleProperty.url }]
        },
        'submit-google-sitemap': {
          title: 'Comprueba o envía el sitemap canónico a Google',
          explanation: ['En la propiedad verificada, abre Sitemaps. Comprueba primero si la URL completa del sitemap canónico, por ejemplo https://www.example.com/sitemap.xml, ya aparece en la lista. Envíala solo si falta; si ya figura, conserva el envío existente y revisa su estado.', 'Si está pendiente de procesamiento, espera en lugar de volver a enviar el mismo sitemap. Investiga los errores indicados y comprueba que el sitemap contiene las páginas públicas que quieres dar a conocer. El sitemap ayuda a Google a descubrir URL, pero no obliga a indexarlas.'],
          check: 'El sitemap muestra procesamiento correcto y usa el dominio HTTPS canónico.',
          aiPrompt: 'Ayúdame a entender el estado del informe de Sitemaps. Pide solo el texto del estado, nunca credenciales.',
          resources: [{ label: 'Crear y enviar un sitemap a Google', url: googleSitemap.url }]
        },
        'inspect-google-url': {
          title: 'Prueba e inspecciona una página en Google',
          explanation: ['Pega la URL canónica exacta en la inspección de Search Console. Comprueba el estado de indexación y, si hace falta, prueba la URL publicada. Confirma que la obtención funciona, que rastreo e indexación están permitidos y que el canonical declarado coincide con la URL elegida.', 'Si está disponible pero no indexada, solicita la indexación una vez. Google indica que el rastreo puede tardar días o semanas y la solicitud no garantiza inclusión; repetirla no acelera el proceso.'],
          check: 'Distingues disponibilidad para Google de indexación actual y la página declara el canonical esperado.',
          aiPrompt: 'Explícame este estado de Search Console en lenguaje sencillo: [texto no sensible]. Distingue disponibilidad en vivo de indexación y no prometas resultados.',
          resources: [{ label: 'Solicitar a Google que vuelva a rastrear', url: googleRecrawl.url }]
        },
        'set-up-bing-webmaster': {
          title: 'Comprueba o verifica tu sitio en Bing Webmaster Tools',
          explanation: ['Bing Webmaster Tools es el servicio para Bing Search; Microsoft Edge es solo un navegador. Inicia sesión en Bing Webmaster Tools. Comprueba primero si el sitio canónico ya aparece en la lista. Si figura, usa la entrada existente y verifícala solo si es necesario. Si falta, usa la importación de Bing para una propiedad ya verificada en Search Console cuando esté disponible; de lo contrario, añade el sitio y completa uno de los métodos de verificación mostrados.', 'Comprueba si el mismo sitemap canónico, por ejemplo https://www.example.com/sitemap.xml, ya aparece en la lista. Envíalo solo si falta; si el sitemap está pendiente, vigila el envío existente en lugar de repetirlo. Sigue las instrucciones actuales de Bing ante errores y usa sus herramientas de inspección para las nuevas páginas importantes.'],
          check: 'Bing Webmaster Tools muestra el sitio verificado y el sitemap canónico sin errores pendientes.',
          aiPrompt: 'Guíame por la lista oficial de inicio de Bing Webmaster Tools, una pantalla cada vez. Pregunta qué opciones veo. No pidas contraseñas ni tokens.',
          resources: [{ label: 'Abrir Bing Webmaster Tools', url: searchVisibilityResources.bingPortal.url }, { label: 'Lista de inicio de Bing Webmaster Tools', url: bingGettingStarted.url }]
        },
        'monitor-indexing': {
          title: 'Revisa los informes y corrige la causa indicada',
          explanation: ['Consulta periódicamente los informes Pages y Sitemaps de Google y los informes del sitio en Bing. Que una URL no esté indexada puede ser normal; utiliza la causa indicada, como redirección, rastreo bloqueado, canonical duplicado o descubrimiento pendiente. Revisa redirecciones y canonicals antes de volver a solicitar rastreo.', 'Publica contenido útil, original, accesible y claro para las personas. Ninguna configuración garantiza indexación, posición, visitas ni menciones de IA.'],
          check: 'Has anotado un problema real o que no hay ninguno, identificado su causa y evitado repetir solicitudes sin cambios.',
          aiPrompt: 'Ayúdame a entender este problema no sensible de Search Console o Bing. Explica lo que indica y una comprobación segura, sin prometer posiciones.',
          resources: [{ label: 'Abrir Bing Webmaster Tools', url: searchVisibilityResources.bingPortal.url }, { label: 'Lista de inicio de Bing Webmaster Tools', url: bingGettingStarted.url }, { label: 'Solicitar a Google que vuelva a rastrear', url: googleRecrawl.url }]
        }
      }
    }
  },
  'ai-beginner': {
    fr: {
      title: 'Vos premiers pas avec l’IA',
      intro:
        'Découvrez ce qu’est un assistant IA, comment lui parler efficacement et comment transformer une bonne requête en routine. Il vous suffit d’un compte gratuit sur un assistant IA.',
      steps: {
        'what-is-ai': {
          title: 'Comprendre l’idée de base de l’IA',
          explanation: [
            'Les assistants IA modernes comme ChatGPT, Claude et Gemini sont entraînés sur d’énormes quantités de texte. Ils prédisent des mots utiles, l’un après l’autre. Ce sont de puissants assistants, mais ils peuvent se tromper : c’est vous qui gardez le contrôle.',
            'Ouvrez un assistant (ChatGPT sur chatgpt.com, Claude sur claude.ai ou Gemini sur gemini.google.com). Un compte gratuit suffit. Envoyez ensuite le message ci-dessous.'
          ],
          code: 'Explique ce qu’est un assistant IA en 5 phrases simples, comme si je n’en avais jamais utilisé. Dis-moi ensuite 3 choses qu’il fait bien et 3 choses pour lesquelles je ne dois jamais lui faire aveuglément confiance.',
          check: 'Vous obtenez une réponse courte et claire, et vous pouvez dire avec vos propres mots ce que l’IA fait bien ou mal.',
          aiPrompt: 'Explique-le maintenant à nouveau avec une analogie tirée de la cuisine.'
        },
        'prompt-basics': {
          title: 'Comprendre la rédaction d’une requête',
          explanation: [
            'Une requête (prompt) est le message que vous envoyez à l’IA. Une bonne requête comporte quatre parties : un rôle (qui doit être l’IA), une tâche (quoi faire), un contexte (les détails utiles) et un format (comment répondre).',
            'Envoyez d’abord une requête vague, puis la version améliorée ci-dessous. Comparez les deux réponses : la différence est votre première grande leçon.'
          ],
          code: 'Vague : Parle-moi de l’alimentation saine.\n\nMieux : Tu es un nutritionniste sympathique. Je suis étudiant, je cuisine pour une personne avec un petit budget. Propose 5 dîners sains à préparer en 20 minutes. Réponds sous forme de tableau avec le plat, les ingrédients principaux et le niveau de coût.',
          check: 'La meilleure requête donne une réponse plus utile et plus précise. Vous savez dire laquelle des quatre parties a fait la différence.',
          aiPrompt: 'Réécris ma requête pour qu’elle ait un rôle, une tâche, un contexte et un format : « aide-moi à réviser ».'
        },
        'real-tasks': {
          title: 'Utiliser l’IA pour de vraies tâches',
          explanation: [
            'Choisissez une vraie tâche de votre semaine : un e-mail à écrire, un sujet à apprendre, un voyage à organiser ou une décision à réfléchir. Les vraies tâches enseignent plus que les exercices.',
            'Vérifiez toujours les faits, les noms, les dates et les chiffres. Si la réponse est importante, demandez à l’IA comment la vérifier.'
          ],
          code: 'J’ai besoin d’aide pour cette tâche : [décrivez votre tâche ici].\nPose-moi d’abord jusqu’à 3 questions, puis donne-moi un premier brouillon. Après le brouillon, liste ce que je dois vérifier.',
          check: 'Vous avez terminé une vraie tâche avec l’aide de l’IA et vérifié au moins un fait vous-même.',
          aiPrompt: 'Quelles sont les erreurs les plus courantes des assistants IA et comment les repérer ?'
        },
        'small-workflow': {
          title: 'Construire un petit flux de travail',
          explanation: [
            'Un flux de travail est une routine répétable. Au lieu d’écrire une nouvelle requête à chaque fois, vous en enregistrez une bonne et la réutilisez. Gardez vos requêtes dans une application de notes ou un document.',
            'Transformez la tâche que vous venez de faire en modèle réutilisable. Enregistrez-le à un endroit facile à retrouver, puis réutilisez-le la semaine prochaine.'
          ],
          code: 'Transforme notre conversation en modèle de requête réutilisable. Utilise des [crochets] pour les parties que je change à chaque fois. Ajoute une phrase pour vérifier le résultat.',
          check: 'Vous avez un modèle de requête enregistré et vous l’avez utilisé pour une deuxième tâche.',
          aiPrompt: 'Donne-moi 3 autres tâches du quotidien où un modèle de requête me ferait gagner du temps.'
        }
      }
    },
    de: {
      title: 'Deine ersten Schritte mit KI',
      intro:
        'Lerne, was KI-Assistenten sind, wie du gut mit ihnen sprichst und wie aus einem guten Prompt eine Routine wird. Du brauchst nur ein kostenloses Konto bei einem KI-Assistenten.',
      steps: {
        'what-is-ai': {
          title: 'Die Grundidee von KI verstehen',
          explanation: [
            'Moderne KI-Assistenten wie ChatGPT, Claude und Gemini wurden mit riesigen Textmengen trainiert. Sie sagen hilfreiche Wörter nacheinander voraus. Sie sind starke Helfer, können sich aber irren – du behältst die Kontrolle.',
            'Öffne einen Assistenten (ChatGPT auf chatgpt.com, Claude auf claude.ai oder Gemini auf gemini.google.com). Ein kostenloses Konto reicht. Sende dann die Nachricht unten.'
          ],
          code: 'Erkläre in 5 einfachen Sätzen, was ein KI-Assistent ist, so als hätte ich nie einen benutzt. Nenne mir dann 3 Dinge, die er gut kann, und 3 Dinge, denen ich nie blind vertrauen sollte.',
          check: 'Du bekommst eine kurze, klare Antwort und kannst mit eigenen Worten sagen, was KI gut und schlecht kann.',
          aiPrompt: 'Erkläre es jetzt noch einmal mit einem Vergleich aus der Küche.'
        },
        'prompt-basics': {
          title: 'Prompts schreiben verstehen',
          explanation: [
            'Ein Prompt ist die Nachricht, die du an die KI sendest. Ein starker Prompt hat vier Teile: eine Rolle (wer die KI sein soll), eine Aufgabe (was zu tun ist), Kontext (nötige Details) und ein Format (wie geantwortet werden soll).',
            'Sende zuerst einen vagen Prompt, dann die verbesserte Version unten. Vergleiche beide Antworten. Der Unterschied ist deine erste große Lektion.'
          ],
          code: 'Vage: Erzähl mir etwas über gesundes Essen.\n\nBesser: Du bist ein freundlicher Ernährungsberater. Ich bin Student und koche für eine Person mit kleinem Budget. Schlage 5 gesunde Abendessen vor, die ich in 20 Minuten zubereiten kann. Antworte als Tabelle mit Gericht, Hauptzutaten und Kostenstufe.',
          check: 'Der bessere Prompt liefert eine nützlichere, genauere Antwort. Du kannst benennen, welcher der vier Teile den Unterschied gemacht hat.',
          aiPrompt: 'Schreibe meinen Prompt so um, dass er Rolle, Aufgabe, Kontext und Format hat: „hilf mir beim Lernen“.'
        },
        'real-tasks': {
          title: 'KI bei echten Aufgaben nutzen',
          explanation: [
            'Wähle eine echte Aufgabe aus deiner Woche: eine E-Mail, ein Thema zum Lernen, eine Reise oder eine Entscheidung. Echte Aufgaben lehren mehr als Übungsfragen.',
            'Prüfe Fakten, Namen, Daten und Zahlen immer selbst. Wenn die Antwort wichtig ist, frage die KI, wie du sie überprüfen kannst.'
          ],
          code: 'Ich brauche Hilfe bei dieser Aufgabe: [beschreibe hier deine Aufgabe].\nStelle mir zuerst bis zu 3 Fragen und gib mir dann einen ersten Entwurf. Liste nach dem Entwurf auf, was ich noch überprüfen sollte.',
          check: 'Du hast eine echte Aufgabe mit KI-Hilfe erledigt und mindestens einen Fakt selbst geprüft.',
          aiPrompt: 'Welche Fehler machen KI-Assistenten am häufigsten und wie erkenne ich sie?'
        },
        'small-workflow': {
          title: 'Einen kleinen Workflow aufbauen',
          explanation: [
            'Ein Workflow ist eine wiederholbare Routine. Statt jedes Mal einen neuen Prompt zu schreiben, speicherst du einen guten und nutzt ihn wieder. Bewahre gespeicherte Prompts in einer Notiz-App oder einem Dokument auf.',
            'Mache aus der gerade erledigten Aufgabe eine wiederverwendbare Vorlage. Speichere sie an einem leicht auffindbaren Ort und nutze sie nächste Woche wieder.'
          ],
          code: 'Mache aus unserem Gespräch eine wiederverwendbare Prompt-Vorlage. Nutze [eckige Klammern] für die Teile, die ich jedes Mal ändere. Füge einen Satz zum Überprüfen des Ergebnisses hinzu.',
          check: 'Du hast eine gespeicherte Prompt-Vorlage und sie bei einer zweiten Aufgabe benutzt.',
          aiPrompt: 'Nenne mir 3 weitere Alltagsaufgaben, bei denen mir eine Prompt-Vorlage Zeit sparen würde.'
        }
      }
    },
    es: {
      title: 'Tus primeros pasos con la IA',
      intro:
        'Aprende qué son los asistentes de IA, cómo hablarles bien y cómo convertir un buen prompt en una rutina. Solo necesitas una cuenta gratuita en un asistente de IA.',
      steps: {
        'what-is-ai': {
          title: 'Aprende la idea básica de la IA',
          explanation: [
            'Los asistentes de IA modernos, como ChatGPT, Claude y Gemini, se entrenan con enormes cantidades de texto. Predicen palabras útiles, una tras otra. Son ayudantes potentes, pero pueden equivocarse: tú sigues al mando.',
            'Abre un asistente (ChatGPT en chatgpt.com, Claude en claude.ai o Gemini en gemini.google.com). Una cuenta gratuita es suficiente. Luego envía el mensaje de abajo.'
          ],
          code: 'Explica qué es un asistente de IA en 5 frases sencillas, como si nunca hubiera usado uno. Luego dime 3 cosas que hace bien y 3 cosas en las que nunca debo confiar a ciegas.',
          check: 'Recibes una respuesta corta y clara, y puedes decir con tus palabras en qué es buena y en qué es mala la IA.',
          aiPrompt: 'Ahora explícalo otra vez con una analogía de cocina.'
        },
        'prompt-basics': {
          title: 'Entiende cómo escribir prompts',
          explanation: [
            'Un prompt es el mensaje que envías a la IA. Un buen prompt tiene cuatro partes: un rol (quién debe ser la IA), una tarea (qué hacer), contexto (los detalles necesarios) y un formato (cómo responder).',
            'Primero envía un prompt vago y luego la versión mejorada de abajo. Compara las dos respuestas. La diferencia es tu primera gran lección.'
          ],
          code: 'Vago: Háblame de comida saludable.\n\nMejor: Eres un nutricionista amable. Soy estudiante y cocino para una persona con poco presupuesto. Sugiere 5 cenas saludables que pueda preparar en 20 minutos. Responde en una tabla con el plato, los ingredientes principales y el nivel de coste.',
          check: 'El mejor prompt da una respuesta más útil y más específica. Sabes decir cuál de las cuatro partes marcó la diferencia.',
          aiPrompt: 'Reescribe este prompt mío para que tenga rol, tarea, contexto y formato: «ayúdame a estudiar».'
        },
        'real-tasks': {
          title: 'Usa la IA en tareas reales',
          explanation: [
            'Elige una tarea real de tu semana: un correo por escribir, un tema que aprender, un viaje que planear o una decisión que pensar. Las tareas reales enseñan más que los ejercicios.',
            'Comprueba siempre los hechos, nombres, fechas y cifras. Si la respuesta es importante, pregunta a la IA cómo puedes verificarla.'
          ],
          code: 'Quiero ayuda con esta tarea: [describe aquí tu tarea].\nHazme primero hasta 3 preguntas y luego dame un primer borrador. Después del borrador, enumera lo que debería comprobar.',
          check: 'Terminaste una tarea real con ayuda de la IA y comprobaste al menos un dato tú mismo.',
          aiPrompt: '¿Cuáles son los errores más comunes de los asistentes de IA y cómo puedo detectarlos?'
        },
        'small-workflow': {
          title: 'Crea un pequeño flujo de trabajo',
          explanation: [
            'Un flujo de trabajo es una rutina repetible. En lugar de escribir un prompt nuevo cada vez, guardas uno bueno y lo reutilizas. Guarda tus prompts en una app de notas o en un documento.',
            'Convierte la tarea que acabas de hacer en una plantilla reutilizable. Guárdala en un lugar fácil de encontrar y vuelve a usarla la próxima semana.'
          ],
          code: 'Convierte nuestra conversación en una plantilla de prompt reutilizable. Usa [corchetes] para las partes que cambio cada vez. Añade una frase para comprobar el resultado.',
          check: 'Tienes una plantilla de prompt guardada y la has usado en una segunda tarea.',
          aiPrompt: 'Dame otras 3 tareas cotidianas en las que una plantilla de prompt me ahorraría tiempo.'
        }
      }
    }
  },
  'ai-productivity': {
    fr: {
      title: 'Construisez votre système de productivité avec l’IA',
      intro:
        'Repérez les tâches où l’IA peut aider, créez un petit ensemble de requêtes réutilisables, transformez-les en routines hebdomadaires et mesurez ce qui fonctionne vraiment.',
      steps: {
        'identify-tasks': {
          title: 'Identifier les tâches utiles',
          explanation: [
            'L’IA aide surtout pour les tâches répétitives, textuelles ou qui demandent un premier brouillon : e-mails, résumés, planification, brainstorming et recherche. Elle aide le moins pour les tâches qui demandent un jugement privé ou une précision parfaite.',
            'Notez cinq tâches que vous faites chaque semaine, puis demandez à un assistant lesquelles s’y prêtent le mieux. Ne collez jamais de mots de passe, de données privées ou de contenu confidentiel.'
          ],
          code: 'Voici 5 tâches que je fais chaque semaine : [listez-les].\nClasse-les de la plus adaptée à la moins adaptée à l’aide de l’IA. Pour chacune, explique pourquoi en une phrase et dis ce que je dois quand même faire moi-même.',
          check: 'Vous avez une liste classée et avez choisi une ou deux tâches à améliorer en premier.',
          aiPrompt: 'Quelles informations ne dois-je jamais coller dans un outil d’IA ?'
        },
        'prompt-system': {
          title: 'Définir un système de requêtes',
          explanation: [
            'Un système de requêtes est un petit ensemble de requêtes réutilisables pour vos tâches principales. Chacune a un nom, un modèle et une ligne de « vérification » pour relire le résultat.',
            'Demandez à l’assistant de le construire avec vous. Enregistrez ensuite le résultat dans une application de notes comme Notion, où Notion AI peut aussi vous aider.'
          ],
          code: 'Aide-moi à construire un petit système de requêtes pour ces tâches : [vos 2 tâches principales].\nPour chacune, crée un modèle avec des [crochets] pour ce qui change, une phrase pour savoir quand l’utiliser et une liste de vérification du résultat.',
          check: 'Vous avez 2 modèles de requêtes enregistrés au même endroit, chacun avec sa liste de vérification.',
          aiPrompt: 'Montre-moi comment nommer et organiser mes requêtes enregistrées pour les retrouver vite.'
        },
        'apply-routines': {
          title: 'Appliquer des routines d’IA',
          explanation: [
            'Une routine associe une requête à un moment. Par exemple : planification du lundi, résumé quotidien de la boîte mail ou bilan du vendredi. Une routine transforme l’IA d’un jouet en habitude.',
            'Essayez une routine pendant cinq jours ouvrés. Utilisez Perplexity pour vos questions de recherche, car il montre ses sources.'
          ],
          code: 'Crée pour moi une routine hebdomadaire avec l’IA : une requête de planification de 10 minutes le lundi, une requête de résumé de 5 minutes chaque fin de journée et une requête de bilan le vendredi. Garde chacune courte et donne le texte exact de la requête.',
          check: 'Vous avez noté vos trois moments de routine et en avez utilisé une aujourd’hui.',
          aiPrompt: 'Pour la recherche, comment poser ma question pour que la réponse vienne avec des sources que je peux vérifier ?'
        },
        'review-optimize': {
          title: 'Évaluer et optimiser',
          explanation: [
            'Après une semaine, mesurez ce qui s’est passé. Quelles requêtes ont fait gagner du temps ? Lesquelles ont donné de mauvaises réponses ? Améliorez les faibles et supprimez celles que vous n’utilisez pas.',
            'Tenez un petit journal : la tâche, le temps avant, le temps avec l’IA et une note de qualité de 1 à 5.'
          ],
          code: 'Voici mon journal de cette semaine : [collez vos notes]. Dis-moi quelles routines garder, lesquelles améliorer et lesquelles abandonner. Pour chaque requête à améliorer, propose une meilleure version.',
          check: 'Vous avez gardé les routines utiles, amélioré au moins une requête et supprimé une routine qui n’aidait pas.',
          aiPrompt: 'Comment savoir si l’IA me fait vraiment gagner du temps ou me crée seulement plus de vérifications ?'
        }
      }
    },
    de: {
      title: 'Baue dein KI-Produktivitätssystem',
      intro:
        'Finde die Aufgaben, bei denen KI helfen kann, baue ein kleines Set wiederverwendbarer Prompts, mache daraus wöchentliche Routinen und miss, was wirklich funktioniert.',
      steps: {
        'identify-tasks': {
          title: 'Nützliche Aufgaben erkennen',
          explanation: [
            'KI hilft am meisten bei Aufgaben, die sich wiederholen, aus Text bestehen oder einen ersten Entwurf brauchen: E-Mails, Zusammenfassungen, Planung, Brainstorming und Recherche. Am wenigsten hilft sie bei Aufgaben, die persönliches Urteilsvermögen oder perfekte Genauigkeit brauchen.',
            'Schreibe fünf Aufgaben auf, die du jede Woche erledigst, und frage einen Assistenten, welche sich am besten eignen. Füge niemals Passwörter, private Daten oder Vertrauliches ein.'
          ],
          code: 'Das sind 5 Aufgaben, die ich jede Woche erledige: [liste sie auf].\nSortiere sie von der besten bis zur schlechtesten Eignung für KI-Hilfe. Erkläre jeweils in einem Satz warum und nenne, was ich weiterhin selbst tun sollte.',
          check: 'Du hast eine sortierte Liste und ein bis zwei Aufgaben ausgewählt, die du zuerst verbessern willst.',
          aiPrompt: 'Welche Informationen sollte ich niemals in ein KI-Tool einfügen?'
        },
        'prompt-system': {
          title: 'Ein Prompt-System festlegen',
          explanation: [
            'Ein Prompt-System ist ein kleines Set wiederverwendbarer Prompts für deine wichtigsten Aufgaben. Jeder hat einen Namen, eine Vorlage und eine „Prüfzeile“ zum Kontrollieren des Ergebnisses.',
            'Bitte den Assistenten, das System mit dir zu bauen. Speichere die Ergebnisse dann in einer Notiz-App wie Notion, wo dir auch Notion AI helfen kann.'
          ],
          code: 'Hilf mir, ein kleines Prompt-System für diese Aufgaben zu bauen: [deine 2 wichtigsten Aufgaben].\nErstelle für jede eine Prompt-Vorlage mit [eckigen Klammern] für das, was sich ändert, einen Hinweis, wann sie passt, und eine Checkliste zur Prüfung des Ergebnisses.',
          check: 'Du hast 2 Prompt-Vorlagen an einem Ort gespeichert, jede mit einer Prüf-Checkliste.',
          aiPrompt: 'Zeig mir, wie ich meine gespeicherten Prompts benenne und ordne, damit ich sie schnell finde.'
        },
        'apply-routines': {
          title: 'KI-Routinen anwenden',
          explanation: [
            'Eine Routine verbindet einen Prompt mit einem Zeitpunkt. Zum Beispiel: Montagsplanung, tägliche Posteingangs-Zusammenfassung oder Freitagsrückblick. Eine Routine macht aus KI eine Gewohnheit statt eines Spielzeugs.',
            'Probiere eine Routine fünf Arbeitstage lang aus. Nutze Perplexity für Recherchefragen, denn es zeigt seine Quellen.'
          ],
          code: 'Erstelle für mich eine wöchentliche Routine mit KI: einen 10-minütigen Planungs-Prompt am Montag, einen 5-minütigen Tagesabschluss-Prompt und einen Rückblick-Prompt am Freitag. Halte jeden kurz und gib den genauen Prompt-Text an.',
          check: 'Du hast deine drei Routine-Zeiten notiert und heute eine davon genutzt.',
          aiPrompt: 'Wie stelle ich bei einer Recherche meine Frage, damit die Antwort Quellen enthält, die ich prüfen kann?'
        },
        'review-optimize': {
          title: 'Auswerten und optimieren',
          explanation: [
            'Miss nach einer Woche, was passiert ist. Welche Prompts haben Zeit gespart? Welche gaben schlechte Antworten? Verbessere die schwachen und lösche die, die du nie nutzt.',
            'Führe ein kurzes Protokoll: die Aufgabe, die Zeit vorher, die Zeit mit KI und eine Qualitätsnote von 1 bis 5.'
          ],
          code: 'Hier ist mein Protokoll dieser Woche: [füge deine Notizen ein]. Sag mir, welche Routinen ich behalten, verbessern oder streichen soll. Schlage für jeden Prompt, den ich verbessern soll, eine bessere Version vor.',
          check: 'Du hast die nützlichen Routinen behalten, mindestens einen Prompt verbessert und einen unnützen entfernt.',
          aiPrompt: 'Woran erkenne ich, ob KI mir wirklich Zeit spart oder nur mehr Prüfarbeit erzeugt?'
        }
      }
    },
    es: {
      title: 'Crea tu sistema de productividad con IA',
      intro:
        'Encuentra las tareas en las que la IA puede ayudar, crea un pequeño conjunto de prompts reutilizables, conviértelos en rutinas semanales y mide lo que realmente funciona.',
      steps: {
        'identify-tasks': {
          title: 'Identifica tareas útiles',
          explanation: [
            'La IA ayuda más en tareas repetitivas, basadas en texto o que necesitan un primer borrador: correos, resúmenes, planificación, lluvia de ideas e investigación. Ayuda menos en tareas que requieren juicio personal o precisión perfecta.',
            'Anota cinco tareas que haces cada semana y pregunta a un asistente cuáles encajan mejor. Nunca pegues contraseñas, datos privados ni nada confidencial.'
          ],
          code: 'Estas son 5 tareas que hago cada semana: [enuméralas].\nOrdénalas de la más a la menos adecuada para ayuda de IA. Para cada una, explica por qué en una frase e indica qué debería seguir haciendo yo.',
          check: 'Tienes una lista ordenada y elegiste una o dos tareas para mejorar primero.',
          aiPrompt: '¿Qué tipo de información nunca debo pegar en una herramienta de IA?'
        },
        'prompt-system': {
          title: 'Define un sistema de prompts',
          explanation: [
            'Un sistema de prompts es un pequeño conjunto de prompts reutilizables para tus tareas principales. Cada uno tiene un nombre, una plantilla y una línea de «revisión» para comprobar el resultado.',
            'Pide al asistente que lo construya contigo. Luego guarda los resultados en una app de notas como Notion, donde Notion AI también puede ayudarte.'
          ],
          code: 'Ayúdame a crear un pequeño sistema de prompts para estas tareas: [tus 2 tareas principales].\nPara cada una, crea una plantilla con [corchetes] para lo que cambia, una nota sobre cuándo usarla y una lista de comprobación del resultado.',
          check: 'Tienes 2 plantillas de prompt guardadas en un mismo lugar, cada una con su lista de comprobación.',
          aiPrompt: 'Muéstrame cómo nombrar y organizar mis prompts guardados para encontrarlos rápido.'
        },
        'apply-routines': {
          title: 'Aplica rutinas de IA',
          explanation: [
            'Una rutina une un prompt con un momento. Por ejemplo: planificación del lunes, resumen diario del correo o repaso del viernes. Una rutina convierte la IA de un juguete en un hábito.',
            'Prueba una rutina durante cinco días laborables. Usa Perplexity para preguntas de investigación, porque muestra sus fuentes.'
          ],
          code: 'Crea para mí una rutina semanal con IA: un prompt de planificación de 10 minutos el lunes, un prompt de resumen de 5 minutos al final de cada día y un prompt de repaso el viernes. Mantén cada uno breve e incluye el texto exacto del prompt.',
          check: 'Anotaste tus tres momentos de rutina y usaste uno hoy.',
          aiPrompt: 'Para investigar, ¿cómo debo formular la pregunta para que la respuesta incluya fuentes que pueda comprobar?'
        },
        'review-optimize': {
          title: 'Revisa y optimiza',
          explanation: [
            'Después de una semana, mide lo que pasó. ¿Qué prompts ahorraron tiempo? ¿Cuáles dieron malas respuestas? Mejora los débiles y elimina los que nunca usas.',
            'Lleva un registro breve: la tarea, el tiempo antes, el tiempo con IA y una nota de calidad de 1 a 5.'
          ],
          code: 'Este es mi registro de la semana: [pega tus notas]. Dime qué rutinas conservar, cuáles mejorar y cuáles descartar. Para cada prompt a mejorar, sugiere una versión mejor.',
          check: 'Conservaste las rutinas útiles, mejoraste al menos un prompt y eliminaste uno que no ayudaba.',
          aiPrompt: '¿Cómo sé si la IA realmente me ahorra tiempo o solo me crea más trabajo de comprobación?'
        }
      }
    }
  }
};

export function getTutorialTranslation(tutorialId: string, language: LanguageCode) {
  if (language === 'en') return undefined;
  return tutorialTranslations[tutorialId]?.[language];
}

export const tutorialTranslations: Record<string, Partial<Record<Exclude<LanguageCode, 'en'>, TutorialTranslation>>> = {
  ...contentServicesTranslations,
  ...automationServicesTranslations,
  ...commerceServicesTranslations,
  ...cadServicesTranslations,
  ...microSaasTranslations,
  ...educationServicesTranslations,
  ...videoBusinessTranslations,
  ...contentCreationTranslations,
  ...privacyFactCheckingTranslations,
  ...multilingualWorkTranslations,
  ...meetingNotesTranslations,
  ...workflowsAgentsTranslations,
  ...baseTranslations,
  ...taskTrackerTranslations,
  ...codingTranslations,
  ...webNocodeTranslations,
  ...mlDesignTranslations,
  ...Object.fromEntries(
    Object.keys(practicalFrench).map((id) => [id, {
      fr: practicalFrench[id],
      de: practicalGerman[id],
      es: practicalSpanish[id]
    }])
  )
};
