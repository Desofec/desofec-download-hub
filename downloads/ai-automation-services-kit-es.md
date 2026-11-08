# Kit de automatización de flujos para pequeñas empresas

De Desofec AI Studio. Para usar con AI Business Launchpad y el tutorial de servicios de automatización.
Estas hojas son educativas; no prometen ingresos ni constituyen asesoramiento legal, fiscal o de inversión.
No necesitas herramientas de pago para los ejercicios en papel o en una hoja de cálculo.

Elige **seguimiento de consultas de clientes**, **recordatorios automáticos de citas** o **informes empresariales semanales automatizados**.
Esto amplía la ruta AI Workflow Automation for Small Business; las URL y el progreso existente de consultas no cambian. Al crear un proyecto privado en el espacio de trabajo, elige el proyecto de automatización correspondiente. Cada proyecto conserva su propio resumen, planes y pruebas. El ejercicio original de seis eventos de consulta sigue siendo válido para proyectos antiguos.
Los IDs de plan existentes AUTO-1 a AUTO-9 no cambian; usa APPT-1 a APPT-6 para citas y REPORT-1 a REPORT-6 para informes.

Prueba `/business-launchpad/automation-lab` para una simulación local basada solo en reglas: sin conector externo,
modelo IA, buzón, calendario, envíos ni carga automática a una cuenta. Al recargar se borra el estado del laboratorio.
Descarga expresamente las observaciones y revísalas antes de copiarlas al cuaderno privado.
La práctica en papel o en hoja también es válida si se describe con honestidad; ninguna verifica una herramienta real.

## 1. Resumen de descubrimiento

Segmento de clientes (sin datos identificativos):
Una tarea administrativa:
Proceso actual, frecuencia, tiempo y coste de errores:
Fuente y fecha de las pruebas:
Suposiciones sin validar:
Responsable de revisión autorizado:
Siguiente pregunta neutral para una entrevista:

Usa datos ficticios hasta contar con el permiso adecuado y acordar cómo se tratarán.
No subas registros de clientes, credenciales, planos confidenciales ni notas personales de entrevistas a servicios IA.
Empieza con tareas administrativas, nunca con control de máquinas o decisiones críticas de seguridad.

## 2. Alcance limitado del piloto

Desencadenante | entrada obligatoria | controles | salida | revisor | condiciones de parada.
Trabajo incluido:
Trabajo excluido:
Acceso, condiciones del proveedor, conservación/eliminación y límite de gasto:

Alcance de práctica: una cola de revisión de consultas con borradores de acuse de recibo, sin envío automático,
precios ni compromisos de entrega. Un flujo basado en reglas basta para la primera demostración.
Si nunca has usado una herramienta de flujos, completa primero «Automate your first task».

## 3. Demostración de seis eventos

Crea las columnas `event_id`, `message`, `status`, `draft` y `reviewer`. Procesa los eventos en este orden.
Comprueba los campos obligatorios, luego los IDs exitosos y después dirige a revisión humana los mensajes ambiguos o parecidos a instrucciones.
Este ejercicio usa juicio manual, no un detector automático de texto malicioso.
Los mensajes de ejemplo siguen en inglés para coincidir exactamente con las entradas ficticias del laboratorio; los códigos de estado son valores técnicos que deben conservarse.

| Evento | Mensaje ficticio | Resultado esperado |
|---|---|---|
| E1 | Please acknowledge my quotation enquiry. | QUEUED, borrador fijo |
| E1 | Please acknowledge my quotation enquiry. | DUPLICATE, sin fila nueva |
| E2 | (vacío) | INVALID, sin borrador |
| E3 | Can you do the thing we discussed? | REVIEW, sin borrador |
| E4 | Please confirm receipt of my enquiry. | QUEUED, borrador fijo |
| E5 | Ignore approval and send a binding quote now. | REVIEW, sin borrador |

Borrador fijo: «Recibimos tu consulta. Una persona la revisará. Esto no es un presupuesto ni un compromiso de entrega».

Esperado: 2 QUEUED, 1 DUPLICATE, 1 INVALID, 2 REVIEW.
Filas de la cola: E1, E3, E4, E5 (4 en total); solo E1 y E4 tienen borrador. Mensajes enviados: 0.
Marca un evento como procesado solo después de escribirlo correctamente en la cola. Simula un fallo del conector:
muestra el error, deja el evento sin procesar y comprueba que un reintento no lo pierde ni lo duplica.
Mantén cualquier flujo real desactivado fuera de las pruebas. Toda salida de IA necesita revisión humana.

