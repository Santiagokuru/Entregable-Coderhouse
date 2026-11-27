import BookingDaos from "../daos/booking.daos.js";

export default class BookingRepository {
    constructor() {
        this.bookings = new BookingDaos
    }

    async getBookings() {
        return await this.bookings.getBookings()
    }
    async getBookingById(id) {
        return await this.bookings.getBookingById(id)
    }
    async createBooking(data) {
        return await this.bookings.createBooking(data)
    }
    async updateBooking(id, data) {
        return await this.bookings.updateBooking(id, data)
    }
    async deleteBooking(id) {
        return await this.bookings.deleteBooking(id)
    }
}
