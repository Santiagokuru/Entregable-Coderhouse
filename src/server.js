import express from "express";
import config from "./config/config.js";
import ServiceManager from "./managers/ServiceManager.js";
import BookingManager from "./managers/BookingManager.js";
import { routingDetector } from "./middlewares/routingDetector.js";

const app = express()
const PORT = config.port || 8080

const serviceManager = new ServiceManager("./src/data/services.json")
const bookingManager =new BookingManager("./src/data/booking.json")

app.use(express.json());

// ENDPOINTS PARA LOS SERVICIOS

app.get("/api/services",routingDetector, async (req, res) => {
   try{
     const services = await serviceManager.getServices()
    res.status(200).json({
        status: "success",
        payload: services
    })
}catch(error){
    console.log(error)
    res.status(500).json({ status: "error", message: error.message })
}
})

app.get("/api/services/:sid",routingDetector, async (req, res) => {
    try{
    const id = req.params.sid
    const service = await serviceManager.getServiceById(id);
    if (!service) {
        return res.status(404).json({
            status: "error",
            message: "Servicio no encontrado"
        })
    }
    res.status(200).json({
        status: "success",
        payload: service
    })
}catch(error){
    console.log(error)
    res.status(500).json({ status: "error", message: error.message })
}
})

app.post("/api/services",routingDetector, async (req, res) => {
    try{
        const {
            name,
            precio,
            tiempo,
            descripcion
        } = req.body
        
        if (!name || !precio || !tiempo) {
            return res.status(400).json({
                status: "error",
                message: "Faltan campos obligatorios"
            })
        }
        
        const newService = await serviceManager.createService(name, precio, tiempo, descripcion)
        res.status(201).json({
            status: "success",
            message: "Servicio creado",
            payload: newService
        })
    }catch(error){
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})

app.put("/api/services/:sid", routingDetector, async (req, res) => {
    try{
    const id = req.params.sid;
    const updatedService = await serviceManager.updateService(id, req.body)

    if (!updatedService) {
        return res.status(404).json({
            status: "error",
            message: "Servicio no encontrado"
        })
    }

    res.status(200).json({
        status: "success",
        payload: updatedService
    })
    }catch(error){
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})

app.delete("/api/services/:sid", routingDetector, async (req, res) => {
    try{
    const id = req.params.sid;
    const deletedService = await serviceManager.deleteService(id);

    if (!deletedService) {
        return res.status(404).json({
            status: "error",
            message: "Servicio no encontrado"
        })
    }
    res.status(200).json({
        status: "success",
        message: "Servicio eliminado correctamente",
        payload: deletedService
    })
    }catch(error){
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})


// ENDPOINTS PARA LAS RESERVAS

app.get("/api/bookings",routingDetector, async (req, res) => {
   try{
     const bookings = await bookingManager.getBookings()
    res.status(200).json({
        status: "success",
        payload: bookings
    })
}catch(error){
    console.log(error)
    res.status(500).json({ status: "error", message: error.message })
}
})

app.get("/api/bookings/:bid",routingDetector, async (req, res) => {
    try{
    const id = req.params.bid
    const booking = await bookingManager.getBookingById(id);
    if (!booking) {
        return res.status(404).json({
            status: "error",
            message: "Reserva no encontrada"
        })
    }
    res.status(200).json({
        status: "success",
        payload: booking
    })
}catch(error){
    console.log(error)
    res.status(500).json({ status: "error", message: error.message })
}
})

app.post("/api/bookings",routingDetector, async (req, res) => {
    try{
        const {
            clientName,
            clientEmail,
            date,
            time,
            status = "available",
            services
        } = req.body

        if (!clientName || !clientEmail || !date || !time || !Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Faltan campos obligatorios"
            })
        }

        const newBooking = await bookingManager.createBooking(clientName, clientEmail, date, time, status, services)
        res.status(201).json({
            status: "success",
            message: "Reserva creada",
            payload: newBooking
        })
    }catch(error){
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})

app.put("/api/bookings/:bid", routingDetector, async (req, res) => {
    try{
    const id = req.params.bid;
    const updatedBooking = await bookingManager.updateBooking(id, req.body)

    if (!updatedBooking) {
        return res.status(404).json({
            status: "error",
            message: "Reserva no encontrada"
        })
    }

    res.status(200).json({
        status: "success",
        payload: updatedBooking
    })
    }catch(error){
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})

app.delete("/api/bookings/:bid", routingDetector, async (req, res) => {
    try{
    const id = req.params.bid;
    const deletedBooking = await bookingManager.deleteBooking(id);

    if (!deletedBooking) {
        return res.status(404).json({
            status: "error",
            message: "Reserva no encontrada"
        })
    }
    res.status(200).json({
        status: "success",
        message: "Reserva eliminada correctamente",
        payload: deletedBooking
    })
    }catch(error){
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
})

app.listen(PORT, () => {
    console.log("Servidor escuchando en localhost " + PORT)
})
