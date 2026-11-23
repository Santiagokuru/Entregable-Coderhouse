import ServiceDaos from "../daos/service.daos.js"

export default class ServiceRepository {
    constructor(services = new ServiceDaos("./src/data/services.json")){
        this.services = services
    }
    async getServices(){
        return await this.services.getServices()
    }
    async getServiceById(id){
        return await this.services.getServiceById(id)
    }
    async createService(name, precio, tiempo, descripcion){
        return await this.services.createService(name, precio, tiempo, descripcion)
    }
    async updateService(id, data){
        return await this.services.updateService(id, data)
    }
    async deleteService(id){
        return await this.services.deleteService(id)
    }
}