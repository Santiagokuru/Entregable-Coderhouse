import BookingRepository from "../repositories/bookings.repository.js";
import HttpError from "../utils/HttpError.js";

export default class BookingService {
    constructor(bookings = new BookingRepository()) {
        this.bookings = bookings;
    }

    async getBookings() {
        const bookings = await this.bookings.getBookings()
        if (bookings.length === 0) {
            throw new HttpError("Reservas no encontradas", 404)
        }
        return bookings
    }

    async getBookingById(id) {
        const booking = await this.bookings.getBookingById(id)
        if (!booking) {
            throw new HttpError("Reserva no encontrada", 404)
        }
        return booking
    }

    async createBooking(clientName, clientEmail, date, time, status, services) {
        if (!clientName || !clientEmail || !date || !time || !Array.isArray(services) || services.length === 0) {
            throw new HttpError("Faltan campos obligatorios", 400)
        }
        return await this.bookings.createBooking(clientName, clientEmail, date, time, status, services)
    }

    async updateBooking(id, bookingUpdate) {
        if (!id) {
            throw new HttpError("No se encuentra la reserva para actualizar, ingresar id valido", 400)
        }
        const booking = await this.bookings.updateBooking(id, bookingUpdate)
        if (!booking) {
            throw new HttpError("Reserva no encontrada", 404)
        }
        return booking
    }

    async deleteBooking(id) {
        if (!id) {
            throw new HttpError("No se encuentra la reserva para eliminar, ingresar id valido", 400)
        }
        const booking = await this.bookings.deleteBooking(id)
        if (!booking) {
            throw new HttpError("Reserva no encontrada", 404)
        }
        return booking
    }

}
