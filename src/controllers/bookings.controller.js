import BookingService from "../services/bookings.service.js";
import handleError from "../utils/handleError.js";

const bookingService = new BookingService()

export const getBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getBookings()
        res.status(200).json({
            status: "success",
            payload: bookings
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const getBookingById = async (req, res) => {
    try {
        const id = req.params.bid
        const booking = await bookingService.getBookingById(id)
        res.status(200).json({
            status: "success",
            payload: booking
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingService.createBooking(req.body ?? {})
        res.status(201).json({
            status: "success",
            message: "Reserva creada",
            payload: newBooking
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const updateBooking = async (req, res) => {
    try {
        const id = req.params.bid
        const updatedBooking = await bookingService.updateBooking(id, req.body)
        res.status(200).json({
            status: "success",
            payload: updatedBooking
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const deleteBooking = async (req, res) => {
    try {
        const id = req.params.bid
        const deletedBooking = await bookingService.deleteBooking(id)
        res.status(200).json({
            status: "success",
            message: "Reserva eliminada correctamente",
            payload: deletedBooking
        })
    } catch (error) {
        handleError(res, error)
    }
}
