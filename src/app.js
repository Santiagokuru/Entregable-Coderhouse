import express from "express";
import bookingRouter from "./routes/bookings.router.js"
import serviceRouter from "./routes/services.router.js"

const app = express()

app.use(express.json());

app.use("/api/services", serviceRouter)
app.use("/api/bookings", bookingRouter)

export default app