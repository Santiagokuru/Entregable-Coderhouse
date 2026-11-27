import crypto from "crypto";
import fs from "fs/promises";

class ServiceDaos {
    constructor(path) {
        this.path = path;
    }

    async #readServices() {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data)
    }

    async #writeServices(services) {
        await fs.writeFile(this.path, JSON.stringify(services, null, 2))
    }


    async getServices() {
        return await this.#readServices();
    }

    async getServiceById(id) {
        const services = await this.#readServices();
        return services.find(service => (service.id) === (id));
    }

    async createService(name, precio, tiempo, descripcion) {
        const services = await this.#readServices();
        const newService = {
            id: crypto.randomUUID(),
            name,
            precio,
            tiempo,
            descripcion

        }
        services.push(newService);
        await this.#writeServices(services);
        return newService

    }

    async updateService(id, data) {
        const services = await this.#readServices();

        const index = services.findIndex(service => (service.id) === (id))
        if (index === -1) return null
        services[index] = {
            ...services[index],
            ...data,
            id // evita que el body cambie el id
        };
        await this.#writeServices(services);
        return services[index];

    }

    async deleteService(id) {
        const services = await this.#readServices();
        const index = services.findIndex(service => (service.id) === (id));
        if (index === -1) return null;
        const deleteService = services.splice(index, 1)[0]
        await this.#writeServices(services);
        return deleteService
    }
}

export default ServiceDaos

//const obj = new ServiceDaos();

