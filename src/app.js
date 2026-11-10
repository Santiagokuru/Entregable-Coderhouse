import 'dotenv/config';
import express from 'express';

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json());

const services = [
    {
        id: 1,
        name: "Extraccion de diente",
        precio: 4000,
        tiempo: 5000,
        descripcion: "extraccion simple de muelas de juicio"
    },
    {
        id: 2,
        name: "Consulta detal",
        precio: 3000,
        tiempo: 3000,
        descripcion: "Consulta con un profesional odontologio"
    },
    {
        id: 3,
        name: "Arreglo dental",
        precio: 1500,
        tiempo: 3000,
        descripcion: "Arreglo de una carie"
    },
]

// ENDOPONIT PARA LOS SERIVICIOS

app.get("/api/services", (req, res) => {
    if (!services) {
        return res.status(404).json({
            status: "error",
            payload: "No existen servicios"
        })
    }
    res.status(200).json({
        status: "success",
        payload: services
    })
})

app.get("/api/services/:sid", (req, res) => {
    const id = Number(req.params.sid)
    const service = services.find(
        service => service.id === id
    )
    if (!service) {
        return res.status(404).json({
            status: "error",
            payload: "Servicio no encontrado"
        })
    }
    res.status(200).json({
        status: "success",
        payload: service
    })
})

app.post("/api/services", (req, res) => {
    const {
        name,
        precio,
        tiempo,
        descripcion
    } = req.body
    if (!name || !precio || !tiempo) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios"
        })
    }
    const newSerivce = {
        id: crypto.randomUUID(),
        name,
        precio,
        tiempo,
        descripcion
    }
    services.push(newSerivce)
    res.status(201).json({
        status: "success",
        message: "Servicion creado",
        payload: newSerivce
    })
})

app.put("/api/services/:sid", (req, res) => {
    const id = Number(req.params.sid);

    const serviceIndex = services.findIndex(
        service => service.id === id
    )
    if (serviceIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "servicio no encontrado"
        })
    }
    const {
        name,
        precio,
        tiempo,
        descripcion
    } = req.body

    services[serviceIndex] = {
        id,
        name,
        precio,
        tiempo,
        descripcion
    }

    res.status(200).json({
        status: "success",
        payload: services[serviceIndex]
    })
})

app.delete("/api/services/:sid", (req, res) => {
    const id = Number(req.params.sid)
    const serviceIndex = services.findIndex(
        service => service.id === id
    )
    if (serviceIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "servicio no encontrado"
        })
    }
    const deleteService = services.splice(serviceIndex, 1)
    res.status(200).json({
        status: "success",
        message: "Servicio elimnado correctamente",
        payload: deleteService[0]
    })

})



app.listen(PORT, () => {
    console.log("Servidosr escuahando en localhost " + PORT)
})