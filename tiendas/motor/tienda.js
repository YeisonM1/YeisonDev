/* Motor de tiendas de demostración (Yeison). Un solo código para las 3 marcas: cada tienda trae su datos.js (TIENDA)
   con su diseño (cabecera, portada, tarjetas, ficha y orden de secciones) y su tema.css; aquí se arma todo: encabezado,
   portada, catálogo con filtros, producto con reseñas, carrito, búsqueda, checkout de muestra (no cobra: arma el pedido
   y lo abre en WhatsApp, como le llegaría al dueño de la tienda) y páginas de marca. Sin librerías. */
(() => {
  const T = window.TIENDA;
  const D = { cabecera: "centrada", hero: "dividido", tarjeta: "clasica", ficha: "carrusel", categorias: "tarjetas", inicio: ["hero", "beneficios", "categorias", "destacados", "historia", "nuevos", "opiniones", "galeria"], ...T.diseno };
  const app = document.getElementById("app");
  const pagina = document.body.dataset.pagina;
  const params = new URLSearchParams(location.search);
  const CLAVE = `carrito_${T.id}`;
  const WA = "573007056457"; // WhatsApp de Yeison: el botón de las demos lleva a él
  document.body.classList.add(`cab-${D.cabecera}`, `tarjeta-${D.tarjeta}`, `ficha-${D.ficha}`, `cats-${D.categorias}`);

  // ---------- utilidades ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const plata = (n) => "$" + Math.round(n).toLocaleString("es-CO");
  const coma = (n) => n.toFixed(1).replace(".", ",");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // enlace a WhatsApp que se abre aparte y se mide por origen (ver js/medir.js)
  const waLink = (texto, origen) => `href="https://wa.me/${WA}${texto ? `?text=${encodeURIComponent(texto)}` : ""}" target="_blank" rel="noopener" data-wa="demo-${T.id}-${origen}"`;
  const producto = (id) => T.productos.find((p) => p.id === id);
  const descuento = (p) => (p.antes ? Math.round((1 - p.precio / p.antes) * 100) : 0);
  const estrellas = (r, tam = 14) => {
    let s = "";
    for (let i = 1; i <= 5; i++) {
      const lleno = Math.max(0, Math.min(1, r - (i - 1)));
      s += `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g${i}${tam}${Math.round(lleno * 10)}"><stop offset="${lleno}" stop-color="currentColor"/><stop offset="${lleno}" stop-color="currentColor" stop-opacity=".22"/></linearGradient></defs><path fill="url(#g${i}${tam}${Math.round(lleno * 10)})" d="M12 1.8l3.1 6.4 7 .9-5.1 4.9 1.3 7-6.3-3.4-6.3 3.4 1.3-7L1.9 9.1l7-.9z"/></svg>`;
    }
    return `<span class="estrellas" aria-label="${coma(r)} de 5 estrellas">${s}</span>`;
  };
  const icono = {
    bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .7.5l1 2.4c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.8 1.7.3.2.5.1.7-.1l1-1.2c.2-.3.5-.2.8-.1l2.3 1.1c.3.2.5.2.6.4.1.2.1.8-.2 1.5Z"/></svg>',
    camion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    cambio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13l-3-3M20 15H7l3 3"/></svg>',
    billete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
    hoja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19 13 11"/></svg>',
    corazon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4 10-10"/></svg>',
    mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  };

  // ---------- carrito (se guarda en este navegador) ----------
  const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { return []; } };
  const guardar = (c) => { try { localStorage.setItem(CLAVE, JSON.stringify(c)); } catch {} pintarContador(); };
  const agregar = (id, variante = "", cant = 1) => {
    const c = leer(); const ya = c.find((x) => x.id === id && x.variante === variante);
    if (ya) ya.cant += cant; else c.push({ id, variante, cant });
    guardar(c); abrirCarrito(); aviso(`${producto(id).nombre} se agregó a tu bolsa`);
  };
  const subtotal = (c = leer()) => c.reduce((s, x) => s + (producto(x.id)?.precio || 0) * x.cant, 0);
  const unidades = (c = leer()) => c.reduce((s, x) => s + x.cant, 0);

  // ---------- piezas comunes ----------
  const fotoTarjeta = (p) => `
      <a class="tarjeta-foto" href="producto.html?id=${p.id}">
        <img src="${p.imagenes[0]}" alt="${esc(p.nombre)}" loading="lazy">
        ${p.imagenes[1] ? `<img class="segunda" src="${p.imagenes[1]}" alt="" loading="lazy">` : ""}
        ${p.etiqueta ? `<span class="etiqueta">${esc(p.etiqueta)}</span>` : descuento(p) ? `<span class="etiqueta oferta">-${descuento(p)}%</span>` : ""}
      </a>`;
  const precioHTML = (p) => `<span class="tarjeta-precio"><b>${plata(p.precio)}</b>${p.antes ? `<s>${plata(p.antes)}</s>` : ""}</span>`;
  const tarjeta = (p) => {
    if (D.tarjeta === "minima") return `
    <article class="tarjeta">${fotoTarjeta(p)}
      <button class="rapido" data-agregar="${p.id}" aria-label="Agregar ${esc(p.nombre)} a la bolsa">${icono.mas}</button>
      <div class="tarjeta-info"><a class="tarjeta-nombre" href="producto.html?id=${p.id}">${esc(p.nombre)}</a>${precioHTML(p)}</div>
    </article>`;
    if (D.tarjeta === "bloque") return `
    <article class="tarjeta">${fotoTarjeta(p)}
      <div class="tarjeta-info">
        <div class="tarjeta-rating">${estrellas(p.rating, 13)}<span>${p.resenasTotal} reseñas</span></div>
        <a class="tarjeta-nombre" href="producto.html?id=${p.id}">${esc(p.nombre)}</a>
        <p class="tarjeta-corta">${esc(p.corta)}</p>
        <div class="tarjeta-pie">${precioHTML(p)}<button class="boton boton-chico" data-agregar="${p.id}">Agregar</button></div>
      </div>
    </article>`;
    return `
    <article class="tarjeta">${fotoTarjeta(p)}
      <button class="rapido" data-agregar="${p.id}" aria-label="Agregar ${esc(p.nombre)} a la bolsa">${icono.mas}</button>
      <div class="tarjeta-info">
        <span class="tarjeta-cat">${esc(p.categoria)}</span>
        <a class="tarjeta-nombre" href="producto.html?id=${p.id}">${esc(p.nombre)}</a>
        <div class="tarjeta-rating">${estrellas(p.rating, 12)}<span>(${p.resenasTotal})</span></div>
        ${precioHTML(p)}
      </div>
    </article>`;
  };

  const navEnlaces = () => `<a href="coleccion.html">Tienda</a>${T.categorias.map((c) => `<a href="coleccion.html?cat=${encodeURIComponent(c.nombre)}">${esc(c.nombre)}</a>`).join("")}<a href="nosotros.html">Nosotros</a>`;
  const encabezado = () => `
    <div class="demo-cinta">Tienda de demostración, diseñada por <a href="../../index.html">Yeison</a>. No vende ni cobra.</div>
    <div class="anuncio"><div class="anuncio-pista">${Array(6).fill(T.anuncios).flat().map((a) => `<span>${esc(a)}</span>`).join("")}</div></div>
    <header class="cabecera">
      <button class="icono-btn solo-movil" data-abrir-menu aria-label="Abrir menú">${icono.menu}</button>
      <a class="logo" href="index.html" aria-label="${esc(T.nombre)}, inicio">${T.logo}</a>
      <nav class="nav-principal" aria-label="Principal">${navEnlaces()}</nav>
      <div class="cabecera-acciones">
        <button class="icono-btn" data-abrir-busqueda aria-label="Buscar">${icono.lupa}</button>
        <button class="icono-btn bolsa-btn" data-abrir-carrito aria-label="Abrir bolsa">${icono.bolsa}<span class="contador" hidden>0</span></button>
      </div>
    </header>
    <div class="capa" data-cerrar></div>
    <aside class="panel menu-movil" aria-label="Menú">
      <div class="panel-cab"><span class="logo">${T.logo}</span><button class="icono-btn" data-cerrar aria-label="Cerrar">${icono.x}</button></div>
      <nav class="menu-lista">
        <a href="index.html">Inicio</a><a href="coleccion.html">Toda la tienda</a>
        ${T.categorias.map((c) => `<a href="coleccion.html?cat=${encodeURIComponent(c.nombre)}">${esc(c.nombre)}</a>`).join("")}
        <a href="nosotros.html">Nosotros</a><a href="nosotros.html#preguntas">Preguntas frecuentes</a>
      </nav>
    </aside>
    <aside class="panel carrito" aria-label="Tu bolsa"><div class="carrito-cont"></div></aside>
    <div class="busqueda" role="dialog" aria-label="Buscar productos">
      <div class="busqueda-caja">${icono.lupa}<input type="search" placeholder="Buscar en ${esc(T.nombre)}" aria-label="Buscar"><button class="icono-btn" data-cerrar aria-label="Cerrar">${icono.x}</button></div>
      <div class="busqueda-res"></div>
    </div>
    <div class="aviso" role="status" aria-live="polite"></div>`;

  const pie = () => `
    <section class="suscribir">
      <div class="contenedor suscribir-int">
        <div><h2>${esc(T.suscribir.titulo)}</h2><p>${esc(T.suscribir.texto)}</p></div>
        <form class="suscribir-form" data-suscribir><input type="email" required placeholder="Tu correo" aria-label="Tu correo"><button class="boton">Suscribirme</button></form>
      </div>
    </section>
    <footer class="pie">
      <div class="contenedor pie-grid">
        <div class="pie-marca"><span class="logo">${T.logo}</span><p>${esc(T.pieTexto)}</p>
          <div class="redes"><span title="Instagram de la marca (demostración)">IG</span><span title="TikTok de la marca (demostración)">TT</span><a ${waLink("", "pie-icono")} aria-label="WhatsApp">WA</a></div></div>
        <div><h3>Tienda</h3>${T.categorias.map((c) => `<a href="coleccion.html?cat=${encodeURIComponent(c.nombre)}">${esc(c.nombre)}</a>`).join("")}<a href="coleccion.html">Ver todo</a></div>
        <div><h3>Ayuda</h3><a href="nosotros.html#preguntas">Envíos y entregas</a><a href="nosotros.html#preguntas">Cambios y garantía</a><a href="nosotros.html#preguntas">Métodos de pago</a><a ${waLink("", "pie-escribenos")}>Escríbenos</a></div>
        <div><h3>${esc(T.nombre)}</h3><a href="nosotros.html">Nuestra historia</a><p class="pie-dato">${esc(T.ciudad)}</p><p class="pie-dato">Envíos a toda Colombia</p></div>
      </div>
      <div class="contenedor pie-pagos"><span>Contraentrega</span><span>Addi</span><span>PSE</span><span>Tarjetas</span><span>Nequi</span></div>
      <div class="contenedor pie-legal">© 2026 ${esc(T.nombre)}. Marca y tienda de demostración, diseño y desarrollo por <a href="../../index.html">Yeison</a>.</div>
    </footer>
    <a class="wa-flotante" ${waLink(`Hola Yeison, vi la tienda de demostración ${T.nombre} y quiero una así`, "flotante")} aria-label="Escribir por WhatsApp">${icono.wa}</a>`;

  // ---------- secciones de la portada (cada tienda elige cuáles y en qué orden) ----------
  const resenasTop = () => T.productos.flatMap((p) => p.resenas.map((r) => ({ ...r, producto: p }))).filter((r) => r.estrellas === 5 && r.texto.length > 60).slice(0, 6);
  const totalResenas = () => T.productos.reduce((s, p) => s + p.resenasTotal, 0).toLocaleString("es-CO");
  const cabSeccion = (titulo, enlace = true) => `<div class="seccion-cab"><h2>${esc(titulo)}</h2>${enlace ? `<a class="ver-todo" href="coleccion.html">Ver todo</a>` : ""}</div>`;
  const botonesHero = () => `<div class="hero-botones"><a class="boton" href="coleccion.html">${esc(T.hero.cta)}</a>${D.hero === "completo" ? "" : `<a class="boton boton-linea" href="nosotros.html">Conocer la marca</a>`}</div>`;

  const S = {
    hero: () => {
      const h = T.hero;
      if (D.hero === "completo") return `
      <section class="hero hero-completo">
        <div class="hero-fondos">${[h.imagen, ...(h.extra || [])].map((im, i) => `<img src="${im}" alt="${i ? "" : esc(h.alt)}">`).join("")}</div>
        <div class="contenedor hero-texto">${h.sobretitulo ? `<p class="hero-antetitulo">${esc(h.sobretitulo)}</p>` : ""}<h1>${h.titulo}</h1><p>${esc(h.texto)}</p>${botonesHero()}</div>
      </section>`;
      if (D.hero === "bloque") {
        const estrella = producto(h.producto) || T.productos[0];
        return `
      <section class="hero hero-bloque"><div class="contenedor hero-bloque-int">
        <div class="hero-texto"><h1>${h.titulo}</h1><p>${esc(h.texto)}</p>${botonesHero()}
          <a class="hero-prueba" href="producto.html?id=${estrella.id}#resenas">${estrellas(estrella.rating, 16)}<span><b>${coma(estrella.rating)}</b> en ${estrella.resenasTotal} reseñas del ${esc(estrella.nombre)}</span></a></div>
        <div class="hero-media"><img src="${h.imagen}" alt="${esc(h.alt)}">${h.sello ? `<span class="hero-sello">${esc(h.sello)}</span>` : ""}</div>
      </div></section>`;
      }
      return `
      <section class="hero">
        <div class="hero-media"><img src="${h.imagen}" alt="${esc(h.alt)}"></div>
        <div class="hero-texto">${h.sobretitulo ? `<p class="hero-antetitulo">${esc(h.sobretitulo)}</p>` : ""}<h1>${h.titulo}</h1><p>${esc(h.texto)}</p>${botonesHero()}</div>
      </section>`;
    },
    beneficios: () => `
      <section class="beneficios"><div class="contenedor beneficios-grid">
        ${T.beneficios.map((b) => `<div class="beneficio"><span class="beneficio-ico">${icono[b.icono] || icono.check}</span><div><b>${esc(b.titulo)}</b><p>${esc(b.texto)}</p></div></div>`).join("")}
      </div></section>`,
    categorias: () => `
      <section class="seccion contenedor seccion-categorias">
        ${cabSeccion(T.textos.categorias || "Compra por categoría", false)}
        <div class="categorias">${T.categorias.map((c) => `
          <a class="categoria" href="coleccion.html?cat=${encodeURIComponent(c.nombre)}"><span class="categoria-foto"><img src="${c.imagen}" alt="" loading="lazy"></span><span class="categoria-nombre">${esc(c.nombre)}</span>${D.categorias === "editorial" ? `<span class="categoria-texto">${esc(c.texto)}</span>` : ""}</a>`).join("")}
        </div>
      </section>`,
    destacados: () => `
      <section class="seccion contenedor">${cabSeccion(T.textos.destacados)}
        <div class="grilla">${T.productos.filter((p) => p.destacado).slice(0, 8).map(tarjeta).join("")}</div>
      </section>`,
    carril: () => `
      <section class="seccion seccion-carril"><div class="contenedor">${cabSeccion(T.textos.destacados)}</div>
        <div class="carril-productos">${T.productos.filter((p) => p.destacado).map(tarjeta).join("")}</div>
      </section>`,
    nuevos: () => {
      const nuevos = T.productos.filter((p) => p.etiqueta === "Nuevo").slice(0, 4);
      return nuevos.length ? `<section class="seccion contenedor">${cabSeccion(T.textos.nuevos || "Recién llegados")}<div class="grilla">${nuevos.map(tarjeta).join("")}</div></section>` : "";
    },
    historia: () => `
      <section class="historia">
        <div class="historia-media"><img src="${T.historia.imagen}" alt="" loading="lazy"></div>
        <div class="historia-texto"><h2>${esc(T.historia.titulo)}</h2><p>${esc(T.historia.texto)}</p>
          <a class="boton boton-linea" href="nosotros.html">${esc(T.historia.cta)}</a></div>
      </section>`,
    historiaCompleta: () => `
      <section class="historia-completa">
        <img src="${T.historia.imagen}" alt="" loading="lazy">
        <div class="contenedor"><div class="historia-completa-caja"><h2>${esc(T.historia.titulo)}</h2><p>${esc(T.historia.texto)}</p>
          <a class="boton boton-linea" href="nosotros.html">${esc(T.historia.cta)}</a></div></div>
      </section>`,
    cita: () => `
      <section class="cita contenedor"><blockquote>${esc(T.cita.texto)}</blockquote><p>${esc(T.cita.autor)}</p></section>`,
    rutina: () => `
      <section class="seccion rutina"><div class="contenedor">
        ${cabSeccion(T.rutina.titulo, false)}<p class="rutina-intro">${esc(T.rutina.texto)}</p>
        <ol class="rutina-pasos">${T.rutina.pasos.map((r) => { const p = producto(r.producto); return `
          <li class="rutina-paso"><a href="producto.html?id=${p.id}" class="rutina-foto"><img src="${p.imagenes[0]}" alt="" loading="lazy"></a>
            <h3>${esc(r.paso)}</h3><p>${esc(r.texto)}</p><a class="rutina-producto" href="producto.html?id=${p.id}">${esc(p.nombre)}, ${plata(p.precio)}</a></li>`; }).join("")}
        </ol></div></section>`,
    ingredientes: () => `
      <section class="ingredientes"><div class="contenedor ingredientes-int">
        <div class="ingredientes-media"><img src="${T.ingredientes.imagen}" alt="" loading="lazy"></div>
        <div><h2>${esc(T.ingredientes.titulo)}</h2>
          <dl>${T.ingredientes.lista.map((i) => `<div><dt>${esc(i.nombre)}</dt><dd>${esc(i.texto)}</dd></div>`).join("")}</dl></div>
      </div></section>`,
    lookbook: () => {
      const L = T.lookbook;
      return `
      <section class="lookbook">
        <div class="lookbook-media"><img src="${L.imagen}" alt="" loading="lazy"></div>
        <div class="lookbook-texto"><h2>${esc(L.titulo)}</h2><p>${esc(L.texto)}</p>
          <div class="lookbook-prendas">${L.productos.map(producto).map((p) => `
            <a class="lookbook-prenda" href="producto.html?id=${p.id}"><img src="${p.imagenes[0]}" alt="" loading="lazy"><span>${esc(p.nombre)}<b>${plata(p.precio)}</b></span></a>`).join("")}</div>
          <a class="boton" href="producto.html?id=${L.productos[0]}">Comprar el look</a></div>
      </section>`;
    },
    opiniones: () => `
      <section class="seccion opiniones"><div class="contenedor">
        <div class="seccion-cab"><h2>${esc(T.textos.opiniones || "Lo que dicen nuestros clientes")}</h2><span class="opiniones-total">${estrellas(T.ratingTienda, 16)} ${coma(T.ratingTienda)} de 5 en ${totalResenas()} reseñas de ejemplo</span></div>
        <div class="opiniones-carril" tabindex="0" aria-label="Opiniones de clientes">${resenasTop().map((r) => `
          <figure class="opinion">${estrellas(r.estrellas, 15)}<blockquote>“${esc(r.texto)}”</blockquote>
            <figcaption><b>${esc(r.nombre)}</b>, ${esc(r.ciudad)}<span>Compró <a href="producto.html?id=${r.producto.id}">${esc(r.producto.nombre)}</a></span></figcaption></figure>`).join("")}
        </div>
        <div class="carril-pie"><div class="carril-progreso" aria-hidden="true"><i></i></div>
          <div class="carril-nav"><button class="carril-btn" data-carril="-1" aria-label="Opinión anterior">${icono.flecha}</button><button class="carril-btn" data-carril="1" aria-label="Opinión siguiente">${icono.flecha}</button></div></div>
      </div></section>`,
    galeria: () => `
      <section class="seccion contenedor galeria-insta">
        <div class="seccion-cab"><h2>${esc(T.textos.galeria)}</h2><span class="insta-usuario">${esc(T.instagram)}</span></div>
        <div class="insta">${T.galeria.map((g) => `<span><img src="${g}" alt="" loading="lazy"></span>`).join("")}</div>
      </section>`,
  };
  const inicio = () => D.inicio.map((k) => S[k]()).join("");

  // ---------- páginas ----------
  const coleccion = () => {
    const cat = params.get("cat") || "";
    return `
      <section class="coleccion-cab contenedor">
        <nav class="migas" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><span>${cat ? esc(cat) : "Toda la tienda"}</span></nav>
        <h1>${cat ? esc(cat) : esc(T.textos.todos)}</h1>
        <p>${esc((T.categorias.find((c) => c.nombre === cat) || {}).texto || T.textos.coleccion)}</p>
      </section>
      <section class="contenedor coleccion">
        <div class="filtros">
          <div class="chips" role="group" aria-label="Categorías">
            <button class="chip ${cat ? "" : "activo"}" data-cat="">Todo</button>
            ${T.categorias.map((c) => `<button class="chip ${cat === c.nombre ? "activo" : ""}" data-cat="${esc(c.nombre)}">${esc(c.nombre)}</button>`).join("")}
          </div>
          <div class="filtros-der">
            <label class="selector"><span>Precio</span><select data-precio><option value="">Todos</option><option value="0-100000">Hasta $100.000</option><option value="100000-200000">$100.000 a $200.000</option><option value="200000-99999999">Más de $200.000</option></select></label>
            <label class="selector"><span>Ordenar</span><select data-orden><option value="vendidos">Más vendidos</option><option value="menor">Menor precio</option><option value="mayor">Mayor precio</option><option value="rating">Mejor calificados</option></select></label>
          </div>
        </div>
        <p class="conteo"></p>
        <div class="grilla grilla-coleccion"></div>
      </section>`;
  };

  const productoHTML = () => {
    const p = producto(params.get("id")) || T.productos[0];
    document.title = `${p.nombre} | ${T.nombre}`;
    const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: p.resenas.filter((r) => r.estrellas === n).length }));
    const rel = T.productos.filter((x) => x.id !== p.id && x.categoria === p.categoria).concat(T.productos.filter((x) => x.categoria !== p.categoria)).slice(0, 4);
    return `
      <nav class="migas contenedor" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><a href="coleccion.html?cat=${encodeURIComponent(p.categoria)}">${esc(p.categoria)}</a><span>/</span><span>${esc(p.nombre)}</span></nav>
      <section class="contenedor ficha">
        <div class="galeria">
          <div class="galeria-principal">${p.imagenes.map((im, i) => `<img src="${im}" alt="${esc(p.nombre)}, foto ${i + 1}" ${i ? 'loading="lazy"' : ""}>`).join("")}</div>
          <div class="galeria-minis">${p.imagenes.map((im, i) => `<button data-mini="${i}" class="${i ? "" : "activo"}" aria-label="Ver foto ${i + 1}"><img src="${im}" alt=""></button>`).join("")}</div>
        </div>
        <div class="ficha-info">
          <a class="ficha-cat" href="coleccion.html?cat=${encodeURIComponent(p.categoria)}">${esc(p.categoria)}</a>
          <h1>${esc(p.nombre)}</h1>
          <a class="ficha-rating" href="#resenas">${estrellas(p.rating, 16)}<span>${coma(p.rating)} (${p.resenasTotal} reseñas)</span></a>
          <div class="ficha-precio"><b>${plata(p.precio)}</b>${p.antes ? `<s>${plata(p.antes)}</s><span class="ahorro">Ahorras ${plata(p.antes - p.precio)}</span>` : ""}</div>
          <p class="cuotas">o 4 cuotas de ${plata(p.precio / 4)} sin interés con Addi</p>
          <p class="ficha-corta">${esc(p.corta)}</p>
          ${p.variantes ? `<div class="variantes"><span class="variantes-tit">${esc(p.variantes.nombre)}: <b data-var-elegida>${esc(p.variantes.opciones[0])}</b></span>
            <div class="variantes-ops">${p.variantes.opciones.map((o, i) => `<button class="variante ${i ? "" : "activo"}" data-variante="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>` : ""}
          <div class="comprar">
            <div class="cantidad"><button data-cant="-1" aria-label="Menos">${icono.menos}</button><input value="1" inputmode="numeric" aria-label="Cantidad"><button data-cant="1" aria-label="Más">${icono.mas}</button></div>
            <button class="boton boton-grande" data-agregar-ficha="${p.id}">Agregar a la bolsa</button>
          </div>
          <a class="boton boton-wa" ${waLink(`Hola Yeison, vi ${p.nombre} en la tienda de demostración ${T.nombre}`, "producto")}>${icono.wa} Comprar por WhatsApp</a>
          <ul class="garantias">
            <li>${icono.camion}<span><b>Envío gratis</b> desde ${plata(T.envioGratis)}, llega en 2 a 4 días</span></li>
            <li>${icono.billete}<span><b>Paga al recibir</b> en toda Colombia</span></li>
            <li>${icono.cambio}<span><b>Cambios fáciles</b> durante 30 días</span></li>
          </ul>
          <div class="acordeon">
            <details open><summary>Descripción</summary><p>${esc(p.descripcion)}</p></details>
            <details><summary>${esc(T.textos.detalles)}</summary><ul>${p.detalles.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></details>
            <details><summary>Envíos y cambios</summary><p>Despachamos en 24 horas hábiles. Medellín y área metropolitana en 1 a 2 días; resto del país en 2 a 5 días. Si algo no te convence, lo cambias sin costo durante 30 días.</p></details>
          </div>
        </div>
      </section>
      <section class="contenedor resenas" id="resenas">
        <div class="resenas-cab">
          <div class="resenas-resumen">
            <span class="resenas-nota">${coma(p.rating)}</span>${estrellas(p.rating, 20)}<span>${p.resenasTotal} reseñas de este producto</span><small class="nota-ejemplo">Reseñas de ejemplo para esta demostración</small>
            <button class="boton boton-linea" data-escribir>Escribir una reseña</button>
          </div>
          <div class="barras">${dist.map((d) => `<div class="barra"><span>${d.n} ★</span><i><em style="width:${p.resenas.length ? (d.c / p.resenas.length) * 100 : 0}%"></em></i><span>${Math.round((d.c / Math.max(1, p.resenas.length)) * p.resenasTotal)}</span></div>`).join("")}</div>
        </div>
        <div class="resenas-lista">${p.resenas.map((r) => `
          <article class="resena">
            <div class="resena-cab"><span class="avatar">${esc(r.nombre.split(" ").map((x) => x[0]).join("").slice(0, 2))}</span>
              <div><b>${esc(r.nombre)}</b><span>${esc(r.ciudad)}, ${esc(r.fecha)}</span></div>${r.verificada ? `<span class="verificada">${icono.check} Compra verificada</span>` : ""}</div>
            ${estrellas(r.estrellas, 14)}<h3>${esc(r.titulo)}</h3><p>${esc(r.texto)}</p>
          </article>`).join("")}
        </div>
      </section>
      <section class="seccion contenedor">${cabSeccion(T.textos.relacionados || "También te puede gustar", false)}<div class="grilla">${rel.map(tarjeta).join("")}</div></section>`;
  };

  const checkout = () => `
    <section class="contenedor checkout">
      <div class="checkout-form">
        <nav class="migas" aria-label="Pasos"><a href="#" data-abrir-carrito>Bolsa</a><span>/</span><b>Datos y pago</b></nav>
        <form data-pedido>
          <h2>Contacto</h2>
          <label class="campo"><span>Celular (WhatsApp)</span><input name="celular" required inputmode="tel" autocomplete="tel" placeholder="300 000 0000"></label>
          <label class="campo"><span>Correo (opcional)</span><input name="correo" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com"></label>
          <h2>Entrega</h2>
          <div class="campos-2"><label class="campo"><span>Nombre</span><input name="nombre" required autocomplete="given-name"></label><label class="campo"><span>Apellido</span><input name="apellido" required autocomplete="family-name"></label></div>
          <label class="campo"><span>Dirección</span><input name="direccion" required autocomplete="street-address" placeholder="Calle, número, barrio"></label>
          <div class="campos-2"><label class="campo"><span>Ciudad</span><input name="ciudad" required autocomplete="address-level2" placeholder="Medellín"></label><label class="campo"><span>Departamento</span><input name="departamento" required autocomplete="address-level1" placeholder="Antioquia"></label></div>
          <h2>Pago</h2>
          <div class="pagos">
            <label class="pago"><input type="radio" name="pago" value="Contraentrega (efectivo al recibir)" checked><span><b>Pago contraentrega</b><small>Pagas en efectivo cuando recibes</small></span></label>
            <label class="pago"><input type="radio" name="pago" value="Addi (cuotas)"><span><b>Addi</b><small>Hasta 4 cuotas sin interés</small></span></label>
            <label class="pago"><input type="radio" name="pago" value="Pago en línea (PSE, tarjeta o Nequi)"><span><b>PSE, tarjeta o Nequi</b><small>Pago en línea seguro</small></span></label>
          </div>
          <button class="boton boton-grande boton-ancho">${icono.wa} Enviar pedido por WhatsApp</button>
          <p class="nota-demo">Es una tienda de demostración, así que no se cobra nada y el pedido llega a mi WhatsApp para que veas cómo lo recibiría el dueño de la tienda.</p>
        </form>
      </div>
      <aside class="checkout-resumen"><h2>Tu pedido</h2><div class="resumen-cont"></div></aside>
    </section>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-tit"><div class="modal-caja">
      <span class="modal-ico">${icono.check}</span><h2 id="modal-tit">Tu pedido salió para WhatsApp</h2>
      <p>Así le llega al dueño de la tienda, con todo lo que necesita para despachar y sin tener que preguntarle nada más al cliente.</p>
      <pre class="modal-msj"></pre>
      <a class="boton" data-abrir-pedido target="_blank" rel="noopener" data-wa="demo-${T.id}-pedido-reabrir">${icono.wa} Abrir el pedido en WhatsApp</a>
      <a class="boton boton-linea" ${waLink(`Hola Yeison, probé el checkout de ${T.nombre} y quiero una tienda así`, "pedido-quiero")}>Quiero una tienda así</a>
      <a class="ver-todo" href="index.html">Volver a la tienda</a></div></div>`;

  // pedido armado para WhatsApp: productos con su variante, cantidades, total y datos de entrega
  const mensajePedido = (d) => {
    const c = leer(); const sub = subtotal(c); const envio = sub >= T.envioGratis ? 0 : T.costoEnvio;
    const lineas = c.map((x, i) => {
      const p = producto(x.id);
      const detalle = [x.variante ? `${p.variantes ? p.variantes.nombre : "Opción"}: ${x.variante}` : "", `Cantidad: ${x.cant}`, plata(p.precio * x.cant)].filter(Boolean).join(" · ");
      return `*${i + 1}. ${p.nombre}*\n${detalle}`;
    });
    return [
      `Pedido de prueba desde la demo de ${T.nombre}`, "",
      `Hola ${T.nombre}, quiero hacer este pedido:`, "",
      lineas.join("\n\n"), "",
      `Subtotal: ${plata(sub)}`, `Envío: ${envio ? plata(envio) : "Gratis"}`, `*Total: ${plata(sub + envio)}*`, "",
      `*Nombre:* ${d.get("nombre")} ${d.get("apellido")}`,
      `*Celular:* ${d.get("celular")}`,
      `*Ciudad:* ${d.get("ciudad")}, ${d.get("departamento")}`,
      `*Dirección:* ${d.get("direccion")}`,
      d.get("correo") ? `*Correo:* ${d.get("correo")}` : null,
      `*Forma de pago:* ${d.get("pago")}`,
    ].filter((l) => l !== null).join("\n");
  };

  const nosotros = () => `
    <section class="nosotros-hero"><img src="${T.nosotros.imagen}" alt=""><div class="contenedor"><h1>${esc(T.nosotros.titulo)}</h1></div></section>
    <section class="contenedor nosotros-texto">${T.nosotros.parrafos.map((x) => `<p>${esc(x)}</p>`).join("")}</section>
    <section class="contenedor valores">${T.nosotros.valores.map((v) => `<div class="valor"><span class="beneficio-ico">${icono[v.icono] || icono.check}</span><h3>${esc(v.titulo)}</h3><p>${esc(v.texto)}</p></div>`).join("")}</section>
    <section class="contenedor preguntas" id="preguntas"><h2>Preguntas frecuentes</h2>${T.faq.map((f) => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join("")}</section>`;

  // ---------- montar ----------
  const cuerpo = { inicio, coleccion, producto: productoHTML, checkout, nosotros }[pagina] || inicio;
  if (pagina !== "producto") document.title = `${T.nombre} | ${T.titulos[pagina] || T.eslogan}`;
  app.innerHTML = `${encabezado()}<main>${cuerpo()}</main>${pie()}`;

  // ---------- comportamiento ----------
  function pintarContador() { const n = unidades(); $$(".contador").forEach((el) => { el.textContent = n; el.hidden = !n; }); }
  function aviso(t) { const a = $(".aviso"); if (!a) return; a.textContent = t; a.classList.add("ver"); clearTimeout(aviso.t); aviso.t = setTimeout(() => a.classList.remove("ver"), 2600); }
  const cerrarTodo = () => document.body.classList.remove("ver-carrito", "ver-menu", "ver-busqueda");
  function abrirCarrito() { pintarCarrito(); document.body.classList.add("ver-carrito"); }
  function pintarCarrito() {
    const c = leer(); const cont = $(".carrito-cont"); if (!cont) return;
    const falta = Math.max(0, T.envioGratis - subtotal(c));
    cont.innerHTML = `
      <div class="panel-cab"><h2>Tu bolsa (${unidades(c)})</h2><button class="icono-btn" data-cerrar aria-label="Cerrar">${icono.x}</button></div>
      <div class="envio-barra"><p>${falta ? `Te faltan <b>${plata(falta)}</b> para el envío gratis` : "<b>¡Tu envío es gratis!</b>"}</p><i><em style="width:${Math.min(100, (subtotal(c) / T.envioGratis) * 100)}%"></em></i></div>
      ${c.length ? `<ul class="carrito-lista">${c.map((x, i) => { const p = producto(x.id); return `
        <li><img src="${p.imagenes[0]}" alt=""><div><a href="producto.html?id=${p.id}">${esc(p.nombre)}</a>${x.variante ? `<small>${esc(x.variante)}</small>` : ""}
          <div class="cantidad chica"><button data-linea="${i}" data-delta="-1" aria-label="Menos">${icono.menos}</button><span>${x.cant}</span><button data-linea="${i}" data-delta="1" aria-label="Más">${icono.mas}</button></div></div>
          <div class="carrito-der"><b>${plata(p.precio * x.cant)}</b><button class="quitar" data-quitar="${i}">Quitar</button></div></li>`; }).join("")}</ul>
        <div class="carrito-pie"><div class="carrito-total"><span>Subtotal</span><b>${plata(subtotal(c))}</b></div><p>Impuestos incluidos. Envío calculado al pagar.</p>
          <a class="boton boton-grande boton-ancho" href="checkout.html">Finalizar compra</a></div>`
      : `<div class="carrito-vacio"><p>Tu bolsa está vacía.</p><a class="boton" href="coleccion.html">Ver productos</a></div>`}`;
    const r = $(".resumen-cont");
    if (r) r.innerHTML = c.length ? `${c.map((x) => { const p = producto(x.id); return `<div class="resumen-item"><span class="resumen-img"><img src="${p.imagenes[0]}" alt=""><i>${x.cant}</i></span><span>${esc(p.nombre)}${x.variante ? `<small>${esc(x.variante)}</small>` : ""}</span><b>${plata(p.precio * x.cant)}</b></div>`; }).join("")}
      <div class="resumen-linea"><span>Subtotal</span><span>${plata(subtotal(c))}</span></div><div class="resumen-linea"><span>Envío</span><span>${subtotal(c) >= T.envioGratis ? "Gratis" : plata(T.costoEnvio)}</span></div>
      <div class="resumen-linea total"><span>Total</span><b>${plata(subtotal(c) + (subtotal(c) >= T.envioGratis ? 0 : T.costoEnvio))}</b></div>` : `<p>Tu bolsa está vacía. <a href="coleccion.html">Ver productos</a></p>`;
  }

  function pintarColeccion() {
    const g = $(".grilla-coleccion"); if (!g) return;
    const cat = ($(".chip.activo") || {}).dataset?.cat || "";
    const [min, max] = ($("[data-precio]").value || "0-99999999").split("-").map(Number);
    const orden = $("[data-orden]").value;
    let lista = T.productos.filter((p) => (!cat || p.categoria === cat) && p.precio >= min && p.precio <= max);
    lista.sort({ vendidos: (a, b) => b.resenasTotal - a.resenasTotal, menor: (a, b) => a.precio - b.precio, mayor: (a, b) => b.precio - a.precio, rating: (a, b) => b.rating - a.rating }[orden]);
    $(".conteo").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
    g.innerHTML = lista.length ? lista.map(tarjeta).join("") : `<p class="sin-res">No hay productos con ese filtro.</p>`;
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a"); if (!t) { if (e.target.closest("[data-cerrar]")) cerrarTodo(); return; }
    if (t.matches("[data-cerrar]")) { cerrarTodo(); return; }
    if (t.matches("[data-abrir-carrito]")) { e.preventDefault(); abrirCarrito(); return; }
    if (t.matches("[data-abrir-menu]")) { document.body.classList.add("ver-menu"); return; }
    if (t.matches("[data-abrir-busqueda]")) { document.body.classList.add("ver-busqueda"); setTimeout(() => $(".busqueda input").focus(), 50); return; }
    if (t.matches("[data-agregar]")) { const p = producto(t.dataset.agregar); agregar(p.id, p.variantes ? p.variantes.opciones[0] : ""); return; }
    if (t.matches("[data-agregar-ficha]")) {
      const v = $(".variante.activo"); const n = Math.max(1, parseInt($(".cantidad input").value) || 1);
      agregar(t.dataset.agregarFicha, v ? v.dataset.variante : "", n); return;
    }
    if (t.matches("[data-variante]")) { $$(".variante").forEach((b) => b.classList.toggle("activo", b === t)); $("[data-var-elegida]").textContent = t.dataset.variante; return; }
    if (t.matches("[data-cant]")) { const i = $(".cantidad input"); i.value = Math.max(1, (parseInt(i.value) || 1) + Number(t.dataset.cant)); return; }
    if (t.matches("[data-mini]")) {
      const gp = $(".galeria-principal"); const i = Number(t.dataset.mini);
      gp.scrollTo({ left: gp.clientWidth * i, behavior: "smooth" }); $$("[data-mini]").forEach((b) => b.classList.toggle("activo", b === t)); return;
    }
    if (t.matches("[data-linea]")) { const c = leer(); const l = c[t.dataset.linea]; l.cant += Number(t.dataset.delta); if (l.cant < 1) c.splice(t.dataset.linea, 1); guardar(c); pintarCarrito(); return; }
    if (t.matches("[data-quitar]")) { const c = leer(); c.splice(t.dataset.quitar, 1); guardar(c); pintarCarrito(); return; }
    if (t.matches("[data-cat]")) { $$(".chip").forEach((b) => b.classList.toggle("activo", b === t)); history.replaceState(null, "", t.dataset.cat ? `?cat=${encodeURIComponent(t.dataset.cat)}` : "coleccion.html"); pintarColeccion(); return; }
    if (t.matches("[data-carril]")) { const c = $(".opiniones-carril"); const paso = c.firstElementChild ? c.firstElementChild.offsetWidth + 18 : c.clientWidth; c.scrollBy({ left: paso * Number(t.dataset.carril), behavior: "smooth" }); return; }
    if (t.matches("[data-escribir]")) { aviso("En la tienda real, aquí el cliente escribe su reseña y sube fotos."); return; }
  });
  document.addEventListener("change", (e) => { if (e.target.matches("[data-precio], [data-orden]")) pintarColeccion(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarTodo(); });
  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-suscribir]")) { e.preventDefault(); e.target.reset(); aviso("¡Listo! Te avisaremos de lanzamientos (demostración)."); }
    if (e.target.matches("[data-pedido]")) {
      e.preventDefault(); if (!leer().length) { aviso("Agrega un producto a la bolsa primero."); return; }
      const texto = mensajePedido(new FormData(e.target));
      const url = `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;
      $(".modal-msj").textContent = texto; $("[data-abrir-pedido]").href = url;
      if (window.medirWhatsApp) window.medirWhatsApp(`demo-${T.id}-pedido`);
      const w = window.open(url, "_blank"); if (w) w.opener = null;
      guardar([]); pintarCarrito(); $(".modal").classList.add("ver");
    }
  });
  const bi = $(".busqueda input");
  if (bi) bi.addEventListener("input", () => {
    const q = bi.value.trim().toLowerCase(); const r = $(".busqueda-res");
    const lista = q ? T.productos.filter((p) => (p.nombre + " " + p.categoria + " " + p.corta).toLowerCase().includes(q)).slice(0, 6) : [];
    r.innerHTML = q ? (lista.length ? lista.map((p) => `<a class="busqueda-item" href="producto.html?id=${p.id}"><img src="${p.imagenes[0]}" alt=""><span>${esc(p.nombre)}<small>${esc(p.categoria)}</small></span><b>${plata(p.precio)}</b></a>`).join("") : `<p>No encontramos "${esc(q)}".</p>`) : "";
  });
  const gp = $(".galeria-principal");
  if (gp) gp.addEventListener("scroll", () => { const i = Math.round(gp.scrollLeft / gp.clientWidth); $$("[data-mini]").forEach((b, k) => b.classList.toggle("activo", k === i)); }, { passive: true });
  const carril = $(".opiniones-carril");
  if (carril) {
    const avance = () => {
      const max = carril.scrollWidth - carril.clientWidth, vis = carril.clientWidth / carril.scrollWidth;
      const barra = $(".carril-progreso i"); barra.style.width = vis * 100 + "%"; barra.style.transform = `translateX(${max > 0 ? (carril.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`;
      $$("[data-carril]").forEach((b) => { b.disabled = b.dataset.carril === "-1" ? carril.scrollLeft < 4 : carril.scrollLeft > max - 4; });
    };
    carril.addEventListener("scroll", avance, { passive: true }); addEventListener("resize", avance); avance();
  }
  if (pagina === "coleccion") pintarColeccion();
  pintarContador(); pintarCarrito();
  const cab = $(".cabecera");
  if (cab) addEventListener("scroll", () => cab.classList.toggle("bajado", scrollY > 40), { passive: true });
})();
