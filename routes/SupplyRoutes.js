import express from 'express';
const router = express.Router();
import SupplyController from '../controllers/SupplyController.js';


router.post('/saveSupply', SupplyController.saveSupplyAPI);
router.get('/findSupplies', SupplyController.findSuppliesAPI);
router.get('/findSupplyById/:id', SupplyController.findSupplyByIdAPI);
router.put('/updateSupply/:id', SupplyController.updateSupplyAPI);
router.patch('/updateStockSupply/:id', SupplyController.updateStockSupplyAPI);
router.delete('/deleteSupply/:id', SupplyController.deleteSupplyAPI);


export default router;