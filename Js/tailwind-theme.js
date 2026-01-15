// Configuración mínima para Tailwind CDN.
// Forzamos el modo oscuro basado en clase y NO en prefers-color-scheme,
// para que el sitio siempre se vea en su versión clara mientras no se
// añada la clase `dark` al elemento <html>.

window.tailwind = window.tailwind || {};

// Si ya hubiera una config previa, la respetamos y solo ajustamos darkMode.
tailwind.config = Object.assign({}, tailwind.config, {
  darkMode: "class",
});

