import{Router} from "express";
import { routingDetector } from "../middlewares/routingDetector.js";
import { getServices, getServiceById, createService, updateService, deleteService } from "../controllers/services.controller.js";

const router = Router();

// ENDPOINTS PARA LOS SERVICIOS

router.get("/", routingDetector, getServices)

router.get("/:sid", routingDetector, getServiceById)

router.post("/", routingDetector, createService)

router.put("/:sid", routingDetector, updateService)

router.delete("/:sid", routingDetector, deleteService)

export default router;
