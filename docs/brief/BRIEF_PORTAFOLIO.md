# Brief: rediseño del portafolio de Yeison García (yeison-dev.vercel.app)

Escrito el 24/10/2026 para una sesión nueva de Claude en la nube. Léelo completo antes de tocar código y mira todas las imágenes de `docs/brief/referencias/`.

## 1. Para qué existe esta página

Yeison hace **tiendas online y respuestas automáticas por WhatsApp** para negocios pequeños de Colombia que venden por Instagram y WhatsApp. El cliente típico es una dueña o un dueño de tienda de ropa, belleza, perfumería o accesorios, de 22 a 40 años, que contesta "¿precio?" todo el día desde el celular.

La gente llega desde sus reels:
- comentan **PRECIO**;
- les llega un mensaje automático con un botón a esta página;
- desde aquí deben escribirle por WhatsApp.

**La página tiene una sola tarea:** que esa persona piense "esto es justo lo que necesito, y este man lo hace bien" y toque WhatsApp.

Yeison no tiene clientes todavía. **La página es su primera venta:** si no sorprende, no convence. Por eso el trabajo tiene que verse hecho por un diseñador con criterio, no armado con una plantilla.

## 2. Diagnóstico de la versión actual (24/10/2026)

Lo bueno, y se queda:
- El titular abre con el dolor: "¿Se te va el día contestando "precio" por WhatsApp?".
- Las tres tiendas de demostración (SILLETA, GRANO y CEIBA) y la tienda real PAVOA, con celulares de muestra.
- El ejemplo de conversación del asistente.
- Precios claros, cómo trabaja y el precio de fundador.

Lo que no funciona:
1. **Parece plantilla.** Todo vive en tarjetas redondeadas iguales, con fondos lavanda, listas de chulos y bloques uno debajo del otro. Es el "kit de tarjetas" que se ve en miles de páginas hechas con IA. No hay nada memorable.
2. **No es la misma marca de los reels.** Los reels tienen fondo crema con grano, titulares Bricolage muy gruesos y una sola palabra en Fraunces cursiva con degradado cobalto. También tienen la pastilla cobalto con brillo, profundidad tipo Apple y el logo del espejo que sonríe. Quien llega desde un reel aterriza en otra marca. Mira `referencias/reel_*.jpg`.
3. **Demasiado texto.** El párrafo del inicio pasa de 90 palabras, y las descripciones de servicios y tiendas son largas. Esta gente lee en el celular, entre mensajes.
4. **Lo que vende está lejos.** La demostración del asistente, que es lo más poderoso, aparece en la mitad de la página y es una imagen quieta.
5. **Los precios en celular** son un carrusel de cuatro tarjetas densas que hay que deslizar. Cuesta comparar.

## 3. La idea que la hace sorprendente

**Que la página no explique el servicio: que lo demuestre.**

### El inicio sigue al reel
- Usa el mismo gancho, grande, con la cursiva cobalto en «precio»: "¿Estás cansado de responder «precio» todo el día?".
- Pegada a «precio» va la insignia cobalto de notificaciones, que cuenta de 1 a 99+ al cargar. Es la del reel: `referencias/reel_1_gancho_contador.jpg`.
- Debajo, una frase corta y el botón de WhatsApp.

### "Pruébalo tú" (la sección estrella)
- Un celular con el chat de una tienda. El visitante toca preguntas listas, como chips: "¿Precio?", "¿Hay talla M?", "¿Envían a Cali?", "¿Pagan contraentrega?".
- La tienda responde al instante: escribiendo… y luego la respuesta con la tarjeta del producto, el precio, las tallas, "Envío gratis" y "Pagas al recibir".
- Al final hay un botón "Comprar". El pedido le llega "al WhatsApp del dueño" como una notificación **"Pedido nuevo"** que sale del celular hacia el visitante, como en `referencias/reel_5_pedido_hacia_camara.jpg`.
- **Es una demostración con guion, sin IA ni servidor:** JavaScript con respuestas escritas a partir del catálogo de una tienda demo.
- Debe quedar claro que es un ejemplo. El texto pequeño dice: "Es una demostración: así contestaría tu tienda con tu catálogo".

