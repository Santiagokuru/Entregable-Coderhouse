import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"],
        cast: "El precio debe ser un numero"
    },
    tiempo: {
        type: Number,
        required: [true, "El tiempo es obligatorio"],
        min: [1, "El tiempo debe ser de al menos 1"],
        cast: "El tiempo debe ser un numero"
    },
    descripcion: {
        type: String,
        required: [true, "La descripcion es obligatoria"],
        trim: true
    },
}, {
    timestamps: true
})

export const serviceModel = mongoose.model("Services", serviceSchema, "services")
