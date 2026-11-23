import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager("./src/data/services.json")

export const getServices = async (req, res) => {
    try {
        const services = await serviceManager.getServices();
        return res.status(200).json({
            status: "success",
            payload: services
        })

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const getServiceById = async (req, res) => {
    try {
        const id = req.params.sid
        const service = await serviceManager.getServiceById(id);
        if (!service) {
            return res.status(404).json({
                status: "error",
                message: "Servicio no encontrado"
            })
        }
        res.status(200).json({
            status: "success",
            payload: service
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const createService = async (req, res) => {
    try {
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

        const newService = await serviceManager.createService(name, precio, tiempo, descripcion)
        res.status(201).json({
            status: "success",
            message: "Servicio creado",
            payload: newService
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const updateService = async (req, res) => {
    try {
        const id = req.params.sid;
        const updatedService = await serviceManager.updateService(id, req.body)

        if (!updatedService) {
            return res.status(404).json({
                status: "error",
                message: "Servicio no encontrado"
            })
        }

        res.status(200).json({
            status: "success",
            payload: updatedService
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const deleteService = async (req, res) => {
    try {
        const id = req.params.sid;
        const deletedService = await serviceManager.deleteService(id);

        if (!deletedService) {
            return res.status(404).json({
                status: "error",
                message: "Servicio no encontrado"
            })
        }
        res.status(200).json({
            status: "success",
            message: "Servicio eliminado correctamente",
            payload: deletedService
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: error.message })
    }
}
