import app from "./app.js"
import config from "./config/config.js";
import { connectDB } from "./config/database.config.js";
const PORT = config.port || 8080

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log("Servidor escuchando en localhost " + PORT)
    })
}

startServer().catch((error) => {
    console.error("Error al inciar  el server")
})

