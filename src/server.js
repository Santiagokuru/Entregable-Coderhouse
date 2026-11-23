import app from "./app.js"
import config from "./config/config.js";


const PORT = config.port || 8080

app.listen(PORT, () => {
    console.log("Servidor escuchando en localhost " + PORT)
})
