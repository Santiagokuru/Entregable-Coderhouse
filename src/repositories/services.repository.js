import ServiceDaos from "../daos/service.daos.js"

export default class ServiceRepository {
    constructor(){
        this.services = new ServiceDaos
    }
    async getServices(){
        return await this.services.getServices()
    }
    async getServiceById(id){
        return await this.services.getServiceById(id)
    }
    async createService(data){
        return await this.services.createService(data)
    }
    async updateService(id, data){
        return await this.services.updateService(id, data)
    }
    async deleteService(id){
        return await this.services.deleteService(id)
    }
}