import mongoose from "mongoose";

const bookingServiceSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
        required: [true, "El id del servicio es obligatorio"],
        cast: "El id del servicio no es valido"
    },
    quantity: {
        type: Number,
        required: [true, "La cantidad es obligatoria"],
        min: [1, "La cantidad debe ser al menos 1"],
        cast: "La cantidad debe ser un numero"
    }
}, {
    _id: false
})

const bookingSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, "El nombre del cliente es obligatorio"],
        trim: true
    },
    clientEmail: {
        type: String,
        required: [true, "El email del cliente es obligatorio"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "El email no es valido"]
    },
    date: {
        type: Date,
        required: [true, "La fecha es obligatoria"],
        cast: "La fecha no es valida"
    },
    time: {
        type: String,
        required: [true, "La hora es obligatoria"],
        trim: true
    },
    status: {
        type: String,
        default: "available",
        trim: true
    },
    services: {
        type: [bookingServiceSchema],
        validate: {
            validator: (services) => services.length > 0,
            message: "La reserva debe tener al menos un servicio"
        }
    }
}, {
    timestamps: true
})

export const bookingModel = mongoose.model("Bookings", bookingSchema, "bookings")
