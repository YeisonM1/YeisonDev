/* Movimiento e interacción del portafolio: el gancho (la insignia cuenta de 1 a 99+ y un destello cruza «precio»),
   la demostración "Pruébalo tú", las entradas discretas al hacer scroll y los puntos de la vitrina de tiendas.
   La demo es un guion escrito a partir del catálogo de CEIBA (tiendas/ceiba/datos.js): Conjunto Laureles a
   $329.000, tallas XS a XL, envío gratis desde $200.000, contraentrega, Medellín en 1 a 2 días. Sin IA ni servidor. */
(() => {
    window.revelaLista = true; // el <head> muestra todo si este archivo no llega
    const reducido = matchMedia("(prefers-reduced-motion: reduce)");
    const quieto = () => reducido.matches;
    const espera = (ms) => new Promise((r) => setTimeout(r, quieto() ? Math.min(ms, 300) : ms));

    /* ---------- gancho ---------- */
    const insignia = document.querySelector(".inicio .insignia");
    if (insignia && !quieto()) {
        const cuenta = insignia.querySelector(".cuenta");
        const clave = insignia.closest(".con-insignia").querySelector(".clave");
        cuenta.textContent = "1";
        setTimeout(() => {
            insignia.classList.add("brota");
            const t0 = performance.now(), dur = 1500;
            let previo = 1;
            const paso = (ahora) => {
                const t = Math.min(1, (ahora - t0) / dur);
                const n = Math.round(1 + 98 * t * t * t); // empieza lento y se acelera, como mensajes que se acumulan
                if (n !== previo) {
                    cuenta.textContent = n;
                    previo = n;
                    if (ahora - t0 > 420 && t < .6) insignia.animate([{ scale: 1.13 }, { scale: 1 }], { duration: 170, easing: "ease-out" });
                }
                if (t < 1) return requestAnimationFrame(paso);
                cuenta.textContent = "99+";
                insignia.animate([{ scale: 1 }, { scale: 1.2 }, { scale: 1 }], { duration: 440, easing: "cubic-bezier(.34,1.45,.64,1)" });
                clave.classList.add("destella");
            };
            requestAnimationFrame(paso);
        }, 650);
    }

    /* ---------- entradas al hacer scroll: bloques, palabras clave (destello) y el símbolo del cierre ---------- */
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add(e.target.matches(".clave") ? "destella" : "visto");
            io.unobserve(e.target);
        }), { threshold: .2, rootMargin: "0px 0px -6% 0px" });
        document.querySelectorAll(".revela, .simbolo").forEach((el) => io.observe(el));
        if (!quieto()) document.querySelectorAll(".clave[data-destello]").forEach((el) => io.observe(el));
    } else document.documentElement.classList.add("sin-revela");

    /* ---------- vitrina: puntos que siguen el deslizamiento en el celular ---------- */
    const vitrina = document.querySelector(".vitrina"), puntos = document.querySelector(".vitrina-puntos");
    if (vitrina && puntos) {
        const tiendas = [...vitrina.children];
        tiendas.forEach((_, i) => puntos.append(Object.assign(document.createElement("i"), { className: i ? "" : "on" })));
        vitrina.addEventListener("scroll", () => {
            const paso = tiendas[1].offsetLeft - tiendas[0].offsetLeft;
            const activo = Math.min(tiendas.length - 1, Math.round(vitrina.scrollLeft / paso));
            [...puntos.children].forEach((p, k) => p.classList.toggle("on", k === activo));
        }, { passive: true });
    }

    /* ---------- "Pruébalo tú" ---------- */
    const GUION = { // [primera respuesta (con la tarjeta del producto), respuestas siguientes]
        precio: ["¡Hola! Está en $329.000 y el envío es gratis.", "Está en $329.000 y el envío es gratis."],
        envio: ["¡Hola! Sí, a Medellín llega en 1 a 2 días y el envío es gratis.", "Sí, a Medellín llega en 1 a 2 días y el envío es gratis."],
        talla: ["¡Hola! Sí, hay en M, y también en XS, S, L y XL.", "Sí, hay en M. También en XS, S, L y XL."],
        pago: ["¡Hola! Sí, pagas cuando te llegue, en toda Colombia.", "Sí, pagas cuando te llegue. También puedes pagar con Nequi o tarjeta."],
    };
    const raiz = document.querySelector("[data-demo]");
    if (!raiz) return;
    const cel = raiz.querySelector(".cel");
    const hilo = raiz.querySelector(".chat-hilo");
    const estado = raiz.querySelector(".chat-estado");
    const vacio = raiz.querySelector(".chat-vacio");
    const grupo = raiz.querySelector(".chips");
    const chips = [...grupo.querySelectorAll(".chip")];
    const noti = raiz.querySelector(".notificacion");
    const fin = raiz.querySelector(".demo-fin");
    const molde = raiz.querySelector("template");
    const estadoBase = estado.textContent;
    let ocupado = false, respondidas = 0, talla = "M", comprar = null;

    /* el chat baja solo hasta el final con cada mensaje. No usa el scroll suave del navegador (algunos celulares no lo
       terminan en un contenedor sin barra y la respuesta quedaba cortada): persigue el final cuadro a cuadro, recalculándolo
       cada vez, y si un mensaje cambia de alto después (la foto, la fuente) vuelve a bajar */
    let persecucion = 0;
    const bajar = (instantaneo = false) => {
        cancelAnimationFrame(persecucion);
        if (instantaneo || quieto()) { hilo.scrollTop = hilo.scrollHeight; return; }
        const paso = () => {
            const final = hilo.scrollHeight - hilo.clientHeight, falta = final - hilo.scrollTop;
            if (falta <= 1) { hilo.scrollTop = final; return; }
            hilo.scrollTop += Math.max(2, falta * .2);
            persecucion = requestAnimationFrame(paso);
        };
        persecucion = requestAnimationFrame(paso);
    };
    const cambiaAlto = new ResizeObserver(() => bajar());
    const poner = (nodo, oculto = false) => {
        vacio.remove();
        hilo.append(nodo);
        cambiaAlto.observe(nodo);
        if (oculto) { nodo.style.visibility = "hidden"; bajar(true); }
        else { nodo.classList.add("entra"); bajar(); }
        return nodo;
    };
    const burbuja = (quien, texto) => Object.assign(document.createElement("p"), { className: `msj msj-${quien}`, textContent: texto });
    const ocupar = (si) => {
        ocupado = si;
        grupo.classList.toggle("chips-ocupadas", si);
        chips.forEach((c) => c.setAttribute("aria-disabled", si || c.classList.contains("usada")));
    };
    const sugerir = () => chips.forEach((c, i) => c.classList.toggle("siguiente", i === 0 && respondidas === 0));

    /* la pregunta sale de la pastilla y vuela hasta su lugar en el chat */
    async function volar(chip, destino) {
        const a = chip.getBoundingClientRect(), b = destino.getBoundingClientRect();
        const fantasma = burbuja("cliente", destino.textContent);
        fantasma.classList.add("chip-vuela");
        fantasma.setAttribute("aria-hidden", "true");
        Object.assign(fantasma.style, { left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`, maxWidth: "none" });
        document.body.append(fantasma);
        const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
        await fantasma.animate([
            { transform: `translate(${dx}px, ${dy}px) scale(${a.width / b.width}, ${a.height / b.height})`, backgroundColor: "#FAF8F3", borderRadius: "999px", boxShadow: "0 12px 22px -14px rgba(28,29,32,.5)" },
            { transform: "none", backgroundColor: "#EAE6DD", borderRadius: "18px 18px 6px 18px", boxShadow: "0 0 0 rgba(28,29,32,0)" },
        ], { duration: 560, easing: "cubic-bezier(.3,.75,.25,1)" }).finished;
        fantasma.remove();
    }

    async function contestar(texto, conTarjeta) {
        await espera(240);
        cel.classList.add("escribe");
        estado.textContent = "escribiendo…";
        const puntos = poner(Object.assign(document.createElement("div"), { className: "escribiendo", innerHTML: "<i></i><i></i><i></i>" }));
        puntos.setAttribute("aria-hidden", "true");
        await espera(900);
        puntos.remove();
        cel.classList.remove("escribe");
        estado.textContent = estadoBase;
        poner(burbuja("tienda", texto));
        if (conTarjeta) { await espera(380); poner(tarjeta()); }
    }

    function tarjeta() {
        const nodo = molde.content.firstElementChild.cloneNode(true);
        const tallas = [...nodo.querySelectorAll(".tallas button")];
        tallas.forEach((b) => b.addEventListener("click", () => {
            if (cel.classList.contains("pedido")) return;
            talla = b.textContent;
            tallas.forEach((o) => o.setAttribute("aria-pressed", o === b));
        }));
        comprar = nodo.querySelector(".comprar");
        comprar.addEventListener("click", pedir);
        return nodo;
    }

    async function preguntar(chip) {
        if (ocupado || chip.classList.contains("usada")) return;
        ocupar(true);
        if (!respondidas) new Image().src = molde.content.querySelector("img").src; // la foto viene en camino mientras la tienda escribe
        chips.forEach((c) => c.classList.remove("siguiente"));
        chip.classList.add("usada");
        const msj = burbuja("cliente", chip.textContent.trim());
        if (quieto()) poner(msj);
        else {
            poner(msj, true);
            await volar(chip, msj);
            msj.style.visibility = "";
        }
        await contestar(GUION[chip.dataset.pregunta][respondidas ? 1 : 0], respondidas === 0);
        respondidas++;
        ocupar(false);
        if (chips.every((c) => c.classList.contains("usada"))) comprar?.classList.add("llama");
    }

    async function pedir() {
        if (ocupado || cel.classList.contains("pedido")) return;
        ocupar(true);
        comprar.disabled = true;
        comprar.classList.remove("llama");
        poner(burbuja("cliente", `Lo quiero en talla ${talla}`));
        await contestar("¡Listo! Tu pedido quedó hecho y lo pagas cuando te llegue.", false);
        await espera(500);
        noti.querySelector(".noti-detalle").textContent = `Conjunto Laureles, talla ${talla}, $329.000`;
        noti.hidden = false;
        cel.classList.add("pedido");
        await espera(750);
        grupo.hidden = true;
        fin.hidden = false;
        fin.classList.add("entra");
        ocupado = false;
    }

    function reiniciar() {
        cambiaAlto.disconnect();
        cancelAnimationFrame(persecucion);
        hilo.querySelectorAll(".msj, .producto, .escribiendo").forEach((n) => n.remove());
        hilo.append(vacio);
        chips.forEach((c) => c.classList.remove("usada"));
        noti.hidden = true;
        cel.classList.remove("pedido");
        fin.hidden = true;
        fin.classList.remove("entra");
        grupo.hidden = false;
        respondidas = 0; talla = "M"; comprar = null;
        ocupar(false);
        sugerir();
        chips[0].focus({ preventScroll: true });
    }

    chips.forEach((c) => c.addEventListener("click", () => preguntar(c)));
    raiz.querySelector("[data-reiniciar]").addEventListener("click", reiniciar);
    ocupar(false);
    sugerir();
})();
