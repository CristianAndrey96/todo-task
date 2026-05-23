# Todo Tasks 📝

Una aplicación web **Full-Stack** moderna para la gestión de tareas (To-Do List) que utiliza un backend robusto basado en **Node.js, Express y MongoDB (Mongoose)**, y una interfaz de usuario interactiva, limpia y responsiva en el frontend construida con **HTML5, CSS3 y JavaScript Vanilla**.

---

## 🚀 Tecnologías Utilizadas

### Backend
*   **Node.js**: Entorno de ejecución para JavaScript.
*   **Express**: Framework de servidor para Node.js que gestiona las rutas y peticiones HTTP.
*   **Mongoose**: ODM (Object Document Mapper) para MongoDB, utilizado para definir esquemas y modelar los datos de la aplicación.
*   **node-env-file**: Librería para cargar variables de entorno desde un archivo `.env` local en desarrollo.
*   **body-parser**: Middleware de Express para parsear cuerpos de peticiones JSON.

### Frontend
*   **HTML5 & CSS3**: Estructura y diseño premium con gradientes dinámicos, sombras suaves y micro-animaciones en las interacciones (efectos de hover, transiciones de escala, etc.).
*   **JavaScript (Vanilla)**: Manipulación dinámica del DOM y peticiones asíncronas con la API `Fetch` (para una experiencia fluida sin recargas de página).

---

## 📂 Estructura del Proyecto

El proyecto está organizado de manera sencilla y clara en la raíz:

```text
todo-task/
├── node_modules/         # Dependencias del proyecto (instaladas por npm)
├── api.js                # Definición de rutas Express de la API y conexión a MongoDB Atlas
├── server.js             # Punto de entrada de la aplicación y configuración del servidor
├── task_schema.js        # Esquema de datos (Mongoose) para la entidad "task"
├── index.html            # Interfaz de usuario (HTML, CSS integrado y JS cliente)
├── package.json          # Archivo de configuración de dependencias y scripts de Node.js
├── package-lock.json     # Registro detallado de versiones de dependencias
├── .env                  # Archivo local con variables de entorno (ignorado en Git)
├── .env.dist             # Plantilla de variables de entorno para configuración
└── .gitignore            # Archivos y carpetas excluidos del control de versiones
```

### Descripción de Componentes Clave
1.  **[server.js](file:///d:/DESARROLLO%20DE%20SOFTWARE-PARQUESOFT%20TI/Proyecto%20Integrador%203/todo-task/server.js)**: Configura la instancia de Express en el puerto `3000` (o el puerto que dicte la variable de entorno `PORT`). Sirve la interfaz estática en el endpoint `/` y delega las llamadas API al enrutador de `api.js` bajo el prefijo `/api`.
2.  **[api.js](file:///d:/DESARROLLO%20DE%20SOFTWARE-PARQUESOFT%20TI/Proyecto%20Integrador%203/todo-task/api.js)**: Carga las variables de entorno de conexión para MongoDB (soporta carga local o entornos en la nube como Render). Establece la conexión asíncrona a la base de datos y define las operaciones CRUD principales.
3.  **[task_schema.js](file:///d:/DESARROLLO%20DE%20SOFTWARE-PARQUESOFT%20TI/Proyecto%20Integrador%203/todo-task/task_schema.js)**: Define el modelo de datos de MongoDB. Cada tarea consta de un identificador numérico (`TaskId`), un nombre (`Name`), y una fecha de finalización (`Deadline`).
4.  **[index.html](file:///d:/DESARROLLO%20DE%20SOFTWARE-PARQUESOFT%20TI/Proyecto%20Integrador%203/todo-task/index.html)**: Contiene toda la lógica visual y el flujo interactivo de usuario. Ofrece un diseño limpio con un degradado de fondo, sombras y efectos responsivos que se adaptan a móviles y pantallas de escritorio.

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para poner en marcha la aplicación en tu entorno local:

### 1. Requisitos Previos
*   Tener instalado [Node.js](https://nodejs.org/) (versión 14 o superior recomendada).
*   Una cuenta y clúster activo en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) o una base de datos MongoDB local.

### 2. Clonación e Instalación
Clona este proyecto en tu máquina local y accede al directorio:

```bash
cd todo-task
npm install
```

### 3. Configuración de Variables de Entorno
Copia la plantilla `.env.dist` y crea tu propio archivo `.env` en la raíz del proyecto:

```bash
cp .env.dist .env
```

Abre el archivo `.env` y define tus credenciales de MongoDB:

```ini
DBMONGO=NombreDeTuBaseDeDatos
DBMONGOPASS=TuContrasenaDeUsuario
DBMONGOSERV=TuDireccionDeClusterMongoDBAtlas (ej. cluster0.kqegse8.mongodb.net)
DBMONGOUSER=TuNombreDeUsuario
```

### 4. Ejecución del Servidor
Arranca la aplicación ejecutando el siguiente comando:

```bash
node server.js
```

El servidor iniciará en el puerto local y mostrará el mensaje en la consola:
```text
Cargando variables de entorno desde archivo
Server is listening at port: 3000
Conexión a la base de datos exitosa
```

Ahora puedes abrir tu navegador favorito e ingresar a: **`http://localhost:3000`**

---

## 🔌 API Endpoints (CRUD)

La aplicación expone las siguientes rutas REST bajo el prefijo `/api` para gestionar las tareas:

| Método | Endpoint | Descripción | Body (JSON) Requerido / Ejemplo |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/create-task` | Registra una nueva tarea en la base de datos. | `{ "TaskId": 1716382020, "Name": "Aprender Node.js", "Deadline": "2026-05-30T00:00:00.000Z" }` |
| **GET** | `/api/all-tasks` | Retorna un listado en formato JSON de todas las tareas guardadas. | *Ninguno* |
| **PUT** | `/api/update-task` | Actualiza la información (`Name` y/`Deadline`) de una tarea existente. | `{ "TaskId": 1716382020, "Name": "Aprender Express", "Deadline": "2026-06-05T00:00:00.000Z" }` |
| **DELETE** | `/api/delete-task` | Elimina permanentemente una tarea por su ID. | `{ "TaskId": 1716382020 }` |

---

## ✨ Funcionalidades y Detalles de la Interfaz

*   **Creación Rápida**: Añade tareas completando el nombre de la actividad y su fecha límite. También puedes presionar la tecla **Enter** en el input de texto para agregarlas de manera ágil.
*   **Gestión Asíncrona**: No hay recarga total de pantalla al agregar o eliminar una tarea. Las llamadas se ejecutan en segundo plano y actualizan el listado inmediatamente.
*   **Estado Vacío Amigable (Empty State)**: Si no existen tareas activas en la base de datos, la interfaz despliega automáticamente un aviso dinámico con un ícono informativo y el mensaje *"No hay tareas. ¡Agrega una nueva!"*.
*   **Diseño Premium**: Paleta de colores vibrante con transiciones suaves, bordes redondeados y una experiencia pulida a nivel visual.
