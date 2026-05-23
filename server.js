const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// 1. Cargar variables de entorno al inicio
if (!process.env.ON_RENDER) {
    console.log("Cargando variables de entorno desde archivo");
    const env = require('node-env-file');
    env(path.join(__dirname, '.env'));
}

// 2. Conectar a la base de datos
const connectDB = require('./src/config/db');
connectDB();

const api = require('./src/routes/api');
const port = process.env.PORT || 3000;
const app = express();

// 3. Middlewares
app.use(bodyParser.json());

// 4. Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// 5. Enrutador de la API
app.use('/api', api);

// 6. Arrancar servidor
app.listen(port, function () {
    console.log("Server is listening at port: " + port);
});
