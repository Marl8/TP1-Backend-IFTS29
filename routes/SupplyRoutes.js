import express from 'express';
const router = express.Router();
import SupplyAPIController from '../controllers/SupplyAPIController.js';


router.post('/saveSupply', SupplyAPIController.saveSupplyAPI);
router.get('/findSupplies', SupplyAPIController.findSuppliesAPI);
router.get('/findSupplyById/:id', SupplyAPIController.findSupplyByIdAPI);
router.put('/updateSupply/:id', SupplyAPIController.updateSupplyAPI);
router.patch('/updateStockSupply/:id', SupplyAPIController.updateStockSupplyAPI);
router.delete('/deleteSupply/:id', SupplyAPIController.deleteSupplyAPI);


export default router;