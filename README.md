# Observatorio de Datos Públicos – Costa Rica

Plataforma independiente dedicada al monitoreo técnico y la visualización de datos gubernamentales en Costa Rica. Fomentamos una cultura de transparencia y rendición de cuentas basada en hechos.

## Descripción

El Observatorio de Datos Públicos es una plataforma web estática que centraliza y procesa información oficial de Costa Rica para ofrecer una visión clara del estado del país en áreas críticas como educación, salud e infraestructura. El proyecto está diseñado para ser completamente frontend, compatible con GitHub Pages, y permite a los usuarios cargar y analizar archivos CSV y JSON localmente en sus navegadores.

### Misión

Democratizar el acceso a la información técnica, permitiendo que tanto tomadores de decisiones como ciudadanía en general puedan monitorear el progreso nacional sin sesgos políticos. El observatorio prioriza la trazabilidad: cada módulo indica el tipo de indicador, la unidad de medida y una interpretación breve para reducir el riesgo de malas lecturas de los datos.

## Características Principales

### Análisis de Datos Interactivo

- **Carga de archivos**: Soporte para archivos CSV y JSON con validación automática
- **Detección automática de tipos**: Identifica automáticamente columnas numéricas, de texto y fechas
- **Visualización avanzada**: Seis tipos de gráficos (barras, líneas, torta, dispersión, área, combinado)
- **Agregaciones**: Suma, promedio, máximo, mínimo y conteo de valores
- **Filtros avanzados**: Filtrado por igual, contiene, mayor que o menor que
- **Agrupación de fechas**: Agrupación automática por año, mes o trimestre
- **Exportación**: Descarga de gráficos como imágenes PNG y exportación de datos procesados a CSV

### Módulos de Análisis

- **Educación**: Matrícula, tasas de deserción y rendimiento en pruebas estandarizadas por región educativa
- **Salud**: Capacidad hospitalaria, tiempos de espera y cobertura de vacunación por provincia
- **Infraestructura**: Inversión en carreteras, acceso a servicios básicos y conectividad

### Privacidad y Seguridad

- **Procesamiento local**: Todos los datos se procesan localmente en el navegador del usuario
- **Sin almacenamiento**: Los datos no se envían a servidores externos
- **Código abierto**: Metodologías de procesamiento y visualización auditables en GitHub

## Estructura del Proyecto

```
ObservatorioDatosPublicos/
├── assets/
│   └── favicon.svg
├── data/
│   ├── educacion.csv
│   ├── infraestructura.csv
│   └── salud.json
├── Js/
│   ├── analisis.js
│   ├── exploracion.js
│   ├── main.js
│   ├── metodologia.js
│   ├── tailwind-config.js
│   └── tailwind-theme.js
├── Styles/
│   ├── analisis.css
│   ├── exploracion.css
│   ├── metodologia.css
│   └── styles.css
└── views/
    ├── analisis.html
    ├── datasets.html
    ├── documentacion.html
    ├── exploracion.html
    ├── glosario.html
    ├── index.html
    └── metodologia.html
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3 / Tailwind CSS**: Diseño responsive y moderno
- **JavaScript (ES6+)**: Lógica de procesamiento y visualización
- **Chart.js**: Biblioteca para visualización de datos
- **GitHub Pages**: Hosting estático

## Instalación y Uso

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar recursos CDN)

### Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/Acamacho20027/ObservatorioDatosPublicos.git
cd ObservatorioDatosPublicos
```

2. Abrir el proyecto en un servidor local. Puedes usar:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
   - PHP: `php -S localhost:8000`

3. Acceder a `http://localhost:8000/views/index.html` en tu navegador

### Uso en GitHub Pages

El proyecto está configurado para funcionar directamente en GitHub Pages. Simplemente habilita GitHub Pages en la configuración del repositorio y selecciona la rama principal.

## Documentación de la API

### Formatos de Archivo Soportados

#### CSV (Comma-Separated Values)

- Primera fila: Encabezados de columna separados por comas
- Filas siguientes: Datos correspondientes a cada columna
- Valores que contengan comas deben estar entre comillas dobles
- Codificación: UTF-8 recomendada

