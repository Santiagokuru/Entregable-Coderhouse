import { Router } from "express";
import { routingDetector } from "../middlewares/routingDetector.js";
import { getBookings, getBookingById, createBooking, updateBooking, deleteBooking } from "../controllers/booking.controller.js";

const router = Router();

// ENDPOINTS PARA LAS RESERVAS

router.get("/", routingDetector, getBookings)

router.get("/:bid", routingDetector, getBookingById)

router.post("/", routingDetector, createBooking)

router.put("/:bid", routingDetector, updateBooking)

router.delete("/:bid", routingDetector, deleteBooking)

export default router;
