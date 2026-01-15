// Lógica principal para la sección de Visualización de Datos
// Usa Chart.js (cargado vía CDN en index.html) y reacciona
// a los filtros de año y provincia.

document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("viz-filter-year");
  const provinceSelect = document.getElementById("viz-filter-provincia");

  const empleoCanvas = document.getElementById("viz-empleo");
  const presupuestoCanvas = document.getElementById("viz-presupuesto");
  const pibCanvas = document.getElementById("viz-pib");

  if (!yearSelect || !provinceSelect || !empleoCanvas || !presupuestoCanvas || !pibCanvas || typeof Chart === "undefined") {
    return;
  }

  const provinceFactors = {
    "todas": 1.0,
    "san-jose": 1.05,
    "alajuela": 0.98,
    "cartago": 1.0,
    "heredia": 1.02,
    "guanacaste": 0.95,
    "puntarenas": 0.93,
    "limon": 0.9,
  };

  const baseEmploymentByYear = {
    2020: [1.7, 1.9, 1.8, 2.0, 2.1],
    2021: [1.8, 2.0, 1.9, 2.2, 2.3],
    2022: [1.9, 2.1, 2.0, 2.3, 2.4],
    2023: [2.0, 2.2, 2.1, 2.4, 2.6],
    2024: [2.05, 2.25, 2.15, 2.5, 2.7],
    2025: [2.1, 2.3, 2.2, 2.55, 2.8],
    2026: [2.15, 2.35, 2.25, 2.6, 2.9],
  };

  const baseBudgetByYear = {
    2020: { educacion: 38, salud: 24, otros: 38 },
    2021: { educacion: 39, salud: 24, otros: 37 },
    2022: { educacion: 40, salud: 25, otros: 35 },
    2023: { educacion: 41, salud: 25, otros: 34 },
    2024: { educacion: 41, salud: 26, otros: 33 },
    2025: { educacion: 42, salud: 26, otros: 32 },
    2026: { educacion: 43, salud: 27, otros: 30 },
  };

  const basePibByYear = {
    2020: {
      proyectado: [2.0, 2.3, 2.5, 2.8, -1.5, 1.0, 2.0],
      real: [1.9, 2.1, 2.4, 2.6, -2.0, 0.5, 1.8],
    },
    2021: {
      proyectado: [1.0, 1.8, 2.6, 3.0, 1.5, 2.0, 2.5],
      real: [0.8, 1.6, 2.5, 2.9, 1.3, 1.8, 2.3],
    },
    2022: {
      proyectado: [1.5, 2.0, 2.8, 3.1, 2.0, 2.5, 3.0],
      real: [1.3, 1.9, 2.7, 3.0, 1.9, 2.3, 2.8],
    },
    2023: {
      proyectado: [2.0, 2.4, 3.0, 3.3, 2.2, 2.7, 3.2],
      real: [1.9, 2.3, 2.9, 3.2, 2.1, 2.5, 3.0],
    },
    2024: {
      proyectado: [2.2, 2.6, 3.1, 3.4, 2.4, 2.9, 3.4],
      real: [2.1, 2.5, 3.0, 3.3, 2.3, 2.7, 3.1],
    },
    2025: {
      proyectado: [2.4, 2.8, 3.2, 3.5, 2.5, 3.0, 3.5],
      real: [2.3, 2.7, 3.1, 3.4, 2.4, 2.8, 3.2],
    },
    2026: {
      proyectado: [2.6, 3.0, 3.3, 3.6, 2.6, 3.1, 3.6],
      real: [2.5, 2.9, 3.2, 3.5, 2.5, 2.9, 3.3],
    },
  };

  function getFactor(province) {
    return provinceFactors[province] ?? 1.0;
  }

  function getEmploymentData(year, province) {
    const base = baseEmploymentByYear[year] || baseEmploymentByYear[2023];
    const factor = getFactor(province);
    return base.map((v) => +(v * factor).toFixed(2));
  }

  function getBudgetData(year, province) {
    const base = baseBudgetByYear[year] || baseBudgetByYear[2023];
    const factor = getFactor(province);
    const educacion = +(base.educacion * factor).toFixed(1);
    const salud = +(base.salud * factor).toFixed(1);
    let otros = 100 - educacion - salud;
    if (otros < 0) otros = 0;
    return {
      labels: ["Educación", "Salud", "Otros"],
      values: [educacion, salud, +(otros.toFixed(1))],
    };
  }

  function getPibData(year, province) {
    const base = basePibByYear[year] || basePibByYear[2023];
    const factor = getFactor(province);
    return {
      proyectado: base.proyectado.map((v) => +(v * factor).toFixed(2)),
      real: base.real.map((v) => +(v * factor).toFixed(2)),
    };
  }

  const empleoChart = new Chart(empleoCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4", "Trimestre 5"],
      datasets: [
        {
          label: "Empleo (millones de personas)",
          data: getEmploymentData(yearSelect.value, provinceSelect.value),
          backgroundColor: [
            "#e5f0ff",
            "#bfd7ff",
            "#93c0ff",
            "#4f8df7",
            "#2563eb",
          ],
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y.toFixed(2)} M`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#e5e7eb" },
          ticks: {
            callback: (value) => `${value} M`,
          },
        },
      },
    },
  });

  const presupuestoChart = new Chart(presupuestoCanvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Educación", "Salud", "Otros"],
      datasets: [
        {
          data: getBudgetData(yearSelect.value, provinceSelect.value).values,
          backgroundColor: ["#2563eb", "#10b981", "#fbbf24"],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: { display: false },
      },
    },
  });

  const pibDataInitial = getPibData(yearSelect.value, provinceSelect.value);
  const pibChart = new Chart(pibCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      datasets: [
        {
          label: "Proyectado",
          data: pibDataInitial.proyectado,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          tension: 0.35,
          fill: false,
        },
        {
          label: "Real",
          data: pibDataInitial.real,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.35,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { color: "#e5e7eb" },
        },
        y: {
          grid: { color: "#e5e7eb" },
          ticks: {
            callback: (value) => `${Number(value).toFixed(1)}%`,
            maxTicksLimit: 6,
          },
        },
      },
    },
  });

  function updateCharts() {
    const year = yearSelect.value;
    const province = provinceSelect.value;

    empleoChart.data.datasets[0].data = getEmploymentData(year, province);
    empleoChart.update();

    const budget = getBudgetData(year, province);
    presupuestoChart.data.datasets[0].data = budget.values;
    presupuestoChart.update();

    const pib = getPibData(year, province);
    pibChart.data.datasets[0].data = pib.proyectado;
    pibChart.data.datasets[1].data = pib.real;
    pibChart.update();
  }

  yearSelect.addEventListener("change", updateCharts);
  provinceSelect.addEventListener("change", updateCharts);
});
