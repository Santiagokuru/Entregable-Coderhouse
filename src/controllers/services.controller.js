import ServiceService from "../services/services.service.js";
import handleError from "../utils/handleError.js";

const serviceService = new ServiceService()

export const getServices = async (req, res) => {
    try {
        const services = await serviceService.getServices();
        return res.status(200).json({
            status: "success",
            payload: services
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const getServiceById = async (req, res) => {
    try {
        const id = req.params.sid
        const service = await serviceService.getServiceById(id);

        res.status(200).json({
            status: "success",
            payload: service
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const createService = async (req, res) => {
    try {
        const newService = await serviceService.createService(req.body ?? {})
        res.status(201).json({
            status: "success",
            message: "Servicio creado",
            payload: newService
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const updateService = async (req, res) => {
    try {
        const id = req.params.sid;
        const updatedService = await serviceService.updateService(id, req.body)
        res.status(200).json({
            status: "success",
            payload: updatedService
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const deleteService = async (req, res) => {
    try {
        const id = req.params.sid;
        const deletedService = await serviceService.deleteService(id);
        res.status(200).json({
            status: "success",
            message: "Servicio eliminado correctamente",
            payload: deletedService
        })
    } catch (error) {
        handleError(res, error)
    }
}
