// Lógica principal para la vista de Explorar Análisis de Datos
// Permite cargar archivos CSV o JSON, procesarlos y generar visualizaciones

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const fileInput = document.getElementById("file-input");
  const uploadBtn = document.getElementById("upload-btn");
  const uploadArea = document.getElementById("upload-area");
  const fileError = document.getElementById("file-error");
  const dataPreviewSection = document.getElementById("data-preview-section");
  const configSection = document.getElementById("config-section");
  const visualizationSection = document.getElementById("visualization-section");
  const previewTable = document.getElementById("preview-table");
  const previewTableHead = previewTable.querySelector("thead tr");
  const previewTableBody = previewTable.querySelector("tbody");
  const previewCount = document.getElementById("preview-count");
  const xAxisSelect = document.getElementById("x-axis-select");
  const yAxisSelect = document.getElementById("y-axis-select");
  const chartTypeBtns = document.querySelectorAll(".chart-type-btn");
  const generateChartBtn = document.getElementById("generate-chart-btn");
  const chartCanvas = document.getElementById("chart-canvas");
  const chartTitle = document.getElementById("chart-title");
  const chartSubtitle = document.getElementById("chart-subtitle");
  const chartEmpty = document.getElementById("chart-empty");
  const resetBtn = document.getElementById("reset-btn");
  
  // Elementos del modal
  const resetModal = document.getElementById("reset-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const modalConfirmBtn = document.getElementById("modal-confirm-btn");

  // Estado de la aplicación
  let rawData = [];
  let processedData = [];
  let headers = [];
  let currentChart = null;
  let selectedChartType = "bar";
  let xAxisColumn = "";
  let yAxisColumn = "";

  // Validación de tipos de archivo permitidos
  const ALLOWED_TYPES = {
    "text/csv": "csv",
    "application/json": "json",
    "text/plain": "csv", // Algunos CSV pueden venir como text/plain
  };

  // ========== Inicialización de Event Listeners ==========

  // Abrir selector de archivos al hacer clic en el botón
  uploadBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // Abrir selector al hacer clic en el área (pero no en el botón)
  uploadArea.addEventListener("click", (e) => {
    // Solo abrir el selector si el click NO fue en el botón o dentro del botón
    const isButtonClick = e.target === uploadBtn || uploadBtn.contains(e.target);
    if (!isButtonClick) {
      fileInput.click();
    }
  });

  // Manejar drag & drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add("border-sky-700", "bg-sky-50");
  });

  uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove("border-sky-700", "bg-sky-50");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove("border-sky-700", "bg-sky-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      fileInput.value = "";
    }
  });

  // Manejar selección de archivo
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    } else {
      // Si no hay archivo seleccionado, limpiar el input
      fileInput.value = "";
    }
  });

  // Botones de tipo de gráfico
  chartTypeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      chartTypeBtns.forEach((b) => {
        b.classList.remove("bg-sky-700", "text-white");
        b.classList.add("bg-slate-100", "text-slate-900");
      });
      btn.classList.remove("bg-slate-100", "text-slate-900");
      btn.classList.add("bg-sky-700", "text-white");
      selectedChartType = btn.dataset.chartType;
      validateChartConfig();
    });
  });

  // Selectores de ejes
  xAxisSelect.addEventListener("change", () => {
    xAxisColumn = xAxisSelect.value;
    validateChartConfig();
  });

  yAxisSelect.addEventListener("change", () => {
    yAxisColumn = yAxisSelect.value;
    validateChartConfig();
  });

  // Generar gráfico
  generateChartBtn.addEventListener("click", generateChart);

  // Reiniciar análisis
  resetBtn.addEventListener("click", () => {
    showResetModal();
  });

  // Event listeners del modal
  modalCancelBtn.addEventListener("click", hideResetModal);
  modalConfirmBtn.addEventListener("click", confirmReset);
  modalOverlay.addEventListener("click", hideResetModal);

  // Cerrar modal con la tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !resetModal.classList.contains("hidden")) {
      hideResetModal();
    }
  });

  // ========== Funciones de Procesamiento ==========

  /**
   * Maneja la carga y validación inicial del archivo
   */
  function handleFile(file) {
    fileError.classList.add("hidden");
    fileError.textContent = "";

    // Validar extensión
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "csv" && fileExtension !== "json") {
      showError("Por favor, seleccione un archivo CSV o JSON válido.");
      fileInput.value = "";
      return;
    }

    // Validar tipo MIME (si está disponible)
    const fileType = file.type;
    if (fileType && !ALLOWED_TYPES[fileType] && fileExtension === "csv") {
      // Algunos navegadores no detectan CSV correctamente, pero si la extensión es .csv, lo aceptamos
      console.warn("Tipo MIME no reconocido, pero extensión válida:", fileExtension);
    }

    // Procesar según el tipo
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target.result;
        
        // Validar que el resultado no esté vacío
        if (!result || result.trim().length === 0) {
          showError("El archivo está vacío. Por favor, seleccione un archivo con contenido.");
          fileInput.value = "";
          return;
        }

        if (fileExtension === "csv") {
          processCSV(result);
        } else if (fileExtension === "json") {
          processJSON(result);
        }
      } catch (error) {
        showError(`Error al procesar el archivo: ${error.message}`);
        console.error("Error procesando archivo:", error);
        fileInput.value = "";
      }
    };

    reader.onerror = () => {
      showError("Error al leer el archivo. Por favor, intente nuevamente.");
      fileInput.value = "";
    };

    reader.onabort = () => {
      showError("La lectura del archivo fue cancelada.");
      fileInput.value = "";
    };

    if (fileExtension === "csv") {
      reader.readAsText(file, "UTF-8");
    } else {
      reader.readAsText(file, "UTF-8");
    }
  }

  /**
   * Procesa un archivo CSV y convierte a estructura de objetos
   */
  function processCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      showError("El archivo CSV debe contener al menos una fila de encabezados y una fila de datos.");
      fileInput.value = "";
      return;
    }

    // Obtener encabezados
    headers = parseCSVLine(lines[0]);

    if (headers.length === 0) {
      showError("No se pudieron leer los encabezados del archivo CSV.");
      fileInput.value = "";
      return;
    }

    // Procesar filas de datos
    rawData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        rawData.push(row);
      }
    }

    if (rawData.length === 0) {
      showError("No se encontraron datos válidos en el archivo CSV.");
      fileInput.value = "";
      return;
    }

    processedData = rawData;
    displayPreview();
    populateSelects();
    // Limpiar el input después de procesar exitosamente para permitir seleccionar el mismo archivo nuevamente
    fileInput.value = "";
  }

  /**
   * Parsea una línea CSV manejando comillas y valores separados por comas
   */
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          // Doble comilla escapada
          current += '"';
          i++;
        } else {
          // Invertir estado de comillas
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        // Separador de campo
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Agregar el último campo
    result.push(current.trim());

    return result;
  }

  /**
   * Procesa un archivo JSON y valida su estructura
   */
  function processJSON(jsonText) {
    // Validar que el contenido no esté vacío
    if (!jsonText || typeof jsonText !== "string" || jsonText.trim().length === 0) {
      showError("El archivo JSON está vacío o no contiene datos válidos.");
      fileInput.value = "";
      return;
    }

    // Limpiar el texto de posibles espacios en blanco al inicio y final
    let cleanedText = "";
    try {
      cleanedText = jsonText.trim();

      // Validar que el contenido tenga al menos caracteres básicos de JSON
      if (cleanedText.length < 2) {
        showError("El archivo JSON parece estar incompleto o corrupto.");
        fileInput.value = "";
        return;
      }

      const data = JSON.parse(cleanedText);

      // Validar estructura
      if (!Array.isArray(data) && typeof data !== "object") {
        showError("El archivo JSON debe ser un array o un objeto con una propiedad que contenga un array.");
        fileInput.value = "";
        return;
      }

      // Si es un objeto, intentar encontrar un array dentro
      let dataArray = [];
      if (Array.isArray(data)) {
        dataArray = data;
      } else if (typeof data === "object") {
        // Buscar la primera propiedad que sea un array
        for (const key in data) {
          if (Array.isArray(data[key])) {
            dataArray = data[key];
            break;
          }
        }

        if (dataArray.length === 0) {
          showError("No se encontró un array válido en el archivo JSON.");
          fileInput.value = "";
          return;
        }
      }

      if (dataArray.length === 0) {
        showError("El array de datos está vacío.");
        fileInput.value = "";
        return;
      }

      // Obtener encabezados de las claves del primer objeto
      if (typeof dataArray[0] !== "object" || Array.isArray(dataArray[0])) {
        showError("Los elementos del array deben ser objetos con propiedades clave-valor.");
        fileInput.value = "";
        return;
      }

      headers = Object.keys(dataArray[0]);

      if (headers.length === 0) {
        showError("No se encontraron propiedades en los objetos del JSON.");
        fileInput.value = "";
        return;
      }

      // Convertir a formato consistente
      rawData = dataArray.map((item) => {
        const row = {};
        headers.forEach((header) => {
          row[header] = item[header] !== undefined ? String(item[header]) : "";
        });
        return row;
      });

      processedData = rawData;
      displayPreview();
      populateSelects();
      // Limpiar el input después de procesar exitosamente para permitir seleccionar el mismo archivo nuevamente
      fileInput.value = "";
    } catch (error) {
      let errorMessage = `Error al procesar JSON: ${error.message}.`;
      
      // Mensajes más específicos según el tipo de error
      if (error instanceof SyntaxError) {
        if (error.message.includes("Unexpected end of JSON input")) {
          errorMessage = "El archivo JSON está incompleto o vacío. Por favor, verifique que el archivo contenga un JSON válido.";
        } else if (error.message.includes("Unexpected token")) {
          errorMessage = `El archivo JSON tiene un error de sintaxis: ${error.message}. Por favor, verifique que el formato sea válido.`;
        } else {
          errorMessage = `Error de sintaxis en el JSON: ${error.message}. Por favor, verifique que el formato sea válido.`;
        }
      }
      
      showError(errorMessage);
      console.error("Error procesando JSON:", error);
      console.error("Contenido recibido:", cleanedText.substring(0, 200)); // Mostrar primeros 200 caracteres para debugging
      // Limpiar el input también en caso de error para permitir reintentar
      fileInput.value = "";
    }
  }

  /**
   * Muestra la vista previa de los datos cargados
   */
  function displayPreview() {
    // Limpiar tabla
    previewTableHead.innerHTML = "";
    previewTableBody.innerHTML = "";

    // Agregar encabezados
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.className = "px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-900";
      th.textContent = header;
      previewTableHead.appendChild(th);
    });

    // Agregar primeras filas (máximo 5)
    const previewRows = processedData.slice(0, 5);
    previewRows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50 transition-colors";

      headers.forEach((header) => {
        const td = document.createElement("td");
        td.className = "px-6 py-4 text-sm text-slate-600";
        const value = row[header] || "";
        td.textContent = value.length > 50 ? value.substring(0, 50) + "..." : value;
        tr.appendChild(td);
      });

      previewTableBody.appendChild(tr);
    });

    // Actualizar contador
    previewCount.textContent = `Mostrando ${previewRows.length} de ${processedData.length} registros`;

    // Mostrar secciones
    dataPreviewSection.classList.remove("hidden");
    configSection.classList.remove("hidden");
  }

  /**
   * Pobla los selectores de ejes con las columnas disponibles
   */
  function populateSelects() {
    // Limpiar selectores
    xAxisSelect.innerHTML = '<option value="">Seleccione una columna</option>';
    yAxisSelect.innerHTML = '<option value="">Seleccione una columna</option><option value="count">Conteo de Registros</option>';

    // Agregar columnas
    headers.forEach((header) => {
      // Para Eje X (categorías)
      const optionX = document.createElement("option");
      optionX.value = header;
      optionX.textContent = header;
      xAxisSelect.appendChild(optionX);

      // Para Eje Y (valores) - solo columnas numéricas potenciales
      const optionY = document.createElement("option");
      optionY.value = header;
      optionY.textContent = header;
      yAxisSelect.appendChild(optionY);
    });
  }

  /**
   * Valida si la configuración del gráfico está completa
   */
  function validateChartConfig() {
    const isValid = xAxisColumn !== "" && yAxisColumn !== "" && selectedChartType !== "";
    generateChartBtn.disabled = !isValid;
  }

  /**
   * Genera el gráfico según la configuración seleccionada
   */
  function generateChart() {
    if (!xAxisColumn || !yAxisColumn || !selectedChartType) {
      return;
    }

    chartEmpty.classList.add("hidden");
    chartCanvas.classList.remove("hidden");

    // Preparar datos según el tipo de gráfico
    let chartData = {};

    if (yAxisColumn === "count") {
      // Conteo por categoría
      const counts = {};
      processedData.forEach((row) => {
        const category = String(row[xAxisColumn] || "Sin categoría");
        counts[category] = (counts[category] || 0) + 1;
      });

      chartData = {
        labels: Object.keys(counts),
        datasets: [
          {
            label: "Conteo",
            data: Object.values(counts),
            backgroundColor: getColors(Object.keys(counts).length, selectedChartType),
          },
        ],
      };
    } else {
      // Agrupar por categoría y sumar valores
      const grouped = {};
      processedData.forEach((row) => {
        const category = String(row[xAxisColumn] || "Sin categoría");
        const value = parseFloat(row[yAxisColumn]) || 0;

        if (!grouped[category]) {
          grouped[category] = 0;
        }
        grouped[category] += value;
      });

      chartData = {
        labels: Object.keys(grouped),
        datasets: [
          {
            label: yAxisColumn,
            data: Object.values(grouped),
            backgroundColor: getColors(Object.keys(grouped).length, selectedChartType),
          },
        ],
      };
    }

    // Destruir gráfico anterior si existe
    if (currentChart) {
      currentChart.destroy();
    }

    // Configurar opciones según el tipo
    const chartOptions = getChartOptions(selectedChartType);

    // Crear nuevo gráfico
    currentChart = new Chart(chartCanvas.getContext("2d"), {
      type: selectedChartType === "pie" ? "pie" : selectedChartType === "line" ? "line" : "bar",
      data: chartData,
      options: chartOptions,
    });

    // Actualizar título
    const chartTypeNames = {
      bar: "Barras",
      line: "Líneas",
      pie: "Torta",
    };

    chartTitle.textContent = `${yAxisColumn === "count" ? "Conteo" : yAxisColumn} por ${xAxisColumn}`;
    chartSubtitle.textContent = `Gráfico de ${chartTypeNames[selectedChartType]} - ${processedData.length} registros`;

    // Mostrar sección de visualización
    visualizationSection.classList.remove("hidden");
    visualizationSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * Genera colores para los datos del gráfico
   */
  function getColors(count, chartType) {
    const colors = [
      "#2563eb", // sky-700
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#06b6d4", // cyan-500
      "#84cc16", // lime-500
      "#f97316", // orange-500
      "#6366f1", // indigo-500
    ];

    if (chartType === "bar" || chartType === "pie") {
      return Array.from({ length: count }, (_, i) => {
        const baseColor = colors[i % colors.length];
        // Variar la opacidad para barras
        if (chartType === "bar") {
          const opacity = 0.6 + (i % 2) * 0.3;
          return baseColor + Math.floor(opacity * 255).toString(16).padStart(2, "0");
        }
        return baseColor;
      });
    } else if (chartType === "line") {
      // Para líneas, usar colores sólidos
      return colors[0];
    }

    return colors.slice(0, count);
  }

  /**
   * Obtiene las opciones de configuración para Chart.js según el tipo
   */
  function getChartOptions(chartType) {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartType === "pie" || chartType === "line",
          position: "right",
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    if (chartType === "bar") {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
          },
        },
      };
    } else if (chartType === "line") {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { color: "#e5e7eb" },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
          },
        },
        elements: {
          line: {
            tension: 0.35,
          },
        },
      };
    } else if (chartType === "pie") {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            position: "right",
          },
        },
      };
    }

    return baseOptions;
  }

  /**
   * Muestra el modal de confirmación para reiniciar
   */
  function showResetModal() {
    resetModal.classList.remove("hidden");
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
  }

  /**
   * Oculta el modal de confirmación
   */
  function hideResetModal() {
    resetModal.classList.add("hidden");
    // Restaurar scroll del body
    document.body.style.overflow = "";
  }

  /**
   * Confirma el reinicio del análisis
   */
  function confirmReset() {
    hideResetModal();
    
    // Limpiar estado
    rawData = [];
    processedData = [];
    headers = [];
    xAxisColumn = "";
    yAxisColumn = "";
    selectedChartType = "bar";

    // Destruir gráfico
    if (currentChart) {
      currentChart.destroy();
      currentChart = null;
    }

    // Limpiar UI
    fileInput.value = "";
    previewTableHead.innerHTML = "";
    previewTableBody.innerHTML = "";
    xAxisSelect.innerHTML = '<option value="">Seleccione una columna</option>';
    yAxisSelect.innerHTML =
      '<option value="">Seleccione una columna</option><option value="count">Conteo de Registros</option>';

    // Resetear botones de tipo de gráfico
    chartTypeBtns.forEach((btn, index) => {
      if (index === 0) {
        btn.classList.add("bg-sky-700", "text-white");
        btn.classList.remove("bg-slate-100", "text-slate-900");
      } else {
        btn.classList.remove("bg-sky-700", "text-white");
        btn.classList.add("bg-slate-100", "text-slate-900");
      }
    });

    generateChartBtn.disabled = true;

    // Ocultar secciones
    dataPreviewSection.classList.add("hidden");
    configSection.classList.add("hidden");
    visualizationSection.classList.add("hidden");
    chartEmpty.classList.remove("hidden");
    chartCanvas.classList.add("hidden");

    // Limpiar errores
    fileError.classList.add("hidden");
    fileError.textContent = "";

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Muestra un mensaje de error
   */
  function showError(message) {
    fileError.textContent = message;
    fileError.classList.remove("hidden");
  }
});