Ejemplo:
```csv
anio,provincia,matricula_primaria,tasa_desercion
2021,San José,145000,3.2
2021,Alajuela,82000,3.8
2022,San José,147500,3.0
```

#### JSON (JavaScript Object Notation)

Debe ser un array de objetos, donde cada objeto representa un registro:

```json
[
  {
    "anio": 2021,
    "provincia": "San José",
    "hospitales": 12,
    "cobertura_vacunacion": 85.5
  },
  {
    "anio": 2022,
    "provincia": "Alajuela",
    "hospitales": 6,
    "cobertura_vacunacion": 82.3
  }
]
```

### Tipos de Datos Soportados

- **Numéricos**: Valores enteros o decimales. Se detectan automáticamente y solo aparecen en el selector del eje Y
- **Texto**: Cadenas de texto y categorías. Ideales para el eje X o para filtros
- **Fechas**: Formatos soportados incluyen YYYY-MM-DD, DD/MM/YYYY, YYYY/MM/DD. Permiten agrupación por año, mes o trimestre

### Tipos de Visualizaciones

1. **Gráfico de Barras**: Ideal para comparar categorías
2. **Gráfico de Líneas**: Perfecto para mostrar tendencias temporales
3. **Gráfico de Torta**: Útil para mostrar proporciones o distribuciones porcentuales
4. **Gráfico de Dispersión**: Ideal para identificar relaciones y correlaciones entre dos variables numéricas
5. **Gráfico de Área**: Similar a líneas pero con el área bajo la curva rellena
6. **Gráfico Combinado**: Combina barras y líneas en un solo gráfico

### Agregaciones Disponibles

- **Suma**: Suma todos los valores del grupo
- **Promedio**: Calcula el promedio (media aritmética) de los valores
- **Máximo**: Obtiene el valor más alto dentro del grupo
- **Mínimo**: Obtiene el valor más bajo dentro del grupo
- **Conteo**: Cuenta el número de registros en cada grupo

### Límites y Restricciones

- Tamaño máximo de archivo: 50MB
- Formatos soportados: CSV y JSON únicamente
- Procesamiento: 100% frontend, sin backend

Para más detalles, consulta la [Documentación Técnica](views/documentacion.html).

## Páginas del Sitio

- **Inicio** (`index.html`): Página principal con información general y módulos de análisis
- **Análisis** (`analisis.html`): Visualización de indicadores por área temática
- **Metodología** (`metodologia.html`): Descripción de los métodos y criterios utilizados
- **Explorar Análisis** (`exploracion.html`): Herramienta interactiva para cargar y analizar archivos propios
- **Documentación** (`documentacion.html`): Guía técnica completa de la API
- **Datasets Crudos** (`datasets.html`): Listado de conjuntos de datos disponibles
- **Glosario Técnico** (`glosario.html`): Definiciones de términos técnicos utilizados

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Mantén el código limpio y bien documentado
- Sigue las convenciones de código existentes
- Asegúrate de que los cambios funcionen en navegadores modernos
- Actualiza la documentación según sea necesario

## Licencia

Este proyecto está bajo una licencia de código abierto. Consulta el archivo LICENSE para más detalles.

## Autor

**Andrés Camacho Sánchez**

- LinkedIn: [Perfil de LinkedIn](https://www.linkedin.com/in/andr%C3%A9s-camacho-s%C3%A1nchez-672b7b286)
- Portfolio: [Portfolio Personal](https://acamacho20027.github.io/PerfilAndresCamachoSanchez/)
- GitHub: [@Acamacho20027](https://github.com/Acamacho20027)

## Agradecimientos

- A la comunidad de desarrolladores de código abierto
- A las instituciones públicas que proporcionan datos abiertos
- A todos los contribuidores y usuarios del proyecto

## Estado del Proyecto

Este proyecto está en desarrollo activo. Las funcionalidades principales están implementadas y funcionando. Se aceptan sugerencias y reportes de errores a través de los Issues de GitHub.

## Contacto

Para preguntas, sugerencias o colaboraciones, puedes:

- Abrir un Issue en GitHub
- Contactar al autor a través de LinkedIn
- Visitar el sitio web del proyecto

---

Copyright 2026 Observatorio de Datos Públicos – Costa Rica. Todos los derechos reservados.
