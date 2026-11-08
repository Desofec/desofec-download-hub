# Kit de Excel: limpieza de datos y comprobación de conversión de PDF a Excel

De Desofec AI Studio. Usa Excel o Google Sheets; las funciones IA de pago son opcionales.

Los seis IDs originales de lecciones y el ejercicio original de cinco pedidos que aparece abajo no cambian.
Después de los fundamentos, completa los tres ejercicios de servicio en orden. Usa solo datos ficticios.
El laboratorio está en `/business-launchpad/spreadsheet-lab`; elige `ai-spreadsheets` en el espacio de trabajo privado.
Sin cargas, OCR automático, modelo IA, asesoramiento financiero real ni guardado automático en la cuenta.
Los CSV descargados son datos compatibles con Excel, no archivos XLSX con hojas o fórmulas.

## Importar en A1

Importa los datos separados por comas en cuatro columnas. Conserva Raw y trabaja sobre una copia.

```csv
Order,Item,Quantity,UnitPrice
A1,Notebook,2,5
A2,Pen,3,2
A3,Notebook,1,5
A4,Pen,0,2
A5,Folder,,4
```

Los encabezados y datos CSV permanecen en inglés para coincidir con el laboratorio; consérvalos sin cambios.

## Calcular

Escribe `Total` en E1. En E2, copia la fórmula hasta E6:

```text
=IF(AND(ISNUMBER(C2),ISNUMBER(D2)),C2*D2,"REVIEW")
```

Esperado: 10, 6, 5, 0, REVIEW.
Se muestran nombres de funciones y comas en inglés; adapta los nombres y separadores a tu configuración regional sin cambiar los resultados.

## Conciliar

- `=SUM(E2:E6)` debe dar 21: un subtotal conocido, no un total completo.
- `=COUNTIF(E2:E6,"REVIEW")` debe dar 1.
- Valor conocido de Notebook: 15. Pen: 6. Folder: sin resolver, no cero.
- Grafica los valores conocidos con base cero, unidades monetarias de práctica y la nota «A5 Folder unresolved».

## Entrega

Guarda Raw, Working, Summary y Notes. Registra fuente, configuración regional de fórmulas, controles y la fila sin resolver. Vuelve a abrir el archivo y verifica los resultados.
Usa solo datos ficticios o debidamente autorizados. Comprueba tú las sugerencias de IA.

## Proyecto de servicio 1: limpieza de datos en Excel

Conserva esta tabla Raw de siete filas; duplícala como Working antes de editar nada.

```csv
Order,Item,DateUTC,Quantity,UnitPriceEUR
 A1 , Notebook ,2030/01/07,2,5
A2,Pen,2030-01-08,3,2
A3,Notebook,2030-01-09,1,5
A4,Pen,2030-01-13,0,2
A5,Folder,2030-01-13,,4
A1,Notebook,2030-01-07,2,5
A6,Folder,01/02/2030,1,4
```

Quita los espacios y convierte la fecha inequívoca `YYYY/MM/DD` a `YYYY-MM-DD`. Compara todos los
campos antes de eliminar un ID repetido idéntico. Esperado: siete filas originales, seis filas de trabajo
únicas y un duplicado eliminado. Un duplicado contradictorio debe bloquear la limpieza hasta aclarar la fuente,
no descartarse silenciosamente.

Conserva dos excepciones: cantidad ausente en A5 y fecha ambigua en A6. No deduzcas día/mes según la
configuración regional de tu ordenador, no rellenes valores ausentes ni trates lo desconocido como cero.
A4 con cero es válido. Registra valor anterior, nuevo valor, motivo y excepción pendiente para cada cambio.
Vuelve a abrir el CSV exportado en Excel/Sheets y comprueba seis filas, tipos numéricos y celdas vacías.
CSV no contiene fórmulas ni varias hojas; guarda aparte tu libro de trabajo real.

## Proyecto de servicio 2: comprobar la conversión de PDF a Excel