### Las tiendas como vitrina, no como fichas
- Las demos se recorren como en el celular: capturas grandes, deslizables, cada una con su color.
- Una línea de texto por tienda, no un párrafo, y el botón "Abrir la tienda".

### Menos palabras, más prueba
Cada bloque responde una pregunta del cliente:
- ¿Qué me haces?
- ¿Cómo se ve?
- ¿Cuánto cuesta?
- ¿Cómo empezamos?

Nada más.

## 4. Sistema de marca (igual al de los reels)

**Colores:**
- crema `#F4F1EA` (fondo), con un degradado radial suave hacia `#FAF8F3` en el centro y `#E7E2D8` en los bordes;
- papel `#FAF8F3`;
- tinta `#1C1D20`;
- gris de apoyo `#8A847A`;
- **cobalto `#2742F5`**, el único acento;
- azul niebla `#E3E8FC`, solo para fondos puntuales y nunca a pantalla completa.

**Grano:** ruido de película al 5 % en multiply sobre el fondo crema (un `feTurbulence` en SVG basta).

**Tipografías:**
- **Bricolage Grotesque**: 800 con `opsz 96` en titulares, muy gruesa y con interletra negativa (−0,035em); 600 en textos de apoyo.
- **Fraunces** cursiva 700 con `opsz 144`: **una sola palabra clave por sección**, con degradado cobalto `#6C84FF → #2742F5 → #1A2DC4` y un destello que la cruza una vez.
- Nada de otras fuentes.

**Profundidad:**
- Sombras suaves en capas en los textos grandes, como en los reels.
- Botones y pastillas cobalto con brillo arriba (`inset 0 2px 1px rgba(255,255,255,.45)`) y sombra azul abajo.

**Logo:** el espejo que sonríe, en `img/marca/`, con el símbolo y el nombre. En la cabecera va el logo completo; el símbolo puede reaparecer como detalle con intención (por ejemplo, en el cierre).

**Movimiento:**
- Un solo momento orquestado al cargar: el gancho y el contador.
- Lo demás reacciona al usuario (tocar, deslizar) o entra discreto al hacer scroll.
- Respeta `prefers-reduced-motion` mostrando el estado final con un fundido corto; ya existe en el código.
- **Yeison tiene apagadas las animaciones de Windows.** Para revisarlo, emula `prefers-reduced-motion: no-preference`; si no, no verás el movimiento.

## 5. Lo que Yeison NO quiere (no negociable)

- El **look de plantilla o de IA**: tarjetas iguales con el mismo radio y la misma sombra, etiquetas en MAYÚSCULAS espaciadas encima de cada título, `A · B · C` como separador, "→" pegado a cada botón y numeritos 01/02/03 si no es una secuencia real.
- Subrayados que se dibujan bajo un título, líneas que tachan palabras y la cursiva fina y débil.
- **Pantallas completas en azul saturado.**
- **Chulos ✓ genéricos.** Solo valen los de círculo relleno con el chulo blanco, como en `referencias/gusta_fitness_onboarding.png`, y solo donde aporten.
- Testimonios, cifras o casos inventados. No hay clientes todavía: la página no puede fingir que los hay.
- Textos que suenen a vendedor o a IA ("lleva tu negocio al siguiente nivel", "soluciones integrales").

## 6. Lo que sí le gusta

- `referencias/gusta_petly_marketplace.png` y `referencias/gusta_fitness_onboarding.png` tienen:
  - un solo acento fuerte;
  - titulares cortos y gruesos;
  - tarjetas aireadas con fotos grandes;
  - botones en píldora a todo lo ancho;
  - aspecto de app nativa.
