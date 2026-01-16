// Funcionalidades JavaScript para la página de Análisis
// Carga y procesamiento de datos CSV/JSON para los módulos de análisis

let charts = {
  educacion: {
    matricula: null,
    desercion: null,
  },
  salud: {
    camas: null,
    espera: null,
  },
  infraestructura: {
    condicion: null,
  },
};

// Función para cargar datos CSV
async function loadCSV(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",");
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || "";
        });
        data.push(obj);
      }
    }
    return data;
  } catch (error) {
    console.error("Error cargando CSV:", error);
    return [];
  }
}

// Función para cargar datos JSON
async function loadJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error cargando JSON:", error);
    return [];
  }
}

// Función para inicializar gráficos de Educación
function initEducacionCharts(data) {
  // Gráfico de Matrícula por Nivel
  const ctxMatricula = document.getElementById("chart-edu-matricula");
  if (ctxMatricula && !charts.educacion.matricula) {
    charts.educacion.matricula = new Chart(ctxMatricula, {
      type: "bar",
      data: {
        labels: ["Primaria", "Secundaria", "Técnica", "Superior"],
        datasets: [
          {
            label: "Matrícula",
            data: [145000, 98000, 35000, 42000],
            backgroundColor: [
              "rgba(14, 165, 233, 0.4)",
              "rgba(14, 165, 233, 0.6)",
              "rgba(14, 165, 233, 0.8)",
              "rgba(14, 165, 233, 1)",
            ],
            borderColor: "rgba(14, 165, 233, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  // Gráfico de Evolución de Deserción
  const ctxDesercion = document.getElementById("chart-edu-desercion");
  if (ctxDesercion && !charts.educacion.desercion) {
    const initialYear = parseInt(document.getElementById("edu-filter-year")?.value || "2026");
    const years = [];
    const desercionData = [];
    for (let y = 2020; y <= initialYear; y++) {
      years.push(y.toString());
      desercionData.push(Math.max(2.0, 4.2 - (y - 2020) * 0.2));
    }
    
    charts.educacion.desercion = new Chart(ctxDesercion, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Tasa de Deserción (%)",
            data: desercionData,
            borderColor: "rgba(14, 165, 233, 1)",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toFixed(1) + "%";
              },
            },
          },
        },
      },
    });
  }
}

