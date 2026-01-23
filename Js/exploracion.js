// Lógica principal para la vista de Explorar Análisis de Datos
// Versión mejorada con todas las funcionalidades avanzadas

document.addEventListener("DOMContentLoaded", () => {
  // ========== Elementos del DOM ==========
  const fileInput = document.getElementById("file-input");
  const uploadBtn = document.getElementById("upload-btn");
  const uploadArea = document.getElementById("upload-area");
  const fileError = document.getElementById("file-error");
  const dataPreviewSection = document.getElementById("data-preview-section");
  const configSection = document.getElementById("config-section");
  const visualizationSection = document.getElementById("visualization-section");
  const statsSection = document.getElementById("stats-section");
  const previewTable = document.getElementById("preview-table");
  const previewTableHead = previewTable.querySelector("thead tr");
  const previewTableBody = previewTable.querySelector("tbody");
  const previewCount = document.getElementById("preview-count");
  const previewSearch = document.getElementById("preview-search");
  const paginationControls = document.getElementById("pagination-controls");
  const prevPageBtn = document.getElementById("prev-page-btn");
  const nextPageBtn = document.getElementById("next-page-btn");
  const pageInfo = document.getElementById("page-info");
  const xAxisSelect = document.getElementById("x-axis-select");
  const yAxisSelect = document.getElementById("y-axis-select");
  const chartTypeBtns = document.querySelectorAll(".chart-type-btn");
  const generateChartBtn = document.getElementById("generate-chart-btn");
  const chartCanvas = document.getElementById("chart-canvas");
  const chartTitle = document.getElementById("chart-title");
  const chartSubtitle = document.getElementById("chart-subtitle");
  const chartEmpty = document.getElementById("chart-empty");
  const resetBtn = document.getElementById("reset-btn");
  const exportChartBtn = document.getElementById("export-chart-btn");
  const exportDataBtn = document.getElementById("export-data-btn");
  const loadingIndicator = document.getElementById("loading-indicator");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const successMessage = document.getElementById("success-message");
  const successText = document.getElementById("success-text");
  const aggregationSelect = document.getElementById("aggregation-select");
  const dateGroupingContainer = document.getElementById("date-grouping-container");
  const dateGroupingSelect = document.getElementById("date-grouping-select");
  const filterColumnSelect = document.getElementById("filter-column-select");
  const filterOperatorSelect = document.getElementById("filter-operator-select");
  const filterValueInput = document.getElementById("filter-value-input");
  const applyFilterBtn = document.getElementById("apply-filter-btn");
  const clearFilterBtn = document.getElementById("clear-filter-btn");
  const filterIncompleteRows = document.getElementById("filter-incomplete-rows");
  const missingDataWarning = document.getElementById("missing-data-warning");
  const statsContent = document.getElementById("stats-content");

  // Elementos del modal
  const resetModal = document.getElementById("reset-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const modalConfirmBtn = document.getElementById("modal-confirm-btn");

  // ========== Estado de la aplicación ==========
  let rawData = [];
  let processedData = [];
  let filteredData = [];
  let headers = [];
  let columnTypes = {}; // {columnName: 'number'|'text'|'date'}
  let currentChart = null;
  let selectedChartType = "bar";
  let xAxisColumn = "";
  let yAxisColumn = "";
  let selectedAggregation = "sum";
  let selectedDateGrouping = "none";
  let currentFilters = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Validación de tipos de archivo permitidos
  const ALLOWED_TYPES = {
    "text/csv": "csv",
    "application/json": "json",
    "text/plain": "csv",
  };

  // ========== Inicialización ==========
  initializeApp();
  loadFromLocalStorage();

  function initializeApp() {
    // Event listeners básicos
    uploadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    uploadArea.addEventListener("click", (e) => {
      const isButtonClick = e.target === uploadBtn || uploadBtn.contains(e.target);
      if (!isButtonClick) {
        fileInput.click();
      }
    });

    // Drag & drop
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
        fileInput.value = "";
      }
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFile(file);
      } else {
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
        saveToLocalStorage();
      });
    });

    // Selectores
    xAxisSelect.addEventListener("change", () => {
      xAxisColumn = xAxisSelect.value;
      updateDateGroupingVisibility();
      validateChartConfig();
      saveToLocalStorage();
    });

    yAxisSelect.addEventListener("change", () => {
      yAxisColumn = yAxisSelect.value;
      validateChartConfig();
      saveToLocalStorage();
    });

    aggregationSelect.addEventListener("change", () => {
      selectedAggregation = aggregationSelect.value;
      saveToLocalStorage();
    });

    dateGroupingSelect.addEventListener("change", () => {
      selectedDateGrouping = dateGroupingSelect.value;
      saveToLocalStorage();
    });

    // Filtros
    applyFilterBtn.addEventListener("click", applyFilter);
    clearFilterBtn.addEventListener("click", clearFilters);
    filterIncompleteRows.addEventListener("change", () => {
      applyFilters();
      saveToLocalStorage();
    });

    // Búsqueda y paginación
    if (previewSearch) {
      previewSearch.addEventListener("input", handleSearch);
    }
    if (prevPageBtn) prevPageBtn.addEventListener("click", () => changePage(-1));
    if (nextPageBtn) nextPageBtn.addEventListener("click", () => changePage(1));

    // Exportación
    if (exportChartBtn) exportChartBtn.addEventListener("click", exportChart);
    if (exportDataBtn) exportDataBtn.addEventListener("click", exportData);

    // Generar gráfico
    generateChartBtn.addEventListener("click", generateChart);

    // Reiniciar
    resetBtn.addEventListener("click", () => showResetModal());

    // Modal
    modalCancelBtn.addEventListener("click", hideResetModal);
    modalConfirmBtn.addEventListener("click", confirmReset);
    modalOverlay.addEventListener("click", hideResetModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !resetModal.classList.contains("hidden")) {
        hideResetModal();
      }
    });
  }

  // ========== Detección de Tipos de Datos ==========

  /**
   * Detecta el tipo de dato de una columna
   */
  function detectColumnType(columnName, sampleSize = 100) {
    const samples = processedData
      .slice(0, sampleSize)
      .map((row) => row[columnName])
      .filter((val) => val !== null && val !== undefined && val !== "");

    if (samples.length === 0) return "text";

    // Detectar fechas
    let dateCount = 0;
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    ];

    samples.forEach((val) => {
      const str = String(val).trim();
      if (datePatterns.some((pattern) => pattern.test(str))) {
        dateCount++;
      } else {
        const date = new Date(str);
        if (!isNaN(date.getTime()) && str.length > 8) {
          dateCount++;
        }
      }
    });

    if (dateCount / samples.length > 0.7) {
      return "date";
    }

    // Detectar números
    let numberCount = 0;
    samples.forEach((val) => {
      const num = parseFloat(String(val));
      if (!isNaN(num) && isFinite(num)) {
        numberCount++;
      }
    });

    if (numberCount / samples.length > 0.7) {
      return "number";
    }

    return "text";
  }

  /**
   * Detecta tipos de todas las columnas
   */
  function detectAllColumnTypes() {
    columnTypes = {};
    headers.forEach((header) => {
      columnTypes[header] = detectColumnType(header);
    });
  }

  /**
   * Parsea una fecha en varios formatos
   */
  function parseDate(dateString) {
    if (!dateString) return null;

    const str = String(dateString).trim();
    const patterns = [
      { pattern: /^(\d{4})-(\d{2})-(\d{2})$/, parser: (m) => new Date(m[1], m[2] - 1, m[3]) },
      { pattern: /^(\d{2})\/(\d{2})\/(\d{4})$/, parser: (m) => new Date(m[3], m[2] - 1, m[1]) },
      { pattern: /^(\d{4})\/(\d{2})\/(\d{2})$/, parser: (m) => new Date(m[1], m[2] - 1, m[3]) },
    ];

    for (const { pattern, parser } of patterns) {
      const match = str.match(pattern);
      if (match) {
        const date = parser(match);
        if (!isNaN(date.getTime())) return date;
      }
    }

    const date = new Date(str);
    return !isNaN(date.getTime()) ? date : null;
  }

  /**
   * Agrupa fecha por año, mes o trimestre
   */
  function groupDate(dateString, grouping) {
    const date = parseDate(dateString);
    if (!date) return dateString;

    if (grouping === "year") {
      return date.getFullYear().toString();
    } else if (grouping === "month") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else if (grouping === "quarter") {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${date.getFullYear()}-Q${quarter}`;
    }

    return dateString;
  }

  // ========== Validación de Datos ==========

  /**
   * Detecta valores faltantes en los datos
   */
  function detectMissingValues() {
    const missingCounts = {};
    headers.forEach((header) => {
      let missing = 0;
      processedData.forEach((row) => {
        const val = row[header];
        if (val === null || val === undefined || val === "" || String(val).trim() === "") {
          missing++;
        }
      });
      if (missing > 0) {
        missingCounts[header] = missing;
      }
    });
    return missingCounts;
  }

  /**
   * Calcula estadísticas básicas para una columna numérica
   */
  function calculateStats(columnName) {
    const values = processedData
      .map((row) => parseFloat(row[columnName]))
      .filter((val) => !isNaN(val) && isFinite(val));

    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: mean,
      median: median,
      stdDev: stdDev,
      count: values.length,
      missing: processedData.length - values.length,
    };
  }

  /**
   * Muestra estadísticas de los datos
   */
  function displayStats() {
    if (!statsSection || !statsContent) return;

    statsContent.innerHTML = "";
    const missingValues = detectMissingValues();
    const hasMissing = Object.keys(missingValues).length > 0;

    if (hasMissing) {
      missingDataWarning.classList.remove("hidden");
    } else {
      missingDataWarning.classList.add("hidden");
    }

    // Estadísticas generales
    const generalStats = {
      "Total de Registros": processedData.length,
      "Columnas": headers.length,
      "Valores Faltantes": Object.values(missingValues).reduce((a, b) => a + b, 0),
    };

    Object.entries(generalStats).forEach(([label, value]) => {
      const statCard = document.createElement("div");
      statCard.className = "bg-slate-50 rounded-lg p-4 border border-slate-200";
      statCard.innerHTML = `
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">${label}</p>
        <p class="text-2xl font-bold text-slate-900">${value.toLocaleString()}</p>
      `;
      statsContent.appendChild(statCard);
    });

    // Estadísticas por columna numérica
    headers.forEach((header) => {
      if (columnTypes[header] === "number") {
        const stats = calculateStats(header);
        if (stats) {
          const statCard = document.createElement("div");
          statCard.className = "bg-slate-50 rounded-lg p-4 border border-slate-200";
          statCard.innerHTML = `
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">${header}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">Mín:</span>
                <span class="font-semibold">${stats.min.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Máx:</span>
                <span class="font-semibold">${stats.max.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Promedio:</span>
                <span class="font-semibold">${stats.mean.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Mediana:</span>
                <span class="font-semibold">${stats.median.toFixed(2)}</span>
              </div>
            </div>
          `;
          statsContent.appendChild(statCard);
        }
      }
    });

    statsSection.classList.remove("hidden");
  }

  // ========== Procesamiento de Archivos ==========

  /**
   * Maneja la carga y validación inicial del archivo
   */
  function handleFile(file) {
    fileError.classList.add("hidden");
    fileError.textContent = "";
    hideSuccessMessage();

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      showError(`El archivo es demasiado grande. Tamaño máximo: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`);
      fileInput.value = "";
      return;
    }

    // Validar extensión
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "csv" && fileExtension !== "json") {
      showError("Por favor, seleccione un archivo CSV o JSON válido.");
      fileInput.value = "";
      return;
    }

    // Mostrar indicador de carga
    showLoading();

    // Procesar según el tipo
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable && progressBarContainer) {
        const percent = (e.loaded / e.total) * 100;
        progressBar.style.width = percent + "%";
        progressText.textContent = Math.round(percent) + "%";
      }
    };

    reader.onload = (e) => {
      try {
        const result = e.target.result;

        if (!result || result.trim().length === 0) {
          showError("El archivo está vacío. Por favor, seleccione un archivo con contenido.");
          fileInput.value = "";
          hideLoading();
          return;
        }

        if (fileExtension === "csv") {
          processCSV(result);
        } else if (fileExtension === "json") {
          processJSON(result);
        }

        // Guardar en historial
        saveToHistory(file.name);
        showSuccessMessage(`Archivo "${file.name}" cargado exitosamente`);
      } catch (error) {
        showError(`Error al procesar el archivo: ${error.message}`);
        console.error("Error procesando archivo:", error);
        fileInput.value = "";
        hideLoading();
      }
    };

    reader.onerror = () => {
      showError("Error al leer el archivo. Por favor, intente nuevamente.");
      fileInput.value = "";
      hideLoading();
    };

    reader.onabort = () => {
      showError("La lectura del archivo fue cancelada.");
      fileInput.value = "";
      hideLoading();
    };

    reader.readAsText(file, "UTF-8");
  }

  /**
   * Procesa un archivo CSV
   */
  function processCSV(csvText) {
    try {
      const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");

      if (lines.length < 2) {
        showError("El archivo CSV debe contener al menos una fila de encabezados y una fila de datos.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      headers = parseCSVLine(lines[0]);

      if (headers.length === 0) {
        showError("No se pudieron leer los encabezados del archivo CSV.");
        fileInput.value = "";
        hideLoading();
        return;
      }

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
        hideLoading();
        return;
      }

      // Destruir gráfico anterior si existe
      if (currentChart) {
        try {
          currentChart.destroy();
        } catch (e) {
          console.warn("Error al destruir gráfico anterior:", e);
        }
        currentChart = null;
      }

      processedData = rawData;
      filteredData = [...processedData];
      detectAllColumnTypes();
      applyFilters();
      displayPreview();
      displayStats();
      populateSelects();
      
      // Ocultar visualización anterior
      visualizationSection.classList.add("hidden");
      chartEmpty.classList.remove("hidden");
      chartCanvas.classList.add("hidden");
      
      fileInput.value = "";
      hideLoading();
      saveToLocalStorage();
    } catch (error) {
      showError(`Error procesando CSV: ${error.message}`);
      hideLoading();
    }
  }

  /**
   * Parsea una línea CSV
   */
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Procesa un archivo JSON
   */
  function processJSON(jsonText) {
    try {
      if (!jsonText || typeof jsonText !== "string" || jsonText.trim().length === 0) {
        showError("El archivo JSON está vacío o no contiene datos válidos.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      let cleanedText = jsonText.trim();

      if (cleanedText.length < 2) {
        showError("El archivo JSON parece estar incompleto o corrupto.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      const data = JSON.parse(cleanedText);

      if (!Array.isArray(data) && typeof data !== "object") {
        showError("El archivo JSON debe ser un array o un objeto con una propiedad que contenga un array.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      let dataArray = [];
      if (Array.isArray(data)) {
        dataArray = data;
      } else if (typeof data === "object") {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            dataArray = data[key];
            break;
          }
        }

        if (dataArray.length === 0) {
          showError("No se encontró un array válido en el archivo JSON.");
          fileInput.value = "";
          hideLoading();
          return;
        }
      }

      if (dataArray.length === 0) {
        showError("El array de datos está vacío.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      if (typeof dataArray[0] !== "object" || Array.isArray(dataArray[0])) {
        showError("Los elementos del array deben ser objetos con propiedades clave-valor.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      headers = Object.keys(dataArray[0]);

      if (headers.length === 0) {
        showError("No se encontraron propiedades en los objetos del JSON.");
        fileInput.value = "";
        hideLoading();
        return;
      }

      rawData = dataArray.map((item) => {
        const row = {};
        headers.forEach((header) => {
          row[header] = item[header] !== undefined ? String(item[header]) : "";
        });
        return row;
      });

      // Destruir gráfico anterior si existe
      if (currentChart) {
        try {
          currentChart.destroy();
        } catch (e) {
          console.warn("Error al destruir gráfico anterior:", e);
        }
        currentChart = null;
      }

      processedData = rawData;
      filteredData = [...processedData];
      detectAllColumnTypes();
      applyFilters();
      displayPreview();
      displayStats();
      populateSelects();
      
      // Ocultar visualización anterior
      visualizationSection.classList.add("hidden");
      chartEmpty.classList.remove("hidden");
      chartCanvas.classList.add("hidden");
      
      fileInput.value = "";
      hideLoading();
      saveToLocalStorage();
    } catch (error) {
      let errorMessage = `Error al procesar JSON: ${error.message}.`;

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
      hideLoading();
      fileInput.value = "";
    }
  }

  // ========== Vista Previa Mejorada ==========

  let searchTerm = "";
  let currentPreviewData = [];

  /**
   * Muestra la vista previa con paginación y búsqueda
   */
  function displayPreview() {
    previewTableHead.innerHTML = "";
    previewTableBody.innerHTML = "";

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.className = "px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-900 cursor-pointer hover:bg-slate-100";
      th.textContent = header;
      th.addEventListener("click", () => sortTable(header));
      previewTableHead.appendChild(th);
    });

    currentPreviewData = filteredData;
    applySearch();
    renderPreviewPage();
  }

  /**
   * Aplica búsqueda a los datos
   */
  function applySearch() {
    if (!searchTerm) {
      currentPreviewData = filteredData;
      return;
    }

    const term = searchTerm.toLowerCase();
    currentPreviewData = filteredData.filter((row) => {
      return headers.some((header) => {
        const value = String(row[header] || "").toLowerCase();
        return value.includes(term);
      });
    });
  }

  /**
   * Maneja la búsqueda en tiempo real
   */
  function handleSearch(e) {
    searchTerm = e.target.value;
    currentPage = 1;
    applySearch();
    renderPreviewPage();
  }

  /**
   * Renderiza la página actual de la vista previa
   */
  function renderPreviewPage() {
    previewTableBody.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = currentPreviewData.slice(start, end);

    pageData.forEach((row) => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50 transition-colors";

      headers.forEach((header) => {
        const td = document.createElement("td");
        td.className = "px-6 py-4 text-sm text-slate-600";
        const value = row[header] || "";
        const displayValue = value.length > 50 ? value.substring(0, 50) + "..." : value;

        // Resaltar búsqueda
        if (searchTerm) {
          const lowerValue = displayValue.toLowerCase();
          const lowerTerm = searchTerm.toLowerCase();
          if (lowerValue.includes(lowerTerm)) {
            const index = lowerValue.indexOf(lowerTerm);
            const before = displayValue.substring(0, index);
            const match = displayValue.substring(index, index + searchTerm.length);
            const after = displayValue.substring(index + searchTerm.length);
            td.innerHTML = `${before}<mark class="bg-yellow-200">${match}</mark>${after}`;
          } else {
            td.textContent = displayValue;
          }
        } else {
          td.textContent = displayValue;
        }

        tr.appendChild(td);
      });

      previewTableBody.appendChild(tr);
    });

    // Actualizar contador y paginación
    const totalPages = Math.ceil(currentPreviewData.length / itemsPerPage);
    previewCount.textContent = `Mostrando ${start + 1}-${Math.min(end, currentPreviewData.length)} de ${currentPreviewData.length} registros`;

    if (paginationControls) {
      if (currentPreviewData.length > itemsPerPage) {
        paginationControls.classList.remove("hidden");
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
        if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
      } else {
        paginationControls.classList.add("hidden");
      }
    }

    if (previewSearch) {
      previewSearch.classList.remove("hidden");
    }

    dataPreviewSection.classList.remove("hidden");
    configSection.classList.remove("hidden");
  }

  /**
   * Cambia de página
   */
  function changePage(direction) {
    const totalPages = Math.ceil(currentPreviewData.length / itemsPerPage);
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderPreviewPage();
    }
  }

  /**
   * Ordena la tabla por columna
   */
  let sortColumn = null;
  let sortDirection = "asc";

  function sortTable(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    currentPreviewData.sort((a, b) => {
      let aVal = a[column] || "";
      let bVal = b[column] || "";

      if (columnTypes[column] === "number") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (columnTypes[column] === "date") {
        const aDate = parseDate(aVal);
        const bDate = parseDate(bVal);
        if (aDate && bDate) {
          aVal = aDate.getTime();
          bVal = bDate.getTime();
        }
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    currentPage = 1;
    renderPreviewPage();
  }

  // ========== Selectores Mejorados ==========

  /**
   * Pobla los selectores con detección de tipos
   */
  function populateSelects() {
    xAxisSelect.innerHTML = '<option value="">Seleccione una columna</option>';
    yAxisSelect.innerHTML = '<option value="">Seleccione una columna</option><option value="count">Conteo de Registros</option>';

    if (filterColumnSelect) {
      filterColumnSelect.innerHTML = '<option value="">Seleccionar columna para filtrar</option>';
    }

    headers.forEach((header) => {
      const type = columnTypes[header] || "text";
      const typeLabel = type === "number" ? " (numérico)" : type === "date" ? " (fecha)" : "";

      // Eje X - todas las columnas
      const optionX = document.createElement("option");
      optionX.value = header;
      optionX.textContent = header + typeLabel;
      xAxisSelect.appendChild(optionX);

      // Eje Y - solo numéricas y conteo
      if (type === "number") {
        const optionY = document.createElement("option");
        optionY.value = header;
        optionY.textContent = header + typeLabel;
        yAxisSelect.appendChild(optionY);
      }

      // Filtros - todas las columnas
      if (filterColumnSelect) {
        const optionFilter = document.createElement("option");
        optionFilter.value = header;
        optionFilter.textContent = header + typeLabel;
        filterColumnSelect.appendChild(optionFilter);
      }
    });

    // Restaurar selecciones guardadas
    if (xAxisColumn && headers.includes(xAxisColumn)) {
      xAxisSelect.value = xAxisColumn;
    }
    if (yAxisColumn && (yAxisColumn === "count" || headers.includes(yAxisColumn))) {
      yAxisSelect.value = yAxisColumn;
    }
  }

  /**
   * Actualiza visibilidad de agrupación de fechas
   */
  function updateDateGroupingVisibility() {
    if (dateGroupingContainer && xAxisColumn) {
      if (columnTypes[xAxisColumn] === "date") {
        dateGroupingContainer.classList.remove("hidden");
      } else {
        dateGroupingContainer.classList.add("hidden");
        dateGroupingSelect.value = "none";
        selectedDateGrouping = "none";
      }
    }
  }

  // ========== Filtros ==========

  /**
   * Aplica un filtro
   */
  function applyFilter() {
    const column = filterColumnSelect.value;
    const operator = filterOperatorSelect.value;
    const value = filterValueInput.value.trim();

    if (!column || !value) {
      showError("Por favor, complete todos los campos del filtro.");
      return;
    }

    currentFilters.push({ column, operator, value });
    applyFilters();
    clearFilterBtn.classList.remove("hidden");
    filterValueInput.value = "";
    saveToLocalStorage();
  }

  /**
   * Aplica todos los filtros
   */
  function applyFilters() {
    filteredData = [...processedData];

    // Filtrar filas incompletas si está activado
    if (filterIncompleteRows && filterIncompleteRows.checked) {
      filteredData = filteredData.filter((row) => {
        return headers.every((header) => {
          const val = row[header];
          return val !== null && val !== undefined && val !== "" && String(val).trim() !== "";
        });
      });
    }

    // Aplicar filtros personalizados
    currentFilters.forEach((filter) => {
      const { column, operator, value } = filter;
      const columnType = columnTypes[column] || "text";

      filteredData = filteredData.filter((row) => {
        const rowValue = row[column];
        const rowValueStr = String(rowValue || "").toLowerCase();
        const filterValueStr = value.toLowerCase();

        if (operator === "equals") {
          return rowValueStr === filterValueStr;
        } else if (operator === "contains") {
          return rowValueStr.includes(filterValueStr);
        } else if (operator === "greater" && columnType === "number") {
          return parseFloat(rowValue) > parseFloat(value);
        } else if (operator === "less" && columnType === "number") {
          return parseFloat(rowValue) < parseFloat(value);
        }

        return true;
      });
    });

    currentPage = 1;
    displayPreview();
    displayStats();
  }

  /**
   * Limpia todos los filtros
   */
  function clearFilters() {
    currentFilters = [];
    if (filterIncompleteRows) filterIncompleteRows.checked = false;
    clearFilterBtn.classList.add("hidden");
    filterValueInput.value = "";
    filterColumnSelect.value = "";
    applyFilters();
    saveToLocalStorage();
  }

  // ========== Agregaciones ==========

  /**
   * Aplica agregación a los datos
   */
  function aggregateData(data, column, aggregation) {
    if (aggregation === "count") {
      return data.length;
    }

    const values = data
      .map((row) => parseFloat(row[column]))
      .filter((val) => !isNaN(val) && isFinite(val));

    if (values.length === 0) return 0;

    switch (aggregation) {
      case "sum":
        return values.reduce((a, b) => a + b, 0);
      case "avg":
        return values.reduce((a, b) => a + b, 0) / values.length;
      case "max":
        return Math.max(...values);
      case "min":
        return Math.min(...values);
      default:
        return values.reduce((a, b) => a + b, 0);
    }
  }

  // ========== Generación de Gráficos Mejorada ==========

  /**
   * Valida la configuración del gráfico
   */
  function validateChartConfig() {
    if (!xAxisColumn || !yAxisColumn || !selectedChartType) {
      generateChartBtn.disabled = true;
      return;
    }

    // Validar que el eje Y sea numérico si no es conteo
    if (yAxisColumn !== "count") {
      const yType = columnTypes[yAxisColumn];
      if (yType !== "number") {
        generateChartBtn.disabled = true;
        return;
      }
    }

    generateChartBtn.disabled = false;
  }

  /**
   * Genera el gráfico con todas las mejoras
   */
  function generateChart() {
    if (!xAxisColumn || !yAxisColumn || !selectedChartType) {
      return;
    }

    // Validación adicional
    if (yAxisColumn !== "count" && columnTypes[yAxisColumn] !== "number") {
      showError("El eje Y debe ser una columna numérica o 'Conteo de Registros'.");
      return;
    }

    chartEmpty.classList.add("hidden");
    chartCanvas.classList.remove("hidden");

    let chartData = {};
    let labels = [];
    let datasets = [];

    // Preparar datos con agrupación de fechas si aplica
    const dataToUse = filteredData.length > 0 ? filteredData : processedData;
    const grouped = {};

    dataToUse.forEach((row) => {
      let category = String(row[xAxisColumn] || "Sin categoría");

      // Agrupar fechas si está configurado
      if (columnTypes[xAxisColumn] === "date" && selectedDateGrouping !== "none") {
        category = groupDate(category, selectedDateGrouping);
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(row);
    });

    // Ordenar categorías si son fechas
    labels = Object.keys(grouped);
    if (columnTypes[xAxisColumn] === "date") {
      labels.sort((a, b) => {
        const dateA = parseDate(a);
        const dateB = parseDate(b);
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.localeCompare(b);
      });
    } else if (columnTypes[xAxisColumn] === "number") {
      labels.sort((a, b) => parseFloat(a) - parseFloat(b));
    } else {
      labels.sort();
    }

    // Preparar datos según el tipo de gráfico
    if (selectedChartType === "scatter") {
      // Gráfico de dispersión necesita datos sin agrupar
      const scatterData = [];
      const scatterLabels = [];

      dataToUse.forEach((row) => {
        const xVal = row[xAxisColumn];
        const yVal = yAxisColumn === "count" ? 1 : parseFloat(row[yAxisColumn]) || 0;

        if (yAxisColumn !== "count" && isNaN(yVal)) return;

        scatterData.push({ x: parseFloat(xVal) || 0, y: yVal });
        scatterLabels.push(String(xVal));
      });

      datasets = [
        {
          label: yAxisColumn === "count" ? "Conteo" : yAxisColumn,
          data: scatterData,
          backgroundColor: getColors(1, selectedChartType),
        },
      ];

      chartData = {
        datasets: datasets,
      };
    } else if (selectedChartType === "combo") {
      // Gráfico combinado (barras + líneas)
      const barData = [];
      const lineData = [];

      labels.forEach((label) => {
        const group = grouped[label];
        const value = yAxisColumn === "count"
          ? group.length
          : aggregateData(group, yAxisColumn, selectedAggregation);

        barData.push(value);
        lineData.push(value);
      });

      datasets = [
        {
          type: "bar",
          label: yAxisColumn === "count" ? "Conteo" : yAxisColumn,
          data: barData,
          backgroundColor: getColors(labels.length, "bar"),
        },
        {
          type: "line",
          label: yAxisColumn === "count" ? "Conteo (línea)" : yAxisColumn + " (línea)",
          data: lineData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.35,
        },
      ];

      chartData = {
        labels: labels,
        datasets: datasets,
      };
    } else {
      // Gráficos normales (bar, line, pie, area)
      const data = [];

      labels.forEach((label) => {
        const group = grouped[label];
        const value = yAxisColumn === "count"
          ? group.length
          : aggregateData(group, yAxisColumn, selectedAggregation);

        data.push(value);
      });

      const backgroundColor = selectedChartType === "area"
        ? getColors(1, selectedChartType) + "80" // Con transparencia
        : getColors(labels.length, selectedChartType);

      datasets = [
        {
          label: yAxisColumn === "count" ? "Conteo" : yAxisColumn,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: selectedChartType === "area" || selectedChartType === "line" ? "#2563eb" : undefined,
          fill: selectedChartType === "area",
          tension: selectedChartType === "line" || selectedChartType === "area" ? 0.35 : undefined,
        },
      ];

      chartData = {
        labels: labels,
        datasets: datasets,
      };
    }

    // Destruir gráfico anterior de forma segura
    if (currentChart) {
      try {
        currentChart.destroy();
      } catch (e) {
        console.warn("Error al destruir gráfico anterior:", e);
      }
      currentChart = null;
    }

    // Limpiar el canvas antes de crear un nuevo gráfico
    const ctx = chartCanvas.getContext("2d");
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    // Configurar opciones
    const chartOptions = getChartOptions(selectedChartType);

    // Determinar tipo de gráfico para Chart.js
    let chartJsType = selectedChartType;
    if (selectedChartType === "combo") {
      chartJsType = "bar"; // Chart.js maneja combo con datasets mixtos
    } else if (selectedChartType === "area") {
      chartJsType = "line"; // Área es línea con fill
    } else if (selectedChartType === "scatter") {
      chartJsType = "scatter";
    }

    // Crear gráfico
    try {
      currentChart = new Chart(ctx, {
        type: chartJsType,
        data: chartData,
        options: chartOptions,
      });
    } catch (error) {
      console.error("Error al crear gráfico:", error);
      showError("Error al generar el gráfico. Por favor, intente nuevamente.");
      return;
    }

    // Actualizar título
    const chartTypeNames = {
      bar: "Barras",
      line: "Líneas",
      pie: "Torta",
      scatter: "Dispersión",
      area: "Área",
      combo: "Combinado",
    };

    const aggregationNames = {
      sum: "Suma",
      avg: "Promedio",
      max: "Máximo",
      min: "Mínimo",
      count: "Conteo",
    };

    chartTitle.textContent = `${yAxisColumn === "count" ? "Conteo" : aggregationNames[selectedAggregation] + " de " + yAxisColumn} por ${xAxisColumn}`;
    chartSubtitle.textContent = `Gráfico de ${chartTypeNames[selectedChartType]} - ${dataToUse.length} registros`;

    visualizationSection.classList.remove("hidden");
    visualizationSection.scrollIntoView({ behavior: "smooth", block: "start" });
    saveToLocalStorage();
    showSuccessMessage("Visualización generada exitosamente");
  }

  /**
   * Obtiene opciones de Chart.js mejoradas
   */
  function getChartOptions(chartType) {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartType === "pie" || chartType === "line" || chartType === "area" || chartType === "combo",
          position: "right",
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat("es-CR").format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
    };

    if (chartType === "bar" || chartType === "combo") {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat("es-CR").format(value);
              },
            },
          },
        },
      };
    } else if (chartType === "line" || chartType === "area") {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { color: "#e5e7eb" },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat("es-CR").format(value);
              },
            },
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
    } else if (chartType === "scatter") {
      return {
        ...baseOptions,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            grid: { color: "#e5e7eb" },
          },
          y: {
            grid: { color: "#e5e7eb" },
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat("es-CR").format(value);
              },
            },
          },
        },
      };
    }

    return baseOptions;
  }

  /**
   * Genera colores mejorados
   */
  function getColors(count, chartType) {
    const colors = [
      "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
      "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
    ];

    if (chartType === "bar" || chartType === "pie") {
      return Array.from({ length: count }, (_, i) => {
        const baseColor = colors[i % colors.length];
        if (chartType === "bar") {
          const opacity = 0.6 + (i % 2) * 0.3;
          return baseColor + Math.floor(opacity * 255).toString(16).padStart(2, "0");
        }
        return baseColor;
      });
    } else if (chartType === "line" || chartType === "area") {
      return colors[0];
    } else if (chartType === "scatter") {
      return colors[0] + "80"; // Con transparencia
    }

    return colors.slice(0, count);
  }

  // ========== Exportación ==========

  /**
   * Exporta el gráfico como imagen
   */
  function exportChart() {
    if (!currentChart) {
      showError("No hay gráfico para exportar.");
      return;
    }

    const format = "png"; // Puedes agregar selector de formato
    const url = chartCanvas.toDataURL(`image/${format}`);
    const link = document.createElement("a");
    link.download = `grafico-${Date.now()}.${format}`;
    link.href = url;
    link.click();
    showSuccessMessage("Gráfico exportado exitosamente");
  }

  /**
   * Exporta los datos procesados
   */
  function exportData() {
    const dataToExport = filteredData.length > 0 ? filteredData : processedData;

    if (dataToExport.length === 0) {
      showError("No hay datos para exportar.");
      return;
    }

    // Crear CSV
    const csvRows = [];
    csvRows.push(headers.join(","));

    dataToExport.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header] || "";
        // Escapar comillas y comas
        if (String(val).includes(",") || String(val).includes('"')) {
          return `"${String(val).replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `datos-exportados-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showSuccessMessage("Datos exportados exitosamente");
  }

  // ========== LocalStorage y Historial ==========

  /**
   * Guarda estado en localStorage
   */
  function saveToLocalStorage() {
    try {
      const state = {
        xAxisColumn,
        yAxisColumn,
        selectedChartType,
        selectedAggregation,
        selectedDateGrouping,
        filters: currentFilters,
        filterIncomplete: filterIncompleteRows ? filterIncompleteRows.checked : false,
      };
      localStorage.setItem("exploracionState", JSON.stringify(state));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  /**
   * Carga estado desde localStorage
   */
  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem("exploracionState");
      if (saved) {
        const state = JSON.parse(saved);
        xAxisColumn = state.xAxisColumn || "";
        yAxisColumn = state.yAxisColumn || "";
        selectedChartType = state.selectedChartType || "bar";
        selectedAggregation = state.selectedAggregation || "sum";
        selectedDateGrouping = state.selectedDateGrouping || "none";
        currentFilters = state.filters || [];
        if (state.filterIncomplete && filterIncompleteRows) {
          filterIncompleteRows.checked = true;
        }

        // Restaurar UI si hay datos
        if (processedData.length > 0) {
          if (xAxisSelect) xAxisSelect.value = xAxisColumn;
          if (yAxisSelect) yAxisSelect.value = yAxisColumn;
          if (aggregationSelect) aggregationSelect.value = selectedAggregation;
          if (dateGroupingSelect) dateGroupingSelect.value = selectedDateGrouping;

          // Restaurar botones de tipo de gráfico
          chartTypeBtns.forEach((btn) => {
            if (btn.dataset.chartType === selectedChartType) {
              btn.classList.add("bg-sky-700", "text-white");
              btn.classList.remove("bg-slate-100", "text-slate-900");
            } else {
              btn.classList.remove("bg-sky-700", "text-white");
              btn.classList.add("bg-slate-100", "text-slate-900");
            }
          });

          validateChartConfig();
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar desde localStorage:", e);
    }
  }

  /**
   * Guarda archivo en historial
   */
  function saveToHistory(fileName) {
    try {
      const history = JSON.parse(localStorage.getItem("fileHistory") || "[]");
      const entry = {
        name: fileName,
        timestamp: Date.now(),
      };

      // Evitar duplicados
      const filtered = history.filter((h) => h.name !== fileName);
      filtered.unshift(entry);

      // Limitar a 10 archivos
      const limited = filtered.slice(0, 10);
      localStorage.setItem("fileHistory", JSON.stringify(limited));
    } catch (e) {
      console.warn("No se pudo guardar historial:", e);
    }
  }

  // ========== UI Helpers ==========

  /**
   * Muestra indicador de carga
   */
  function showLoading() {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    if (progressBarContainer) {
      progressBarContainer.classList.remove("hidden");
      progressBar.style.width = "0%";
      progressText.textContent = "0%";
    }
  }

  /**
   * Oculta indicador de carga
   */
  function hideLoading() {
    if (loadingIndicator) loadingIndicator.classList.add("hidden");
    if (progressBarContainer) progressBarContainer.classList.add("hidden");
  }

  /**
   * Muestra mensaje de éxito
   */
  function showSuccessMessage(message) {
    if (successMessage && successText) {
      successText.textContent = message;
      successMessage.classList.remove("hidden");
      setTimeout(() => {
        hideSuccessMessage();
      }, 5000);
    }
  }

  /**
   * Oculta mensaje de éxito
   */
  function hideSuccessMessage() {
    if (successMessage) successMessage.classList.add("hidden");
  }

  /**
   * Muestra error
   */
  function showError(message) {
    fileError.textContent = message;
    fileError.classList.remove("hidden");
    hideLoading();
  }

  // ========== Modal ==========

  function showResetModal() {
    resetModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function hideResetModal() {
    resetModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function confirmReset() {
    hideResetModal();

    // Destruir gráfico anterior de forma segura
    if (currentChart) {
      try {
        currentChart.destroy();
      } catch (e) {
        console.warn("Error al destruir gráfico al reiniciar:", e);
      }
      currentChart = null;
    }

    rawData = [];
    processedData = [];
    filteredData = [];
    headers = [];
    columnTypes = {};
    selectedChartType = "bar";
    xAxisColumn = "";
    yAxisColumn = "";
    selectedAggregation = "sum";
    selectedDateGrouping = "none";
    currentFilters = [];
    currentPage = 1;
    searchTerm = "";
    currentPreviewData = [];

    fileInput.value = "";
    previewTableHead.innerHTML = "";
    previewTableBody.innerHTML = "";
    if (xAxisSelect) xAxisSelect.innerHTML = '<option value="">Seleccione una columna</option>';
    if (yAxisSelect) {
      yAxisSelect.innerHTML = '<option value="">Seleccione una columna</option><option value="count">Conteo de Registros</option>';
    }
    if (previewSearch) previewSearch.value = "";
    if (filterColumnSelect) filterColumnSelect.innerHTML = '<option value="">Seleccionar columna para filtrar</option>';

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
    dataPreviewSection.classList.add("hidden");
    configSection.classList.add("hidden");
    visualizationSection.classList.add("hidden");
    statsSection.classList.add("hidden");
    chartEmpty.classList.remove("hidden");
    chartCanvas.classList.add("hidden");
    fileError.classList.add("hidden");
    hideSuccessMessage();
    clearFilters();

    localStorage.removeItem("exploracionState");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
