import BookingManager from "../managers/BookingManager.js";

const bookingManager = new BookingManager("./src/data/booking.json")

export const getBookings = async (req, res) => {
    try {
        const bookings = await bookingManager.getBookings()
        res.status(200).json({
            status: "success",
            payload: bookings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const getBookingById = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const createBooking = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const updateBooking = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const deleteBooking = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}
