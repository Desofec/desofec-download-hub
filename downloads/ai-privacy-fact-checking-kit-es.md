# Kit de IA: privacidad y verificación de datos

Por Desofec AI Studio. Mantén los datos privados fuera de los prompts de IA y comprueba cada afirmación de la IA con fuentes reales. Este kit es práctica de aprendizaje, no asesoramiento jurídico, y ninguna comprobación es una garantía.

## 1. Antes del prompt: control de privacidad
Marca cada dato de tu texto como **PRIVADO** o **SE PUEDE USAR** antes de pegar nada en una herramienta de IA.
- Nombres de personas reales, correos electrónicos, números de teléfono y domicilios: PRIVADO.
- Datos de salud, económicos, de cuentas, contraseñas, números de identidad y asuntos legales: PRIVADO.
- Registros de clientes, estudiantes, pacientes o empleados e información empresarial confidencial: PRIVADO.
- Solo los hechos que la tarea realmente necesita: SE PUEDE USAR.
- Revisa tú mismo la configuración de privacidad y las condiciones actuales de la herramienta de IA, como el historial de chats o las opciones de entrenamiento. No des por hecho que son seguras.

## 2. Marcadores para anonimizar
Sustituye los datos privados por marcadores neutros y guarda el original en privado.
- Persona: [PERSONA A], [PERSONA B]
- Contacto: [CORREO], [TELÉFONO], [DIRECCIÓN]
- Organización o cuenta: [ORGANIZACIÓN], [CUENTA]
- Salud u otros datos sensibles: elimínalos por completo si la tarea no los necesita; no los insinúes.
- Antes de enviar un prompt, reléelo y cuenta los datos privados que quedan. El objetivo es 0.

Ejemplo de práctica (ficticio): «Alex Example (alex@example.test, +00 0000 0000) dice que la reunión de voluntarios es el 2030-03-14 a las 18:00 en la sala B. Llegará tarde por una cita médica.» pasa a ser «[PERSONA A] ([CORREO], [TELÉFONO]) dice que la reunión de voluntarios es el 2030-03-14 a las 18:00 en la sala B.»

## 3. Hoja de comprobación de afirmaciones
Divide una respuesta de IA en una afirmación por línea y compara cada una solo con tus fuentes.

| ID | Afirmación | Evidencia de tu fuente | Veredicto |
|----|------------|------------------------|-----------|
| C1 | | | RESPALDADA / CONTRADICHA / FALTA FUENTE |
| C2 | | | |
| C3 | | | |
| S1 | Fuente citada | ¿Está entre tus fuentes? | ENCONTRADA / CITA NO ENCONTRADA |

Práctica ficticia Riverside Library: la hoja de fuentes indica lunes-viernes 09:00-18:00, sábado 10:00-14:00, cerrado el domingo, inscripción gratuita para residentes y 12 portátiles con préstamos de 2 horas. El resumen de la IA afirmaba que abre los 7 días y presta 50 portátiles (CONTRADICHA), el sábado 10:00-14:00 y la inscripción gratuita (RESPALDADA), que se fundó en 1952 (FALTA FUENTE) y citaba «City Library Report 2029» (CITA NO ENCONTRADA). Resultado: 2 RESPALDADAS, 2 CONTRADICHAS, 1 FALTA FUENTE.

## 4. Plantillas de prompts seguros
- **Solo categorías**: «¿Qué tipos de datos de un mensaje suelen ser personales o sensibles? Indica solo categorías.»
- **Tarea anonimizada**: «Usando solo este texto anonimizado, escribe [TAREA]. Conserva los marcadores y no adivines a quién se refieren: [TEXTO ANONIMIZADO]»
- **Dividir afirmaciones**: «Divide este texto en afirmaciones factuales separadas, una por línea. No añadas, juzgues ni corrijas nada: [TEXTO]»
- **Comprobar solo con la fuente**: «Compara cada afirmación solo con esta fuente. Cita la evidencia o escribe "no figura en la fuente". No inventes citas: [AFIRMACIONES] [FUENTE]»
- **Solo redacción**: «Mejora la redacción sin añadir, eliminar ni cambiar ningún hecho, número o fuente: [TEXTO CORREGIDO]»

## 5. Revisión honesta y límites
- Corrige las afirmaciones contradichas con la redacción de la fuente y elimina las no verificadas o márcalas como NO VERIFICADA.
- Nunca inventes, adivines ni «completes» una fuente o una cita. Elimina las citas que no encuentres.
- Vuelve a comprobar con tus fuentes cualquier reescritura de la IA antes de usarla.
- Mantén en privado el ejercicio ficticio de Riverside Library: la aprobación sigue BLOQUEADA porque no hay un editor real, y los comentarios y resultados siguen NO RECOPILADOS.
- En un trabajo real, sigue las normas de tu organización, obtén una aprobación real y consulta a una persona cualificada ante cuestiones legales o de seguridad.
