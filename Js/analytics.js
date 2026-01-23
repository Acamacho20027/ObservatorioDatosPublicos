// Google Analytics 4
// Reemplazar 'G-XXXXXXXXXX' con tu ID de Google Analytics
(function() {
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Reemplazar con tu ID real
  
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure'
    });

    // Cargar script de Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Función para trackear eventos personalizados
    window.trackEvent = function(eventName, eventParams) {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
      }
    };

    // Trackear eventos de interacción
    document.addEventListener('DOMContentLoaded', function() {
      // Trackear clics en enlaces de navegación
      document.querySelectorAll('nav a, header a').forEach(function(link) {
        link.addEventListener('click', function() {
          trackEvent('navigation_click', {
            'link_text': this.textContent.trim(),
            'link_url': this.href
          });
        });
      });

      // Trackear descargas de archivos
      document.querySelectorAll('a[download]').forEach(function(link) {
        link.addEventListener('click', function() {
          trackEvent('file_download', {
            'file_name': this.download || this.href.split('/').pop(),
            'file_url': this.href
          });
        });
      });

      // Trackear visualizaciones de gráficos (si está en exploracion.html)
      if (document.getElementById('chart-canvas')) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const chartCanvas = document.getElementById('chart-canvas');
              if (chartCanvas && !chartCanvas.classList.contains('hidden')) {
                trackEvent('chart_generated', {
                  'page': window.location.pathname
                });
              }
            }
          });
        });
        
        const chartCanvas = document.getElementById('chart-canvas');
        if (chartCanvas) {
          observer.observe(chartCanvas, { attributes: true });
        }
      }
    });
  }
})();