Descarga `/business-launchpad/spreadsheet-lab/source.pdf`. Es un PDF real, de una página y basado en texto,
con los cinco pedidos originales, fechas e importes en EUR.
El laboratorio proporciona una transcripción errónea: cantidad A2 es 8 en vez de 3 y el espacio en blanco
de A5 se rellenó incorrectamente con cero. Compara todas las filas y celdas, no solo el subtotal.
Corrige A2 a 3 y borra A5; el número de filas de origen sigue siendo cinco y se conserva el cero de A4.

Conserva el PDF original, referencias a páginas, extracción no verificada, transcripción corregida y registro
de correcciones. Describe honestamente el método: demo proporcionada, entrada manual o herramienta externa autorizada.
Esta aplicación no sube PDF, no ejecuta OCR ni afirma que la conversión sea perfecta.
Las páginas escaneadas, celdas combinadas, filas partidas y caracteres ambiguos requieren comprobación humana aparte.
Las celdas realmente desconocidas siguen sin resolver hasta que la persona propietaria de la fuente aporte pruebas.

## Proyecto de servicio 3: informes empresariales en Excel

Usa las cinco filas originales de la fuente, no las seis filas limpiadas. El período UTC inclusivo es
del 2030-01-07 al 2030-01-13. Aplica el filtro de fechas antes de sumar.
Concilia 10 + 6 + 5 + 0 = EUR 21; una cantidad sin resolver significa que el total está incompleto.
Subtotal conocido de Notebook: EUR 15; Pen: EUR 6; Folder: desconocido. No representes Folder como cero.

Crea hojas Raw, Working, Summary y Notes. Registra revisión de la fuente, período, moneda,
idioma/separador de fórmulas, cambios y una fila sin resolver. Usa un gráfico con base cero de valores conocidos,
acompañado por una tabla de texto accesible y una nota visible sobre el valor ausente.
Si informas las seis filas limpiadas, la fecha ambigua de A6 es una segunda excepción sin resolver:
no la excluyas silenciosamente ni des a entender que el informe está completo. Vuelve a abrir el libro y revisa
las fórmulas. Este ejemplo no demuestra tendencias empresariales, ingresos reales, corrección fiscal ni ahorros verificados.

## Propuesta privada, revisión y entrega

Crea un proyecto de hojas de cálculo en `/business-launchpad/projects?path=ai-spreadsheets`.
Conserva los tres ejercicios en su resumen y cuaderno. Define un alcance limitado: limpieza y comprobación
de fuentes, un informe y una ronda de corrección. Enumera formatos de entrada, límites de filas/páginas,
exclusiones, plazos, permisos de fuente, conservación/eliminación, revisor humano,
costes de proveedor e incógnitas. No prometas OCR perfecto, ingresos ni certificación financiera.

Recarga los resultados del proyecto y carga expresamente SHEET-1 a SHEET-7. Empiezan pendientes;
escribe tú las observaciones reales. Registra correcciones y nuevas pruebas. La aprobación real ausente del propietario
queda **bloqueada**, no aprobada. La autorrevisión del Centro de revisión evalúa texto copiado,
no archivos externos. Una fuente ficticia que coincide no es aprobación del cliente.

Entrega privada: Raw y Working, PDF original, CSV corregido, libro real, Summary, Notes,
registro de excepciones/correcciones, revisión de fuente, comprobaciones reales al reabrir y próxima revisión.
Usa material ficticio/anonimizado. Las copias de cuenta contienen pruebas del proyecto escritas solo después del consentimiento;
los archivos PDF, CSV y XLSX no se suben automáticamente. Borra las descargas por separado.

## Referencias oficiales de herramientas

- https://support.microsoft.com/en-gb/excel/copilot/get-started-with-copilot-in-excel
- https://workspace.google.com/products/sheets/
- https://workspace.google.com/resources/spreadsheet-ai/

Capacidades básicas comprobadas en documentación oficial indexada el 2026-11-05.
La disponibilidad de IA depende de la suscripción y la configuración. No se necesita una función IA de pago para estos ejercicios.
