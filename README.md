# Observatorio de Datos Públicos – Costa Rica

Plataforma independiente dedicada al monitoreo técnico y la visualización de datos gubernamentales en Costa Rica. Fomentamos una cultura de transparencia y rendición de cuentas basada en hechos.

## Descripción

El Observatorio de Datos Públicos es una plataforma web estática que centraliza y procesa información oficial de Costa Rica para ofrecer una visión clara del estado del país en áreas críticas como educación, salud e infraestructura. El proyecto está diseñado para ser completamente frontend, optimizado para Netlify, y permite a los usuarios cargar y analizar archivos CSV y JSON localmente en sus navegadores.

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
- **Protección de credenciales**: El proyecto incluye `.gitignore` para prevenir que archivos sensibles (como `.env`, credenciales, etc.) se suban accidentalmente al repositorio

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
│   ├── analytics.js
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
├── views/
│   ├── analisis.html
│   ├── bitacora.html
│   ├── datasets.html
│   ├── documentacion.html
│   ├── exploracion.html
│   ├── glosario.html
│   ├── index.html
│   ├── metodologia.html
│   └── preguntas.html
├── .gitignore
├── netlify.toml
├── robots.txt
└── sitemap.xml
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3 / Tailwind CSS**: Diseño responsive y moderno
- **JavaScript (ES6+)**: Lógica de procesamiento y visualización
- **Chart.js**: Biblioteca para visualización de datos
- **Netlify**: Hosting estático con CDN global y despliegue automático
- **Google Analytics 4**: Seguimiento y análisis de tráfico
- **Schema.org**: Structured data para mejor SEO y rich snippets

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

### Uso en Netlify

El proyecto está optimizado para Netlify. Para desplegar:

1. Conecta tu repositorio de GitHub a Netlify
2. Netlify detectará automáticamente la configuración en `netlify.toml`
3. El sitio se desplegará automáticamente en cada push

**Nota técnica:** El proyecto utiliza rutas absolutas (que comienzan con `/`) en lugar de rutas relativas para garantizar compatibilidad con el despliegue en Netlify. Esto asegura que los recursos (CSS, JavaScript, imágenes) se carguen correctamente independientemente de la estructura de directorios.

**Configuración adicional requerida:**
- Actualiza las URLs en `sitemap.xml` con tu dominio de Netlify
- Configura Google Analytics (ver sección "Configuración de Google Analytics" más abajo)
- Verifica tu sitio en Google Search Console (ver sección "SEO y Visibilidad Web" más abajo)

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

## Configuración de Google Analytics

Este proyecto incluye soporte para Google Analytics 4. Para habilitarlo, sigue estos pasos:

### Pasos de Configuración

