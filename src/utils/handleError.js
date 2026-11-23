import HttpError from "./HttpError.js";

// Errores esperados (HttpError): se informa el mensaje y el codigo al cliente.
// Errores inesperados: el detalle queda solo en la consola y el cliente recibe un mensaje generico.
export default function handleError(res, error) {
    if (error instanceof HttpError) {
        console.log(`[${error.status}] ${error.message}`)
        return res.status(error.status).json({ status: "error", message: error.message })
    }

    console.error(error)
    return res.status(500).json({ status: "error", message: "Error interno del servidor" })
}
