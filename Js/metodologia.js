// Funcionalidades JavaScript para la página de Metodología

document.addEventListener("DOMContentLoaded", function () {
  // Funcionalidad del botón "Contactar equipo"
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.textContent.includes("Contactar equipo")) {
      button.addEventListener("click", function () {
        // Aquí puedes agregar la lógica para abrir un formulario de contacto
        // o redirigir a una página de contacto
        alert(
          "Funcionalidad de contacto próximamente disponible. Por favor, utilice los enlaces del footer para más información."
        );
      });
    }

    // Funcionalidad del botón "Ver Repositorio (GitHub)"
    if (button.textContent.includes("Ver Repositorio")) {
      button.addEventListener("click", function () {
        // Aquí puedes agregar el enlace al repositorio de GitHub cuando esté disponible
        alert("El repositorio de GitHub estará disponible próximamente.");
      });
    }
  });

  // Funcionalidad del enlace "Consultar bitácora de errores"
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach((link) => {
    if (link.textContent.includes("bitácora")) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert(
          "La bitácora de errores estará disponible próximamente en el repositorio de GitHub."
        );
      });
    }
  });
});
