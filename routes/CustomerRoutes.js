import express from 'express';
const router = express.Router();
import CustomerAPIController from '../controllers/CustomerAPIController.js';

router.post('/saveCustomer', CustomerAPIController.saveCustomerAPI); 
router.get('/findCustomer/getCostumers', CustomerAPIController.listCustomersAPI);
router.get('/findCustomer/:id', CustomerAPIController.findCustomerByIdAPI);
router.get('/findCustomer', CustomerAPIController.findCustomerByDniAPI);
router.put('/updateCustomer/:id', CustomerAPIController.updateCustomerAPI);
router.delete('/deleteCustomer/:id', CustomerAPIController.deleteCustomerAPI);

export default router;