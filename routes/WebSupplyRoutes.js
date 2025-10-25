import express from "express";
import SupplyWebController from "../controllers/SupplyWebController.js";
const router = express.Router();




router.get("/", SupplyWebController.showSupplyMenu); 
router.get("/add", SupplyWebController.showAddSupplyForm);
router.get("/list", SupplyWebController.listSupplysWeb);
router.get("/delete", SupplyWebController.showSupplyToDelete);
/*router.get("/update", DeliveryWebController.showDeliveryToEdit); 

router.post("/save", DeliveryWebController.saveDeliveryWeb);
router.post("/add/findCustomer", DeliveryWebController.findCustomerByDni);
router.post("/update/:id", DeliveryWebController.updateDeliveryWeb);

router.delete("/delete/:id", DeliveryWebController.deleteDeliveryWeb);*/

export default router;