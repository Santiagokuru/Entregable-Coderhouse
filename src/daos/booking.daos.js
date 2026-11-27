import { bookingModel } from "./models/booking.model.js";

class BookingDaos {
    async getBookings() {
        return await bookingModel.find();
    }

    async getBookingById(id) {
        return await bookingModel.findById(id);
    }

    async createBooking(data) {
        return await bookingModel.create(data);
    }

    async updateBooking(id, data) {
        const changes = { ...data }
        delete changes._id // evita que el body cambie el id
        delete changes.id

        return await bookingModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true
        })
    }

    async deleteBooking(id) {
        return await bookingModel.findByIdAndDelete(id);
    }
}

export default BookingDaos
