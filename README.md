# Power-Up de Trello: numeración secuencial de tarjetas

## Archivos
- `index.html`: página conector que Trello carga.
- `connector.js`: lógica (insignia con número, contador, botón "Renumerar").
- `icon.svg`: icono del botón.

## Puesta en marcha
1. Sube los 3 archivos a un hosting HTTPS estático (GitHub Pages, Netlify, Cloudflare Pages, Vercel...).
2. Entra en https://trello.com/power-ups/admin y pulsa **Create new Power-Up**.
3. Rellena nombre, workspace y, en **Iframe connector URL**, la URL pública de `index.html`.
4. En la pestaña **Capabilities** activa: `card-badges`, `card-detail-badges` y `board-buttons`.
5. Abre un tablero, ve a **Power-Ups > Custom** y añade el tuyo.

## Cómo funciona
- El contador vive en `board/shared/counter` y el número de cada tarjeta en `card/shared/seq`.
- Una tarjeta nueva recibe su número la primera vez que alguien abre el tablero con el Power-Up activo.
- "Renumerar tarjetas" asigna 1..N según el orden de listas y posiciones.

## Limitaciones
- Los Power-Ups corren en el navegador, no en un servidor: la asignación ocurre cuando alguien abre el tablero, no en el instante exacto de crear la tarjeta. Para eso haría falta un backend con webhooks.
- Si dos personas abren el tablero a la vez con tarjetas nuevas, podría haber un duplicado puntual (usa "Renumerar" para corregirlo).
- Alternativa más simple: Trello ya asigna `idShort` (número correlativo por tablero) a cada tarjeta. Se puede mostrar con el mismo código usando `t.card('idShort')`, sin contador propio.