- Todo lo de los reels (`referencias/reel_*.jpg`): fondo crema, tipografía cinética, la pastilla PRECIO y la notificación de pedido.
- Efectos tomados de la comunidad (CodePen, css-tip.com) **adaptados a la marca**, con intención y no como adorno.

## 7. Cómo se escribe

- Español de Colombia, tuteando, en primera persona de Yeison ("te armo", "te muestro").
- Abre siempre con el problema del cliente, nunca con la promesa ni con la marca.
- Frases cortas: **máximo unas 25 palabras por bloque en el celular.** El texto bajo el titular, máximo 20.
- Nada de la estructura "Frase. Frase." de eslogan.
- No prometer resultados que no están medidos.

## 8. Contenido que se mantiene (datos reales)

**WhatsApp:** número `573007056457`. Cada botón lleva su propio mensaje ya escrito, como en la versión actual ("me interesa la Tienda Inicio", "quiero uno de los cupos con precio de fundador"…). Así Yeison sabe desde qué botón le escriben. Consérvalos y crea uno nuevo para "Pruébalo tú".

**Redes:**
- Instagram @mesa24g
- TikTok, YouTube y GitHub (los enlaces ya están en la página actual).

**Precios** (COP, 50 % para empezar y 50 % al entregar; Shopify y la mensualidad de la plataforma se pagan aparte; mantén las notas de la versión actual):

| Servicio | Precio |
|---|---|
| Tienda Inicio | $1.200.000 |
| Tienda Completa | desde $2.400.000 |
| Respuestas automáticas | $1.200.000 + $250.000/mes |
| Tienda + respuestas (combo) | $2.200.000 + $250.000/mes |
| Ajustes pequeños (si ya tienes tienda) | $350.000 |
| Revisión completa | $650.000 |

- **Precio de fundador:** 25 % menos para los 3 primeros clientes, a cambio de un testimonio.
- **Tiendas:** PAVOA (real, pavoa.com.co) y las demos SILLETA, GRANO y CEIBA, que están en `tiendas/`.
- **Cómo trabaja:** "Me escribes → te muestro qué haría (video gratis) → acordamos y arranco → revisas y pagas el resto".

En celular, los precios deben poder **compararse sin deslizar**, por ejemplo con una lista o un selector, en lugar de cuatro tarjetas densas.

## 9. Técnica

- Se mantiene el stack: **HTML, CSS y JavaScript sin frameworks**, desplegado en Vercel. Las tiendas de `tiendas/` no se tocan salvo que haga falta para enlazarlas.
- Primero el celular (390 px); después tableta y computador (1440 px).
- Rendimiento: imágenes en WebP con tamaño correcto y carga diferida, Lighthouse móvil de 90 o más en rendimiento y accesibilidad.
- Se conserva lo que ya funciona: Vercel Analytics, las páginas virtuales `/whatsapp/...` para medir los toques a WhatsApp y el `og:image`.

## 10. Cómo trabajar (con puntos de control)

1. **Lee y mira todo** (este documento, las referencias y la página actual) y resume en 5 líneas lo que entendiste.
2. **Propón dos direcciones para el inicio y para "Pruébalo tú"** como capturas reales (celular 390 y computador 1440), no como texto. **Espera a que Yeison elija** antes de construir el resto.
3. Construye la dirección elegida.
4. **Antes de decir que está listo, verifica y muestra pruebas:**
   - capturas de la página completa en 390 y 1440, con movimiento activado (emulando `prefers-reduced-motion: no-preference`);
   - una captura con movimiento reducido;
   - nada se sale de la pantalla, los precios están alineados y no hay errores en la consola;
   - cada botón de WhatsApp abre el número correcto con el mensaje;
   - la demostración "Pruébalo tú" funciona de principio a fin;
   - el resultado de Lighthouse en celular.
5. Entrega en un **PR** con las capturas en la descripción. **No lo unas a main**: lo revisa Yeison.

Si una decisión no está en este documento y cambia lo que se ve, **pregúntale a Yeison** antes de decidir por él.
