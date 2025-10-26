import express from "express";
import DeliveryWebController from "../controllers/DeliveryWebController.js";
const router = express.Router();




router.get("/", DeliveryWebController.showDeliveryMenu); 
router.get("/add", DeliveryWebController.showAddForm);
router.get("/list", DeliveryWebController.listDeliveries);
router.get("/delete", DeliveryWebController.showDeliveryToDelete);
router.get("/update", DeliveryWebController.showDeliveryToEdit); 

router.post("/save", DeliveryWebController.saveDeliveryWeb);
router.post("/add/findCustomer", DeliveryWebController.findCustomerByDni);
router.post("/update/:id", DeliveryWebController.updateDeliveryWeb);

router.delete("/delete/:id", DeliveryWebController.deleteDeliveries);

export default router;