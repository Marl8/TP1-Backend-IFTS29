import express from "express";
import DeliveryWebController from "../controllers/DeliveryWebController.js";
import { findData } from '../data/db.js';
const router = express.Router();

// Rutas para las vistas del módulo Web
router.get('/', (req, res) => {
    res.render('index', {title: 'Sabor Urbano'});
});
router.get('/delivery', (req, res) => {
    const db = findData();
    res.render('deliveryViews/deliveryMenu', { title: 'Pedidos', deliveries: db.deliveryOrder, query: req.query });
});
router.get("/delivery/add", DeliveryWebController.showAddForm);
router.post("/delivery/add/findCustomer", DeliveryWebController.findCustomerForAdd);
router.get("/delivery/list", DeliveryWebController.listDeliveriesWeb);
router.get("/delivery/delete", DeliveryWebController.showDeliveryToDelete);

router.post("/delivery/save", DeliveryWebController.saveDeliveryWeb);
router.post("/delivery/update/:id", DeliveryWebController.updateDeliveryWeb);
router.delete("/delivery/delete/:id", DeliveryWebController.deleteDeliveryWeb);

export default router;
