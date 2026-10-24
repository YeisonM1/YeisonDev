/* Medición con Vercel Web Analytics (plan gratis). Los eventos personalizados son del plan Pro, así que cada clic a
   WhatsApp se cuenta como una visita a una página virtual /whatsapp/<origen>: en el panel de Vercel aparece en
   "Pages" y se ve qué botón trae más conversaciones. El origen sale del atributo data-wa del enlace. */
(() => {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  if (!document.querySelector('script[src="/_vercel/insights/script.js"]')) {
    const s = document.createElement("script");
    s.src = "/_vercel/insights/script.js";
    s.defer = true;
    document.head.appendChild(s);
  }
  window.medirWhatsApp = (origen) => window.va("pageview", { route: "/whatsapp/[origen]", path: `/whatsapp/${origen || "otro"}` });
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="https://wa.me/"]');
    if (a) window.medirWhatsApp(a.dataset.wa);
  }, true);
})();
