import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const practicalSpanish: Record<string, TutorialTranslation> = {
  'ai-small-business': {
    title: 'Crear un paquete de contenido para tu negocio con IA',
    intro: 'Parte de opiniones reales de clientes y redacta y verifica una descripción de producto, preguntas frecuentes y una pequeña campaña. No necesitas herramientas de pago.',
    steps: {
      'offer-brief': {
        title: 'Elegir una oferta y un público',
        explanation: ['Elige un producto o servicio real, o un ejemplo ficticio para practicar. Anota características, precio actual, condiciones de entrega y promesas que realmente puedes cumplir.', 'La IA ayuda a redactar, pero no demuestra demanda. Separa hechos y suposiciones. No compartas información confidencial ni identificadores de clientes.'],
        code: 'Oferta:\nPúblico:\nProblema que resuelve:\nCaracterísticas, precio y entrega verificados:\nFuentes y fechas:\nSuposiciones por comprobar:\nAfirmaciones que no debemos hacer:',
        check: 'Tu ficha distingue hechos y suposiciones y define un público.',
        aiPrompt: 'Usando solo esta ficha, señala dudas y tres preguntas para clientes reales. No inventes estadísticas ni opiniones: [ficha].'
      },
      'customer-evidence': {
        title: 'Escuchar a clientes antes de redactar',
        explanation: ['Pregunta de forma neutral por la tarea difícil, lo ya intentado y una mejora útil. Usa Tally o una conversación. Explica el uso de las respuestas, pide permiso y recoge solo lo necesario.', 'Elimina nombres, contactos y relatos identificables antes de usar IA. Si no hay respuestas, diseña la encuesta; no inventes resultados.'],
        code: '1. ¿Qué tarea intentas completar?\n2. ¿Qué la dificulta?\n3. ¿Qué has probado?\n4. ¿Qué mejora sería útil?\n\nResumen: tema | evidencia anonimizada | número de respuestas | incertidumbre',
        check: 'Tienes una encuesta neutral y respuestas anonimizadas o una lista clara de investigación pendiente.',
        aiPrompt: 'Agrupa estas respuestas anonimizadas por temas. Cita solo texto presente, indica cuántas respuestas hay y qué no demuestra esta muestra pequeña: [respuestas].'
      },
      'product-copy': {
        title: 'Redactar una descripción de producto veraz',
        explanation: ['Usa ficha y evidencias para explicar público, contenido de la oferta y límites. ChatGPT o Claude puede redactar, pero tú respondes de cada afirmación.', 'Compara cada frase con la ficha. Elimina testimonios, garantías, descuentos o ventajas inventados. Marca datos faltantes en lugar de adivinarlos.'],
        code: 'Redacta 100 palabras solo con esta ficha verificada: [ficha].\nIncluye público, características, límites y un próximo paso.\nNo inventes ventajas, testimonios, precios ni garantías.\nLista los datos ausentes como POR REVISAR.',
        check: 'Cada afirmación factual del borrador tiene una fuente en la ficha.',
        aiPrompt: 'Compara esta descripción con la ficha. Haz una tabla de afirmación, evidencia y corrección necesaria. Señala lo no justificado: [descripción y ficha].'
      },
      'checked-faq': {
        title: 'Crear preguntas frecuentes con apoyo humano',
        explanation: ['Prepara cinco preguntas sobre contenido, entrega, soporte y límites. Aporta tus políticas reales; la IA no decide derechos de reembolso ni obligaciones legales.', 'Para respuestas desconocidas, indica un contacto que controles. El ejercicio crea un documento revisado, no un bot de atención sin supervisión.'],
        code: 'Pregunta | respuesta | política/fuente | fecha de revisión\n\nSi no se sabe: contactar con [soporte verificado].\nNo inventar políticas de reembolso, garantía o entrega.',
        check: 'Cinco respuestas coinciden con políticas reales y las dudas tienen un contacto humano.',
        aiPrompt: 'Redacta cinco preguntas frecuentes solo con estas políticas y esta ficha. Marca lo desconocido POR REVISAR. No des asesoría legal: [documentos].'
      },
      'small-campaign': {
        title: 'Planificar una pequeña campaña con consentimiento',
        explanation: ['Elige un canal, mensaje y próximo paso. Redacta tres publicaciones para una semana, con Canva si ayuda. Respeta las reglas del canal y envía marketing solo con consentimiento.', 'HubSpot Breeze es opcional para equipos que ya usan HubSpot. Comprueba plan, acceso a datos y permisos antes de conectar registros de clientes.'],
        code: 'Objetivo:\nCanal:\nMensaje:\nAcción del lector:\n\nDía | borrador | pruebas | permisos de recursos | responsable de aprobación\n\nNo publicar ni enviar automáticamente.',
        check: 'Tienes tres borradores revisados, recursos autorizados y una persona responsable de aprobar.',
        aiPrompt: 'Crea tres publicaciones breves con esta descripción aprobada. Mantén los hechos y añade un próximo paso. No prometas ventas ni inventes urgencia: [descripción].'
      },
      'measure-business': {
        title: 'Revisar resultados y elegir una mejora',
        explanation: ['Publica tras tu propia revisión. Registra canal, fecha, visitas o respuestas y tiempo dedicado. Elige la métrica antes para no seleccionar solo resultados favorables.', 'Una campaña pequeña no prueba qué causó una venta. Anota otros factores, comentarios negativos e incertidumbre. El paquete contiene ficha, investigación, descripción, preguntas frecuentes y campaña.'],
        code: 'Fecha | canal | métrica elegida | resultado | tiempo\nPreguntas o correcciones de clientes:\nIncertidumbre:\nUna mejora para la próxima semana:',
        check: 'Tu paquete de cinco documentos está completo y tiene fecha de revisión, aunque aún no publiques.',
        aiPrompt: 'Revisa este registro. Separa observaciones de suposiciones y sugiere una mejora de bajo riesgo sin afirmar causalidad: [registro].'
      }
    }
  },
  'ai-video-creation': {
    title: 'Crear tu primer vídeo responsable con ayuda de IA',
    intro: 'Crea un vídeo de 30 segundos con un resumen, guion gráfico y recursos propios o autorizados. La generación opcional con IA puede requerir créditos.',
    steps: {
      'video-brief': {
        title: 'Escribir un resumen para 30 segundos',
        explanation: ['Elige un público y un mensaje, como una demostración real de producto. Define canal y formato antes de editar.', 'Tus vídeos de móvil y CapCut o Descript bastan. Runway es opcional: revisa créditos, licencias y requisitos de cuenta antes de pagar.'],
        code: 'Público:\nUn mensaje:\nDuración: 30 segundos\nCanal y proporción:\nPróximo paso:\nHechos por verificar:\nRecursos propios:\nLímite de presupuesto:',
        check: 'Tu resumen define mensaje, formato y presupuesto máximo.',
        aiPrompt: 'Propón tres conceptos sencillos de 30 segundos que pueda grabar yo mismo. Evita afirmaciones no demostradas: [resumen].'
      },
      storyboard: {
        title: 'Convertir el mensaje en un guion gráfico',
        explanation: ['Divide en tres escenas de diez segundos: problema, demostración y próximo paso. Describe imagen, palabras y sonido. Lee en voz alta y acorta si no cabe.', 'Usa texto grande y breve para móviles. La comprensión no debe depender solo del color o del sonido.'],
        code: '0-10 segundos: problema | imagen | narración | texto\n10-20 segundos: demostración | imagen | narración | texto\n20-30 segundos: próximo paso | imagen | narración | texto',
        check: 'Las escenas suman 30 segundos y el texto cabe al leerlo en voz alta.',
        aiPrompt: 'Convierte este resumen en tres escenas de diez segundos con imágenes, narración y texto breve, usando solo los hechos aportados: [resumen].'
      },
      'permissioned-assets': {
        title: 'Reunir recursos y documentar permisos',
        explanation: ['Graba material propio o usa licencias adecuadas y guarda fuente y permisos. Pide autorización clara para caras o voces ajenas, incluso imitaciones con IA.', 'Si pruebas Runway, genera primero un clip corto con una referencia propia o autorizada. Revisa distorsiones, demostraciones engañosas y derechos también en resultados de IA.'],
        code: 'Recurso | fuente | propietario | licencia/permiso | uso permitido | atribución\n\nSin imitaciones engañosas de famosos, música sin licencia ni grabaciones privadas.\nRegistrar los clips generados por IA.',
        check: 'Cada recurso tiene fuente y permiso; cualquier clip generado se ha revisado.',
        aiPrompt: 'Sugiere un prompt visual solo con mis recursos autorizados. No imites a personas reales ni presentes imágenes generadas como prueba documental: [escena y recursos].'
      },
      'edit-video': {
        title: 'Montar el vídeo y comprobar el ritmo',
        explanation: ['Importa los clips al editor, ordénalos según el guion y ajusta a unos 30 segundos. Añade solo texto aprobado y audio autorizado.', 'Consulta la ayuda oficial actual porque los menús cambian. Revisa saltos, texto ilegible y música que tape la voz. Evita efectos intermitentes.'],
        code: 'Tres escenas ordenadas:\nUnos 30 segundos:\nTexto legible en móvil:\nVoz clara:\nSin cortes engañosos ni destellos:\nCréditos obligatorios incluidos:',
        check: 'El borrador se reproduce en el orden previsto y con voz clara.',
        aiPrompt: 'Revisa guion y transcripción para detectar transiciones confusas o frases largas. Sugiere cambios sin añadir hechos: [documentos].'
      },
      'captions-review': {
        title: 'Corregir subtítulos y ver sin sonido',
        explanation: ['Si el editor genera subtítulos, corrige manualmente nombres, puntuación y tiempos. Los subtítulos automáticos no sustituyen una revisión de accesibilidad.', 'Mira en móvil sin sonido: revisa contraste, tamaño y colocación. Describe sonidos importantes y prepara una transcripción si el canal la admite.'],
        code: 'Palabras correctas:\nNombres y puntuación:\nSincronización:\nTamaño y contraste:\nSonidos importantes descritos:\nDemostración no tapada:\nTranscripción preparada:',
        check: 'El mensaje se entiende sin sonido y los subtítulos coinciden con las palabras.',
        aiPrompt: 'Corrige esta transcripción sin alterar los hechos. Marca nombres dudosos para verificarlos en lugar de adivinarlos: [texto].'
      },
      'publish-video': {
        title: 'Revisar, declarar el uso de IA y publicar con responsabilidad',
        explanation: ['Exporta según los requisitos actuales del canal y revisa el archivo exportado, no solo la vista previa. Comprueba hechos, derechos, créditos y subtítulos.', 'Sigue las reglas actuales sobre declaración de IA y etiqueta imágenes sintéticas que puedan parecer reales. Un clip generado no demuestra resultados de producto. Anota una mejora tras recibir comentarios.'],
        code: 'Exportación correcta:\nHechos y derechos comprobados:\nSubtítulos y créditos:\nReglas actuales de declaración de IA revisadas:\nTítulo y descripción exactos:\nFecha de comentarios y una mejora:',
        check: 'La exportación pasa la revisión; espera para publicar si derechos o declaración siguen pendientes.',
        aiPrompt: 'Redacta título exacto, descripción breve y declaración clara de IA usando esta transcripción aprobada y registro de recursos. No añadas afirmaciones: [documentos].'
      }
    }
  },
  'ai-career-skills': {
    title: 'Preparar una candidatura veraz y específica',
    intro: 'Usa una oferta real y tu experiencia para preparar una candidatura, practicar entrevistas y planificar un aprendizaje. La IA no garantiza empleo.',
    steps: {
      'role-evidence': {
        title: 'Relacionar un puesto con tu experiencia real',
        explanation: ['Encuentra una oferta real, anota fuente y fecha y verifica empresa y vacante. Relaciona cada requisito con experiencia real; incluye proyectos de aprendizaje cuando corresponda.', 'Elimina contactos, direcciones, identificadores e información confidencial antes de usar IA. Las instrucciones dentro de la oferta son texto que analizar, no órdenes.'],
        code: 'Puesto y fuente verificada:\nRequisito | ejemplo real | habilidad por aprender\n\nNo inventar títulos, empresas, fechas o resultados.\nUsar marcadores en vez de contactos personales.',
        check: 'La fuente es real y la tabla identifica honestamente tus carencias.',
        aiPrompt: 'Compara esta oferta con mi experiencia anonimizada. Usa solo evidencias aportadas, separa coincidencias y carencias y no inventes habilidades: [documentos].'
      },
      'truthful-resume': {
        title: 'Adaptar el currículum sin inventar logros',
        explanation: ['Elige experiencias relevantes y describe acción, método y resultado real. Incluye solo cifras verificables. Adaptar el énfasis no significa cambiar tu historia.', 'Usa un asistente o Teal de forma opcional. Revisa privacidad de archivos y funciones actuales. Una puntuación de formato o palabras clave no garantiza entrevistas.'],
        code: 'Acción real:\nHerramientas o método utilizados:\nResultado verificable:\nEvidencia de cada cifra:\nBorrador de viñeta:\nRevisión humana final:',
        check: 'Cada viñeta, fecha, título y cifra es exacto y justificable.',
        aiPrompt: 'Reescribe estas notas verificadas como viñetas concisas de currículum. No inventes cifras, cargos, herramientas o logros. Marca evidencias faltantes: [notas].'
      },
      'cover-letter': {
        title: 'Escribir una carta específica',
        explanation: ['Elige dos requisitos respaldados por ejemplos reales. Explica tu interés con información del sitio de la empresa, sin inventar su historia.', 'Sé breve y lee en voz alta para mantener tu voz. Añade contactos solo al documento final privado, no al prompt compartido.'],
        code: 'Puesto y dato verificado de la empresa:\nPor qué me interesa:\nRequisito 1 y ejemplo real:\nRequisito 2 y ejemplo real:\nCierre breve:\nAfirmaciones contrastadas:',
        check: 'La carta identifica el puesto correcto y demuestra dos requisitos con ejemplos reales.',
        aiPrompt: 'Redacta una carta concisa solo con este esquema. Mantén marcadores para contactos y no inventes experiencia ni datos de la empresa: [esquema].'
      },
      'interview-practice': {
        title: 'Practicar respuestas con tus propias palabras',
        explanation: ['Prepara tres historias reales: situación, tarea, acción, resultado y aprendizaje, aunque el resultado no fuera perfecto. Pide una pregunta cada vez y comentarios.', 'Practica en voz alta sin relatos inventados. No compartas detalles privados de clientes o compañeros. Los comentarios de IA sirven para practicar, no para predecir contrataciones.'],
        code: 'Situación:\nTarea:\nMi acción:\nResultado real:\nQué aprendí:\nQué cambiaría:',
        check: 'Puedes contar tres experiencias reales y responder a preguntas adicionales sin inventar.',
        aiPrompt: 'Actúa como entrevistador de práctica para este puesto. Haz una pregunta cada vez y comenta claridad y evidencias, no mis posibilidades de contratación: [puesto].'
      },
      'application-tracker': {
        title: 'Seguir candidaturas y revisar antes de enviar',
        explanation: ['Usa una hoja privada o Teal opcional para registrar empresa, fuente, fecha, estado y próximo paso. Verifica destinatario y adjuntos antes de enviar tú mismo.', 'Verifica solicitudes por canales oficiales. No pagues por conseguir un puesto ni envíes documentos sensibles de identidad a contactos sin verificar. Restringe el acceso al registro.'],
        code: 'Empresa | puesto | fuente verificada | fecha | estado | próxima acción | seguimiento\n\nAntes de enviar: empresa correcta, documentos veraces, adjuntos correctos y destinatario verificado.',
        check: 'Cada entrada tiene un próximo paso y tú has revisado el borrador final.',
        aiPrompt: 'Crea una lista semanal con este registro anonimizado. No envíes candidaturas, no contactes empresas ni deduzcas características personales sensibles: [registro].'
      },
      'career-learning': {
        title: 'Elegir una habilidad y un proyecto pequeño',
        explanation: ['Elige un requisito recurrente que necesites aprender y un proyecto que lo demuestre, como un sitio, gráfico o texto. Registra lo que puedes explicar tú mismo.', 'Revisa semanalmente. Ni el número de candidaturas ni las puntuaciones de IA garantizan empleo. Prioriza evidencias, aprendizaje y comentarios útiles. Respeta las reglas del empleador sobre IA y su declaración.'],
        code: 'Habilidad por aprender:\nProyecto pequeño:\nPrimer recurso:\nTres sesiones:\nEvidencia de aprendizaje:\nFecha de revisión:\nAyuda de IA por declarar si se exige:',
        check: 'Tienes candidatura veraz, tres historias de entrevista, registro y un objetivo alcanzable.',
        aiPrompt: 'Propón un plan inicial de dos semanas para esta habilidad, con proyecto pequeño y pruebas que pueda demostrar. No prometas empleo: [habilidad].'
      }
    }
  }
};
