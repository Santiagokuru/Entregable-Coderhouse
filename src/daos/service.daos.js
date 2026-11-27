import { serviceModel } from "./models/service.models.js";

class ServiceDaos {
    async getServices() {
        return await serviceModel.find();
    }

    async getServiceById(id) {
        return await serviceModel.findById(id);
    }

    async createService(data) {
        return await serviceModel.create(data);
    }

    async updateService(id, data) {
        const changes = { ...data }
        delete changes._id // evita que el body cambie el id
        delete changes.id

        return await serviceModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true
        })
    }

    async deleteService(id) {
        return await serviceModel.findByIdAndDelete(id);
    }
}

export default ServiceDaos

//const obj = new ServiceDaos();

