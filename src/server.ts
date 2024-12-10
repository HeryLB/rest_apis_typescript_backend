import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate();
        await db.sync();
        console.log(colors.blue("Conexión exitosa a la BD"));
    } catch (error: any) {
        console.error(colors.red.bold(`Error al conectar a la BD: ${error.message}`));
        process.exit(1); // Salir del proceso si no se puede conectar a la BD
    }
}
connectDB();

// Verificar variables de entorno
if (!process.env.FRONTEND_URL) {
    console.error(colors.red("La variable FRONTEND_URL no está definida"));
    process.exit(1);
}

// Instancia de express
const server = express();

// Configuración de CORS
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            console.warn(colors.yellow(`Bloqueo de CORS para el origen: ${origin}`));
            callback(new Error("Error de CORS"));
        }
    },
};
server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

// Logger HTTP
server.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Endpoint para la raíz
server.get("/", (req, res) => {
    res.status(200).json({ message: "Servidor funcionando correctamente." });
});

// Rutas principales
server.use("/api/products", router);

// Documentación con Swagger
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Manejo de errores para rutas no definidas
server.use((req, res) => {
    res.status(404).json({ error: "Recurso no encontrado." });
});

// Manejo global de errores
server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(colors.red.bold(`Error: ${err.message}`));
    res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

export default server;
