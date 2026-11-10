# Kit de validación de micro-SaaS

Desofec AI Studio. Validación educativa, no un servicio en producción ni una promesa de ingresos.
No se necesitan IA de pago, datos de pago, suscripciones ni datos de clientes reales.

## 1. Evidencia del problema
Idea de práctica: dar formato a una breve actualización de proyecto a partir de un nombre y un estado.
Usuario/tarea/frecuencia:
Alternativa actual:
Evidencia real de entrevista anonimizada y fecha:
Suposiciones:
¿Sin entrevistas? Marca la demanda como UNVALIDATED (no validada). Un cumplido no es un compromiso de pago.

## 2. Especificación mínima
Proyecto: nombre sin espacios al principio ni al final, de 1-40 caracteres. Estado: Draft o Review.
La salida debe ser exactamente esta, en inglés como en el prototipo:

```text
Project: Atlas
Status: Review
```

Rechaza nombres vacíos o demasiado largos y estados no válidos.
Excluidos: generación con IA, almacenamiento, llamadas de red, inicio de sesión, facturación e integraciones.
Prueba una versión manual antes de programar.

## 3. Prototipo local
El tutorial en /tutorials/micro-saas-validation incluye el código completo de formatter.html.
Cópialo en un archivo HTML de texto plano, ábrelo localmente e introduce solo nombres ficticios.
Usa textContent, no inserción HTML, y no envía ni guarda nada.
No añadas una API de IA a un formateador determinista.
Método del prototipo: navegador / solo manual. Un ejercicio manual no demuestra que las pruebas del navegador hayan pasado.

## 4. Cinco pruebas y supuestos de costes
Entrada | esperado | resultado real | evidencia | corrección/nueva prueba.
1. Atlas + Review: salida exacta de dos líneas.
2. Nombre vacío: error visible.
3. 40 caracteres: aceptados.
4. 41 caracteres forzados en la entrada mediante herramientas de desarrollador: error visible.
5. `<b>Atlas</b>`: texto literal, sin elemento en negrita.

Factura de alojamiento/API del prototipo local: ninguna; registra tu tiempo real.
Futuro alojamiento/API/soporte/supervisión/pagos/impuestos/gastos generales: TO CONFIRM (por confirmar).
El precio de una suscripción no es un beneficio; no proyectes ingresos de por vida a partir de esta muestra.

## 5. Observación con consentimiento
Tarea intentada:
Confusión observada:
Alternativa existente:
¿Lo volvería a probar? Respuesta real:
Evidencia de una necesidad recurrente:
Disposición a pagar: UNVALIDATED salvo que haya evidencia directa.
No recojas pagos ni registros personales en este ejercicio.
Usa el generador de propuestas para delimitar descubrimiento/prototipo, no un producto de suscripción listo para vender.

## 6. Decisión
Evidencia del problema / lagunas de pruebas / utilidad observada / incertidumbre / costes desconocidos.
Decisión: continuar el descubrimiento / revisar / detener.
Próxima evidencia, responsable y fecha de revisión:

Antes de cualquier lanzamiento real, planifica por separado control de acceso, privacidad/conservación/eliminación,
facturación/reembolsos, supervisión, soporte, revisión de seguridad y recuperación ante fallos.
Un prototipo local de juguete no está listo para producción.

Prompt: «Revisa solo estas observaciones y resultados de pruebas. Separa la evidencia de las suposiciones.
No inventes tracción, usuarios de pago ni cumplimiento: [registro anonimizado]».
