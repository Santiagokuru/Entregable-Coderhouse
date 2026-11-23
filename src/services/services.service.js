import ServiceRepository from "../repositories/services.repository.js";
import HttpError from "../utils/HttpError.js";

export default class ServiceService {
    constructor(services = new ServiceRepository()) {
        this.services = services;
    }

    async getServices() {
        const services = await this.services.getServices()
        if (services.length === 0) {
            throw new HttpError("Servicios no encontrados", 404)
        }
        return services
    }

    async getServiceById(id) {
        const service = await this.services.getServiceById(id)
        if (!service) {
            throw new HttpError("No se encuentra el servicio.", 404)
        }
        return service
    }

    async createService(name, precio, tiempo, descripcion) {
        if (!name || !precio || !tiempo || !descripcion) {
            throw new HttpError("Faltan datos, completar", 400)
        }
        return await this.services.createService(name, precio, tiempo, descripcion)
    }

    async updateService(id, serviceUpdate) {
        if (!id) {
            throw new HttpError("No se encuentra el servicio para actualizar, ingresar id valido", 400)
        }
        const service = await this.services.updateService(id, serviceUpdate)
        if (!service) {
            throw new HttpError("No se encuentra el servicio para actualizar", 404)
        }
        return service
    }

    async deleteService(id) {
        if (!id) {
            throw new HttpError("No se encuentra el servicio para eliminar, ingresar id valido", 400)
        }
        const service = await this.services.deleteService(id)
        if (!service) {
            throw new HttpError("No se encuentra el servicio para eliminar", 404)
        }
        return service
    }

}
