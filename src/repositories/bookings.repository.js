import BookingDaos from "../daos/booking.daos.js";

export default class BookingRepository {
    constructor(bookings = new BookingDaos("./src/data/booking.json")) {
        this.bookings = bookings
    }

    async getBookings() {
        return await this.bookings.getBookings()
    }
    async getBookingById(id) {
        return await this.bookings.getBookingById(id)
    }
    async createBooking(clientName, clientEmail, date, time, status, services) {
        return await this.bookings.createBooking(clientName, clientEmail, date, time, status, services)
    }
    async updateBooking(id, data) {
        return await this.bookings.updateBooking(id, data)
    }
    async deleteBooking(id) {
        return await this.bookings.deleteBooking(id)
    }
}