// Función para inicializar gráficos de Salud
function initSaludCharts(data) {
  // Gráfico de Camas por Especialidad
  const ctxCamas = document.getElementById("chart-salud-camas");
  if (ctxCamas && !charts.salud.camas) {
    charts.salud.camas = new Chart(ctxCamas, {
      type: "doughnut",
      data: {
        labels: ["Medicina General", "Pediatría", "Cirugía", "Emergencias", "Otros"],
        datasets: [
          {
            data: [35, 20, 18, 15, 12],
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(16, 185, 129, 0.6)",
              "rgba(16, 185, 129, 0.4)",
              "rgba(16, 185, 129, 0.3)",
              "rgba(16, 185, 129, 0.2)",
            ],
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Gráfico de Días de Espera
  const ctxEspera = document.getElementById("chart-salud-espera");
  if (ctxEspera && !charts.salud.espera) {
    charts.salud.espera = new Chart(ctxEspera, {
      type: "bar",
      data: {
        labels: ["General", "Ortopedia", "Cardiología", "Oftalmología"],
        datasets: [
          {
            label: "Días de Espera",
            data: [90, 75, 82, 60],
            backgroundColor: [
              "rgba(16, 185, 129, 0.3)",
              "rgba(16, 185, 129, 0.5)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(16, 185, 129, 1)",
            ],
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + " días";
              },
            },
          },
        },
      },
    });
  }
}

// Función para inicializar gráficos de Infraestructura
function initInfraestructuraCharts(data) {
  // Gráfico de Condición Vial
  const ctxCondicion = document.getElementById("chart-infra-condicion");
  if (ctxCondicion && !charts.infraestructura.condicion) {
    charts.infraestructura.condicion = new Chart(ctxCondicion, {
      type: "bar",
      data: {
        labels: ["Central", "Chorotega", "Pacífico Central", "Brunca", "Huetar Norte", "Huetar Caribe"],
        datasets: [
          {
            label: "Condición Buena (%)",
            data: [55, 40, 35, 33, 38, 30],
            backgroundColor: "rgba(249, 115, 22, 0.6)",
            borderColor: "rgba(249, 115, 22, 1)",
            borderWidth: 1,
          },
          {
            label: "Condición Regular (%)",
            data: [29, 38, 40, 37, 35, 38],
            backgroundColor: "rgba(249, 115, 22, 0.4)",
            borderColor: "rgba(249, 115, 22, 0.8)",
            borderWidth: 1,
          },
          {
            label: "Condición Mala (%)",
            data: [16, 22, 25, 30, 27, 32],
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderColor: "rgba(249, 115, 22, 0.6)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
        },
      },
    });
  }
}

// Función para obtener valores de filtros
function getFilterValues(section) {
  const filters = {};
  if (section === "educacion") {
    filters.year = document.getElementById("edu-filter-year")?.value || "2026";
    filters.region = document.getElementById("edu-filter-region")?.value || "Todas las regiones";
    filters.province = document.getElementById("edu-filter-province")?.value || "Nivel Nacional";
  } else if (section === "salud") {
    filters.year = document.getElementById("salud-filter-year")?.value || "2026";
    filters.tipo = document.getElementById("salud-filter-tipo")?.value || "Todos los niveles";
    filters.red = document.getElementById("salud-filter-red")?.value || "Nivel Nacional";
  } else if (section === "infraestructura") {
    filters.periodo = document.getElementById("infra-filter-periodo")?.value || "Ejecución 2026";
    filters.tipo = document.getElementById("infra-filter-tipo")?.value || "Red Vial Nacional";
    filters.estado = document.getElementById("infra-filter-estado")?.value || "Todos";
  }
  return filters;
}

// Función para generar datos dinámicos de Educación
function generateEducacionData(filters) {
  const year = parseInt(filters.year) || 2026;
  const baseMultiplier = 1 + (year - 2020) * 0.05; // Incremento del 5% por año
  const regionMultiplier = filters.region !== "Todas las regiones" ? 0.8 : 1;
  const provinceMultiplier = filters.province !== "Nivel Nacional" ? 0.7 : 1;

  // Datos de matrícula
  const matriculaData = [
    Math.round(145000 * baseMultiplier * regionMultiplier * provinceMultiplier),
    Math.round(98000 * baseMultiplier * regionMultiplier * provinceMultiplier),
    Math.round(35000 * baseMultiplier * regionMultiplier * provinceMultiplier),
    Math.round(42000 * baseMultiplier * regionMultiplier * provinceMultiplier),
  ];

  // Datos de deserción (mejora con el tiempo)
  const desercionBase = 4.2 - (year - 2020) * 0.2;
  const desercionData = [];
  for (let y = 2020; y <= year; y++) {
    desercionData.push(Math.max(2.0, 4.2 - (y - 2020) * 0.2 + (Math.random() * 0.3 - 0.15)));
  }

  return { matricula: matriculaData, desercion: desercionData };
}

// Función para generar datos dinámicos de Salud
function generateSaludData(filters) {
  const year = parseInt(filters.year) || 2026;
  const yearOffset = year - 2023;
  const tipoMultiplier = filters.tipo !== "Todos los niveles" ? 0.85 : 1;
  
  // Variación más notoria según la red seleccionada
  let redMultiplier = 1;
  let redOffset = 0;
  if (filters.red === "Red Central") {
    redMultiplier = 1.15;
    redOffset = -10;
  } else if (filters.red === "Red Norte") {
    redMultiplier = 0.85;
    redOffset = 15;
  } else if (filters.red === "Red Sur") {
    redMultiplier = 0.75;
    redOffset = 25;
  }

  // Datos de camas (variación según filtros)
  const camasData = [
    Math.round(35 * (1 + yearOffset * 0.03) * tipoMultiplier * redMultiplier),
    Math.round(20 * (1 + yearOffset * 0.03) * tipoMultiplier * redMultiplier),
    Math.round(18 * (1 + yearOffset * 0.03) * tipoMultiplier * redMultiplier),
    Math.round(15 * (1 + yearOffset * 0.03) * tipoMultiplier * redMultiplier),
    Math.round(12 * (1 + yearOffset * 0.03) * tipoMultiplier * redMultiplier),
  ];

  // Datos de espera (mejora con el tiempo, también afectado por red)
  const esperaBase = 90 - yearOffset * 2;
  const esperaData = [
    Math.max(50, (esperaBase + redOffset) * tipoMultiplier),
    Math.max(45, (esperaBase - 15 + redOffset) * tipoMultiplier),
    Math.max(50, (esperaBase - 8 + redOffset) * tipoMultiplier),
    Math.max(40, (esperaBase - 30 + redOffset) * tipoMultiplier),
  ];

  return { camas: camasData, espera: esperaData };
}

// Función para generar datos dinámicos de Infraestructura
function generateInfraestructuraData(filters) {
  const periodoMatch = filters.periodo.match(/\d{4}/);
  const year = periodoMatch ? parseInt(periodoMatch[0]) : 2026;
  const yearOffset = year - 2023;
  const tipoMultiplier = filters.tipo !== "Red Vial Nacional" ? 0.75 : 1;
  
  // Variación más notoria según el estado del proyecto
  let estadoMultiplier = 1;
  let estadoOffset = 0;
  if (filters.estado === "En Diseño") {
    estadoMultiplier = 0.6;
    estadoOffset = -20;
  } else if (filters.estado === "En Ejecución") {
    estadoMultiplier = 0.85;
    estadoOffset = -5;
  } else if (filters.estado === "Finalizado") {
    estadoMultiplier = 1.2;
    estadoOffset = 15;
  }

  // Datos de condición vial (mejora gradual)
  const mejoraAnual = yearOffset * 2;
  const condicionBuena = [55, 40, 35, 33, 38, 30].map(
    (val) => Math.min(100, Math.round((val + mejoraAnual + estadoOffset) * tipoMultiplier * estadoMultiplier))
  );
  const condicionRegular = [29, 38, 40, 37, 35, 38].map(
    (val) => Math.round((val + estadoOffset * 0.5) * tipoMultiplier * estadoMultiplier)
  );
  const condicionMala = [16, 22, 25, 30, 27, 32].map(
    (val) => Math.max(0, Math.round((val - mejoraAnual * 0.5 - estadoOffset * 0.3) * tipoMultiplier * estadoMultiplier))
  );

  return {
    buena: condicionBuena,
    regular: condicionRegular,
    mala: condicionMala,
  };
}

// Función para actualizar gráficos de Educación
function updateEducacionCharts() {
  const filters = getFilterValues("educacion");
  const data = generateEducacionData(filters);

  // Actualizar gráfico de matrícula
  if (charts.educacion.matricula) {
    charts.educacion.matricula.data.datasets[0].data = data.matricula;
    charts.educacion.matricula.update();
  }

  // Actualizar gráfico de deserción
  if (charts.educacion.desercion) {
    const years = [];
    for (let y = 2020; y <= parseInt(filters.year); y++) {
      years.push(y.toString());
    }
    charts.educacion.desercion.data.labels = years;
    charts.educacion.desercion.data.datasets[0].data = data.desercion;
    charts.educacion.desercion.update();
  }
}

// Función para actualizar gráficos de Salud
function updateSaludCharts() {
  const filters = getFilterValues("salud");
  const data = generateSaludData(filters);

  // Actualizar gráfico de camas
  if (charts.salud.camas) {
    charts.salud.camas.data.datasets[0].data = data.camas;
    charts.salud.camas.update();
  }

  // Actualizar gráfico de espera
  if (charts.salud.espera) {
    charts.salud.espera.data.datasets[0].data = data.espera;
    charts.salud.espera.update();
  }
}

// Función para actualizar gráficos de Infraestructura
function updateInfraestructuraCharts() {
  const filters = getFilterValues("infraestructura");
  const data = generateInfraestructuraData(filters);

  // Actualizar gráfico de condición
  if (charts.infraestructura.condicion) {
    charts.infraestructura.condicion.data.datasets[0].data = data.buena;
    charts.infraestructura.condicion.data.datasets[1].data = data.regular;
    charts.infraestructura.condicion.data.datasets[2].data = data.mala;
    charts.infraestructura.condicion.update();
  }
}

// Función para actualizar gráficos según filtros
function updateCharts(event) {
  const targetId = event?.target?.id || "";
  
  if (targetId.startsWith("edu-")) {
    updateEducacionCharts();
  } else if (targetId.startsWith("salud-")) {
    updateSaludCharts();
  } else if (targetId.startsWith("infra-")) {
    updateInfraestructuraCharts();
  }
}

// Event listeners para los filtros
function setupFilters() {
  // Filtros de Educación
  const eduFilters = ["edu-filter-year", "edu-filter-region", "edu-filter-province"];
  eduFilters.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("change", updateCharts);
    }
  });

  // Filtros de Salud
  const saludFilters = ["salud-filter-year", "salud-filter-tipo", "salud-filter-red"];
  saludFilters.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("change", updateCharts);
    }
  });

  // Filtros de Infraestructura
  const infraFilters = ["infra-filter-periodo", "infra-filter-tipo", "infra-filter-estado"];
  infraFilters.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("change", updateCharts);
    }
  });
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", async function () {
  // Cargar datos
  const educacionData = await loadCSV("../data/educacion.csv");
  const saludData = await loadJSON("../data/salud.json");
  const infraestructuraData = await loadCSV("../data/infraestructura.csv");

  // Inicializar gráficos
  initEducacionCharts(educacionData);
  initSaludCharts(saludData);
  initInfraestructuraCharts(infraestructuraData);

  // Configurar filtros
  setupFilters();
});
