# Code Quality API

API REST para la gestión de proyectos y tareas, desarrollada con Node.js y Express. Incluye integración con SonarQube para análisis de calidad de código.

## Descripción

Esta aplicación proporciona una API RESTful para gestionar proyectos y sus tareas asociadas. Utiliza SQLite como base de datos y está diseñada para ser desplegada fácilmente con Docker.

### Características

- Gestión de proyectos (CRUD completo)
- Gestión de tareas asociadas a proyectos
- Base de datos SQLite con relaciones entre tablas
- Análisis de calidad de código con SonarQube
- CI/CD con GitHub Actions
- Contenedorización con Docker

## 🛠️ Tecnologías

- **Node.js** 18
- **Express.js** 5.1.0
- **SQLite3** 5.1.7
- **Docker**
- **SonarQube/SonarCloud** para análisis de código

## 🚀 Instalación Local

### Requisitos previos

- Node.js 18 o superior
- npm o yarn

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd code-quality
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Modo desarrollo

Para ejecutar en modo desarrollo con recarga automática:
```bash
npm run dev
```

## 🐳 Instalación y Pruebas con Docker

### Requisitos previos

- Docker instalado en tu sistema

### Construcción de la imagen

```bash
docker build -t code-quality-api .
```

### Ejecución del contenedor

```bash
docker run -d -p 3000:3000 --name code-quality code-quality-api
```

### Detener y eliminar el contenedor

```bash
# Detener el contenedor
docker stop code-quality

# Eliminar el contenedor
docker rm code-quality
```

## 📡 Endpoints de la API

### Proyectos

- `GET /projects` - Listar todos los proyectos
- `GET /projects/:id` - Obtener un proyecto específico
- `POST /projects` - Crear un nuevo proyecto
- `PUT /projects/:id` - Actualizar un proyecto
- `DELETE /projects/:id` - Eliminar un proyecto
- `GET /projects/:id/tasks` - Listar tareas de un proyecto
- `POST /projects/:id/tasks` - Crear una tarea en un proyecto

### Tareas

- `GET /tasks` - Listar todas las tareas
- `GET /tasks/:id` - Obtener una tarea específica
- `PUT /tasks/:id` - Actualizar una tarea
- `DELETE /tasks/:id` - Eliminar una tarea

## 🔍 Análisis de Calidad de Código

El proyecto incluye integración con SonarQube/SonarCloud para análisis continuo de calidad de código. El análisis se ejecuta automáticamente en cada push a la rama `main` y en pull requests mediante GitHub Actions.

## 🧪 Testing

El proyecto utiliza **Jest** como framework de testing junto con **Supertest** para realizar tests de integración de la API.

### Requisitos previos

Las dependencias de testing ya están incluidas en `package.json`:
- `jest`: Framework de testing
- `supertest`: Para tests de integración HTTP

### Ejecutar los tests

1. **Ejecutar todos los tests:**
```bash
npm test
```

2. **Ejecutar tests en modo watch (recarga automática):**
```bash
npm run test:watch
```

3. **Ejecutar tests con cobertura de código:**
```bash
npm run test:coverage
```

## 🧹 Linting

ESLint está configurado para analizar todo el código dentro de `src/` y fallar ante cualquier warning. Para ejecutar el análisis estático:

```bash
npm run lint
```

### Ejemplos de tests incluidos

Los tests cubren las siguientes funcionalidades:

**Proyectos:**
- ✅ Crear un proyecto
- ✅ Listar todos los proyectos
- ✅ Obtener un proyecto específico
- ✅ Actualizar un proyecto
- ✅ Eliminar un proyecto
- ✅ Validación de campos obligatorios
- ✅ Manejo de errores (404, 400)

**Tareas:**
- ✅ Crear una tarea en un proyecto
- ✅ Listar todas las tareas
- ✅ Obtener una tarea específica
- ✅ Actualizar una tarea
- ✅ Eliminar una tarea
- ✅ Listar tareas de un proyecto
- ✅ Estado por defecto (PENDING)
- ✅ Validación de campos obligatorios
- ✅ Manejo de errores (404, 400)

### Ejecutar tests en Docker

Para ejecutar los tests dentro de un contenedor Docker:

```bash
# Construir la imagen
docker build -t code-quality-api .

# Ejecutar los tests
docker run --rm code-quality-api npm test
```

