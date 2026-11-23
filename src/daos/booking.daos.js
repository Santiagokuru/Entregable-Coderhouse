import crypto from "crypto";
import fs from "fs/promises";

class BookingDaos {
    constructor(path) {
        this.path = path;
    }

    async #readBookings() {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data)
    }

    async #writeBookings(bookings) {
        await fs.writeFile(this.path, JSON.stringify(bookings, null, 2))
    }


    async getBookings() {
        return await this.#readBookings();
    }

    async getBookingById(id) {
        const bookings = await this.#readBookings();
        return bookings.find(booking => booking.id === id);
    }

    async createBooking(clientName, clientEmail, date, time, status, services) {
        const bookings = await this.#readBookings();
        const newBooking = {
            id: crypto.randomUUID(),
            clientName,
            clientEmail,
            date,
            time,
            status,
            services
        }
        bookings.push(newBooking);
        await this.#writeBookings(bookings);
        return newBooking
    }

    async updateBooking(id, data) {
        const bookings = await this.#readBookings();

        const index = bookings.findIndex(booking => booking.id === id)
        if (index === -1) return null
        bookings[index] = {
            ...bookings[index],
            ...data,
            id // evita que el body cambie el id
        };
        await this.#writeBookings(bookings);
        return bookings[index];
    }

    async deleteBooking(id) {
        const bookings = await this.#readBookings();
        const index = bookings.findIndex(booking => booking.id === id);
        if (index === -1) return null;
        const deletedBooking = bookings.splice(index, 1)[0]
        await this.#writeBookings(bookings);
        return deletedBooking
    }
}

export default BookingDaos
