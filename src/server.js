import express from "express";
import config from "./config/config.js";
import ServiceManager from "./managers/ServiceManager.js";
import BookingManager from "./managers/BookingManager.js";
import bookingRouter from "./routes/bookings.routers.js"
import serviceRouter from "./routes/services.router.js"

const app = express()
const PORT = config.port || 8080

const serviceManager = new ServiceManager("./src/data/services.json")
const bookingManager =new BookingManager("./src/data/booking.json")

app.use(express.json());

app.use("/api/services", serviceRouter)
app.use("/api/bookings", bookingRouter)


app.listen(PORT, () => {
    console.log("Servidor escuchando en localhost " + PORT)
})