1. **Crear una cuenta de Google Analytics 4**
   - Ve a [Google Analytics](https://analytics.google.com/)
   - Crea una nueva propiedad para tu sitio web
   - Obtén tu Measurement ID (formato: `G-XXXXXXXXXX`)

2. **Configurar el ID en el proyecto**
   - Abre el archivo `Js/analytics.js`
   - Reemplaza `G-XXXXXXXXXX` en la línea 4 con tu Measurement ID real:
   ```javascript
   const GA_MEASUREMENT_ID = 'G-TU-ID-REAL-AQUI';
   ```

3. **Verificar la instalación**
   - Despliega el sitio en Netlify
   - Visita tu sitio y abre las herramientas de desarrollador
   - Ve a la pestaña "Network" y busca solicitudes a `google-analytics.com` o `googletagmanager.com`
   - También puedes usar la extensión "Google Analytics Debugger" para Chrome

### Eventos Personalizados

El código ya incluye seguimiento automático de:
- Clics en enlaces de navegación
- Descargas de archivos
- Generación de gráficos (en exploracion.html)

### Notas Importantes

- El código de Analytics solo se carga si has configurado un ID válido (diferente de `G-XXXXXXXXXX`)
- Los datos se procesan de forma anónima (`anonymize_ip: true`)
- No se rastrean datos personales de los usuarios
- Todos los datos se procesan localmente en el navegador del usuario

## SEO y Visibilidad Web

### Mejoras Implementadas

El proyecto incluye optimizaciones completas de SEO para mejorar la visibilidad en buscadores:

#### Archivos de Configuración
- `sitemap.xml` - Mapa del sitio para buscadores
- `robots.txt` - Instrucciones para crawlers
- `netlify.toml` - Configuración de headers y redirecciones

#### Meta Tags y SEO Básico
- Meta descriptions únicas en todas las páginas
- Meta keywords relevantes
- Open Graph tags (Facebook, LinkedIn) usando `favicon.svg`
- Twitter Cards usando `favicon.svg`
- Canonical URLs en cada página
- Meta viewport (responsive)

#### Structured Data (Schema.org)
- Organization schema en index.html
- WebSite schema en index.html
- DataCatalog schema en index.html y datasets.html
- WebApplication schema en exploracion.html
- CollectionPage schema en analisis.html
- TechArticle schema en documentacion.html
- FAQPage schema en preguntas.html

#### Navegación y Estructura
- Roles ARIA (banner, main, navigation)
- Estructura semántica HTML5
- Enlaces descriptivos (no "clic aquí")

#### Performance
- Chart.js con carga diferida (defer)
- Headers de caché en netlify.toml
- Compresión de assets configurada

### Acciones Requeridas para SEO

#### 1. Actualizar URLs en sitemap.xml
Edita `sitemap.xml` y reemplaza `https://observatorio-datos-publicos-cr.netlify.app` con tu URL real de Netlify.

#### 2. Configurar Google Search Console
1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega tu propiedad (URL del sitio)
3. Verifica la propiedad usando uno de los métodos disponibles
4. Envía el sitemap: `https://tu-dominio.netlify.app/sitemap.xml`

#### 3. Optimizar Imágenes
- Agrega `alt` text descriptivo a todas las imágenes
- Considera usar formatos modernos (WebP) para mejor compresión
- Optimiza el tamaño de las imágenes

#### 4. Revisar Contenido
- Asegúrate de que todos los enlaces funcionen
- Verifica que los textos sean descriptivos y relevantes
- Revisa que las palabras clave estén presentes de forma natural

#### 5. Testing
- Usa [Google Rich Results Test](https://search.google.com/test/rich-results) para verificar structured data
- Usa [PageSpeed Insights](https://pagespeed.web.dev/) para verificar performance
- Usa [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) para verificar responsive

### Monitoreo Continuo

Después del despliegue:
1. Monitorea Google Search Console para errores de indexación
2. Revisa Google Analytics para entender el tráfico
3. Actualiza el sitemap cuando agregues nuevas páginas
4. Mantén el contenido actualizado y relevante

### Recursos Útiles

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## Páginas del Sitio

- **Inicio** (`index.html`): Página principal con información general y módulos de análisis
- **Inicio** (`index.html`): Página principal con información general y módulos de análisis
- **Análisis** (`analisis.html`): Visualización de indicadores por área temática
- **Metodología** (`metodologia.html`): Descripción de los métodos y criterios utilizados
- **Explorar Análisis** (`exploracion.html`): Herramienta interactiva para cargar y analizar archivos propios
- **Documentación** (`documentacion.html`): Guía técnica completa de la API
- **Datasets Crudos** (`datasets.html`): Listado de conjuntos de datos disponibles
- **Glosario Técnico** (`glosario.html`): Definiciones de términos técnicos utilizados
- **Preguntas Frecuentes** (`preguntas.html`): Respuestas a las preguntas más comunes sobre el observatorio
- **Bitácora de Errores** (`bitacora.html`): Registro público de errores, limitaciones y correcciones identificadas en las fuentes de datos gubernamentales

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

## Bitácora de Errores de Origen

Este documento registra de manera transparente los errores, limitaciones y correcciones identificadas en las fuentes de datos gubernamentales utilizadas por el Observatorio.

### Propósito

Esta bitácora tiene como objetivo:

- Mantener un registro público y actualizado de problemas identificados en las fuentes de datos
- Documentar las correcciones aplicadas y metodologías de mitigación
- Informar a los usuarios sobre las limitaciones de los datos
- Fomentar la mejora continua de la calidad de los datos públicos

### Estado de los Errores

- **Pendiente**: Error identificado, corrección en proceso
- **En Revisión**: Corrección implementada, en fase de validación
- **Resuelto**: Error corregido y validado

### Registro de Errores

#### Ejemplo: Datos Faltantes en Serie Temporal

- **Fuente**: INEC - Censo 2022
- **Fecha de identificación**: 2026-01-15
- **Estado**: Pendiente
- **Impacto**: Medio
- **Descripción**: Se identificaron valores faltantes en la serie temporal de matrícula educativa para el período 2019-2020. Los datos correspondientes a algunas regiones educativas no están disponibles en la fuente oficial.
- **Mitigación aplicada**: Se documenta la ausencia de datos y se indica claramente en las visualizaciones correspondientes. Los análisis se realizan únicamente con los datos disponibles.

### Limitaciones Conocidas

#### Retraso en Actualizaciones

Algunas fuentes de datos gubernamentales tienen retrasos inherentes en sus actualizaciones. Los datos pueden reflejar información de períodos anteriores debido a los procesos de recolección y validación institucional.

**Instituciones afectadas**: MEP, CCSS, MOPT

#### Variabilidad en Formatos

Las diferentes instituciones públicas utilizan formatos y estructuras de datos variadas, lo que requiere procesos de normalización que pueden introducir pequeñas discrepancias.

**Impacto**: Bajo - Se aplican procesos de normalización automática

#### Cobertura Geográfica

Algunos indicadores pueden tener cobertura limitada a ciertas regiones o provincias, dependiendo de la disponibilidad de datos en las fuentes oficiales.

**Áreas afectadas**: Regiones rurales, datos históricos anteriores a 2010

### Correcciones Aplicadas

#### Corrección: Normalización de Nombres de Provincias

- **Fuente**: Múltiples instituciones
- **Fecha de corrección**: 2026-01-10
- **Estado**: Resuelto
- **Descripción**: Se identificaron inconsistencias en los nombres de provincias entre diferentes fuentes de datos (ej: "San José" vs "San Jose"). Se implementó un proceso de normalización automática.
- **Método**: Normalización automática mediante diccionario de equivalencias
- **Validación**: Verificado en todos los datasets actuales

### Proceso de Actualización

Esta bitácora se actualiza periódicamente conforme:

1. Se identifican nuevos errores durante el proceso de análisis
2. Se resuelven problemas existentes
3. Se descubren nuevas limitaciones en las fuentes de datos
4. Se implementan mejoras en los procesos de normalización

**Frecuencia de actualización**: Mensual o cuando se identifique un error crítico

Para consultar la versión completa y actualizada, visite la [página de Bitácora en el sitio web](views/bitacora.html) o consulte esta sección en el README.

## Contacto

Para preguntas, sugerencias o colaboraciones, puedes:

- Abrir un Issue en GitHub
- Contactar al autor a través de LinkedIn
- Visitar el sitio web del proyecto

---

Copyright 2026 Observatorio de Datos Públicos – Costa Rica. Todos los derechos reservados.
