import BookingRepository from "../repositories/bookings.repository.js";
import ServiceRepository from "../repositories/services.repository.js";
import HttpError from "../utils/HttpError.js";

export default class BookingService {
    constructor(bookings = new BookingRepository(), services = new ServiceRepository()) {
        this.bookings = bookings;
        this.services = services;
    }

    // Verifica que cada servicio de la reserva tenga un id valido y exista en la coleccion de servicios
    async #validateServices(bookingServices) {
        const ids = bookingServices.map((item) => item?.service)
        if (ids.some((id) => !id)) {
            throw new HttpError("Cada servicio de la reserva debe indicar su id", 400)
        }

        const uniqueIds = [...new Set(ids.map(String))]
        await Promise.all(uniqueIds.map(async (id) => {
            let service
            try {
                service = await this.services.getServiceById(id)
            } catch (error) {
                if (error.name === "CastError") {
                    throw new HttpError(`El id de servicio "${id}" no es valido`, 400)
                }
                throw error
            }
            if (!service) {
                throw new HttpError(`El servicio "${id}" no existe`, 400)
            }
        }))
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

    async createBooking(data) {
        if (!data.clientName || !data.clientEmail || !data.date || !data.time
            || !Array.isArray(data.services) || data.services.length === 0) {
            throw new HttpError("Faltan campos obligatorios", 400)
        }
        await this.#validateServices(data.services)
        return await this.bookings.createBooking(data)
    }

    async updateBooking(id, bookingUpdate) {
        if (!id) {
            throw new HttpError("No se encuentra la reserva para actualizar, ingresar id valido", 400)
        }
        if (bookingUpdate?.services !== undefined) {
            if (!Array.isArray(bookingUpdate.services) || bookingUpdate.services.length === 0) {
                throw new HttpError("La reserva debe tener al menos un servicio", 400)
            }
            await this.#validateServices(bookingUpdate.services)
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
