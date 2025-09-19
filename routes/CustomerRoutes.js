const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController.js');

// Cambió el final de los nombres para distinguirlos de las respuestas de la Web
router.post('/saveCustomer', CustomerController.saveCustomerAPI); 
router.get('/findCustomer/:id', CustomerController.findCustomerByIdAPI);
router.put('/updateCustomer/:id', CustomerController.updateCustomerAPI);
router.delete('/deleteCustomer/:id', CustomerController.deleteCustomerAPI);

module.exports = router;