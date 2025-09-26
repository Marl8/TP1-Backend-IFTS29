import express from 'express';
const router = express.Router();
import SupplyController from '../controllers/SupplyController.js';


router.post('/saveSupply', SupplyController.saveSupply);
router.get('/findSupplies', SupplyController.findSupplies);
router.get('/findSupplyById/:id', SupplyController.findSupplyById);
router.put('/updateSupply/:id', SupplyController.updateSupply);
router.patch('/updateStockSupply/:id', SupplyController.updateStockSupply);
router.delete('/deleteSupply/:id', SupplyController.deleteSupply);


export default router;