import HttpError from "./HttpError.js";

// Errores esperados (HttpError): se informa el mensaje y el codigo al cliente.
// Errores inesperados: el detalle queda solo en la consola y el cliente recibe un mensaje generico.
export default function handleError(res, error) {
    if (error instanceof HttpError) {
        console.log(`[${error.status}] ${error.message}`)
        return res.status(error.status).json({ status: "error", message: error.message })
    }

    // Errores de Mongoose por datos invalidos del cliente (campo faltante, tipo o valor incorrecto, id mal formado)
    if (error.name === "ValidationError") {
        // Se devuelven solo los mensajes de cada campo (los definidos en los modelos), sin el prefijo en ingles de Mongoose
        const messages = Object.values(error.errors ?? {}).map((fieldError) => fieldError.message)
        const message = messages.length > 0 ? messages.join(", ") : error.message
        console.log(`[400] ${message}`)
        return res.status(400).json({ status: "error", message })
    }
    if (error.name === "CastError") {
        console.log(`[400] ${error.message}`)
        return res.status(400).json({ status: "error", message: `Valor invalido en el campo "${error.path}"` })
    }

    console.error(error)
    return res.status(500).json({ status: "error", message: "Error interno del servidor" })
}