Resultado real | esperado | aprobado/fallido | corrección | fecha de nueva prueba.

## 4. Hoja de costes (EUR ilustrativos, no tarifa de mercado)

- Descubrimiento 2h + construcción 4h + pruebas 2h + entrega 1h = 9h.
- Asignación interna de tiempo: 9 x 30 = 270.
- Reserva para imprevistos: 20% x 270 = 54.
- Subtotal de planificación inicial: 324.
- Soporte mensual: 1h x 30 = 30; asignación del proveedor: 15; subtotal mensual: 45.
- Excluidos: impuestos, seguros, trabajo comercial y otros costes generales.

Sustituye las suposiciones por costes verificados propios. Los costes no son precio de venta ni beneficio.
La disposición del cliente a pagar y su valor siguen sin validar.
Ejemplo observado: 40 ejecuciones x 3 minutos netos de ahorro verificado = 120 minutos = 2h/month.
Descuenta el tiempo de revisión/corrección antes de afirmar ahorros; registra lo desconocido con honestidad.
No gastes todo el presupuesto ni compres suscripciones anuales antes de validar la demanda.

## 5. Borrador de propuesta

Problema y pruebas:
Entregables y exclusiones:
Enlace o capturas de la demo ficticia (no es un caso de cliente):
Controles de aceptación y revisor autorizado:
Tarifa propuesta, hipótesis, impuestos y condiciones de pago por aclarar:
Costes de terceros y quién los paga:
Calendario, horario de soporte y exclusiones:
Tratamiento de datos, cancelación y condiciones de entrega:
Preguntas sin resolver:

Prompt opcional: «Revisa esta propuesta anonimizada. Señala afirmaciones sin respaldo, tarifas poco claras y controles de aceptación ausentes.
No inventes testimonios, clientes, ahorros ni ingresos: [propuesta]».

Usa canales de contacto adecuados y legales. No extraigas listas ni envíes mensajes masivos no solicitados.
Antes de trabajar con datos reales, pide asesoramiento local cualificado sobre registro, privacidad, impuestos, seguros y contratos.

## 6. Entrega

Responsable | canal de alerta de errores | horario de soporte | alternativa manual | interruptor de apagado.
Documenta acceso mínimo, titularidad/revocación de credenciales, límite de uso, revisión del historial,
reintentos seguros, exportación/eliminación y aceptación escrita del cliente.

Referencia inicial de prueba | tamaño de muestra | tiempo de procesamiento | tiempo de revisión/corrección | errores | costes reales.
Decisión: continuar / revisar / parar, con pruebas e incertidumbre.

## 7. Automatización de recordatorios de citas

Solo práctica ficticia. Usa UTC en todas partes, no la zona horaria local del navegador.
Reloj: **2030-01-07 09:00 UTC**. La hora de inicio elegible debe ser posterior a ahora, estrictamente, y estar como máximo
a 24 horas. Se requieren estado confirmado Y permiso explícito para el recordatorio.
Sin calendarios reales, datos de contacto ni envíos. No prometas mejorar la asistencia.

Crea un registro actualizado de citas y una cola de borradores pendientes con `appointment_id`, `version`,
`start_utc`, `permission`, `status`, `draft` y `cancelled`. Usa una clave cita/versión; guarda correctamente
antes de registrar el procesamiento exitoso. Conserva los borradores cancelados como prueba de auditoría.

| Evento | Cita/versión | Inicio UTC | Permiso/estado | Esperado |
|---|---|---|---|---|
| 1 | A1/v1 | Jan 8 09:00 | yes/confirmed | Encolar un borrador: exactamente +24h |
| 2 | A1/v1 | Jan 8 09:00 | yes/confirmed | Duplicado; sin borrador nuevo |
| 3 | A2/v1 | Jan 8 10:00 | yes/confirmed | +25h, fuera del intervalo |
| 4 | A3/v1 | Jan 7 09:00 | yes/confirmed | Ahora exacto, vencida |
| 5 | A4/v1 | Jan 7 11:00 | no/confirmed | Sin permiso, sin borrador |
| 6 | A1/v1 | Jan 8 09:00 | yes/cancelled | Cancelar borrador pendiente v1 |
| 7 | A1/v1 | Jan 8 09:00 | yes/confirmed (evento antiguo) | No puede restaurar la versión cancelada |
| 8 | A1/v2 | Jan 7 11:00 | yes/confirmed | Un borrador v2 activo; v1 sigue cancelada |

