import express from 'express';
const router = express.Router();
import CustomerController from '../controllers/CustomerController.js';

// Cambió el final de los nombres para distinguirlos de las respuestas de la Web
router.post('/saveCustomer', CustomerController.saveCustomerAPI); 
router.get('/findCustomer/getCostumers', CustomerController.listCustomersAPI);
router.get('/findCustomer/:id', CustomerController.findCustomerByIdAPI);
router.put('/updateCustomer/:id', CustomerController.updateCustomerAPI);
router.delete('/deleteCustomer/:id', CustomerController.deleteCustomerAPI);

export default router;