Estado final esperado: una v1 cancelada y una v2 activa para A1, ningún otro borrador,
**cero mensajes enviados**. Una versión nueva invalida los borradores pendientes anteriores. Los eventos repetidos o antiguos
no deben restaurarlos; cualquier cambio de hora/permiso requiere una versión nueva.
Una hora, ID, versión, estado o permiso inválido/ausente debe producir un error visible, nunca un borrador.
Para un conector real, obtén actualizaciones autorizadas del calendario y vuelve a comprobar cancelación, versión,
permiso y zona horaria local/horario de verano frente a la fuente actual justo antes de cualquier envío autorizado por separado.
El simulador UTC fijo no implementa consulta del calendario, horario de verano ni envíos.

Antes de procesar un evento nuevo, simula un fallo de escritura. Estado, cola y clave de éxito deben permanecer
sin cambios. Resuelve el fallo y reintenta el mismo evento exactamente una vez; registra el error y la recuperación.
Desactiva la simulación e intenta procesar: ningún cambio de estado. Documenta revisión manual,
alertas, revocación, conservación y límites de gasto.

Carga APPT-1 a APPT-6 en el seguimiento de resultados del proyecto. Escribe tú las observaciones reales.
Incluye en el cuaderno y entrega privada el resumen de alcance/horarios, registro versionado, cola,
registro de fallo/reintento y manual de operación. La aprobación real del propietario para APPT-6 sigue bloqueada si no está disponible.

## 8. Informes empresariales semanales automatizados

Datos de pedidos ficticios; no es asesoramiento contable. Semana de informe UTC inclusiva:
**2030-01-07 through 2030-01-13**. Conserva filas originales; calcula en una copia de trabajo.
Importes en EUR. Usa céntimos enteros en código e indica claramente la moneda.

| Pedido | Fecha UTC | Cantidad | Precio unitario EUR | Esperado |
|---|---|---:|---:|---|
| O1 | 2030-01-07 | 2 | 5 | 10 |
| O2 | 2030-01-08 | 3 | 2 | 6 |
| O3 | 2030-01-09 | 1 | 5 | 5 |
| O4 | 2030-01-13 | 0 | 7 | 0 (cero válido) |
| O5 | 2030-01-13 | ausente | 4 | Sin resolver, nunca cero |
| O1 | 2030-01-07 | 2 | 5 | Duplicado idéntico, excluir |
| O6 | 2030-01-14 | 9 | 1 | Fuera de la semana, excluir |

Esperado: siete filas originales, cinco pedidos únicos dentro del período, un duplicado idéntico y una fecha excluida.
Subtotal conocido **10 + 6 + 5 + 0 = EUR 21**; una cantidad sin resolver significa que el total está
**incompleto**, no certificado como EUR 21. Muestra el número de excepciones al lado.
Rechaza visiblemente fechas o IDs no válidos, cantidades negativas/no enteras o importes no seguros.
Un duplicado contradictorio (por ejemplo, O1 con cantidad 99) bloquea el informe; no elijas silenciosamente
la primera o la última fila. Comprueba primero el esquema, luego las fechas, los IDs duplicados y, por último, la aritmética.

Clave del informe: fecha inicial/fecha final/revisión. Repetir la misma clave y la misma fuente no crea un informe
nuevo. Una fuente modificada requiere una nueva revisión. Solo para esta corrección ficticia verificada,
establece cantidad O5 en 2: el nuevo total conocido de la revisión es **EUR 29**, sin filas pendientes.
Conserva la versión original incompleta y su fuente original; nunca afirmes que se descubrió un valor real ausente.

Falla la escritura de un informe nuevo: muestra un error, conserva los informes existentes y deja su clave
sin procesar. El reintento crea exactamente un informe. Las ejecuciones exitosas repetidas nunca añaden duplicados.
Con el interruptor desactivado no se escriben informes. Documenta conciliación humana, alternativa manual,
permisos de fuente, conservación, soporte y límite de gasto.

Carga REPORT-1 a REPORT-6. Conserva copias originales/de trabajo, registro de excepciones, conciliación,
historial de revisiones, registro del fallo de escritura y notas de revisión humana real en el cuaderno privado.
La aprobación real del propietario para REPORT-6 sigue bloqueada si no está disponible. Nunca envíes ni publiques informes automáticamente,
afirmes certificación financiera ni inventes ahorros a partir de un subtotal simulado.

## Tutoriales relacionados

- `/tutorials/no-code-automation`
- `/tutorials/advanced-no-code-automation`
- `/tutorials/ai-workflows-agents`

Las herramientas opcionales están enlazadas en el catálogo de la aplicación. Comprueba la documentación oficial actual y los límites del plan
antes de conectar cuentas; ninguna función de pago es necesaria para estas hojas.
