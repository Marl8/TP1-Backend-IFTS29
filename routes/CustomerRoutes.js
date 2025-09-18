const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController.js');

//Creamos una expresión regular para que el path variable que solo acepte números enteros

router.post('/saveCustomer', CustomerController.saveCustomerAPI);
router.get('/findCustomer/:id', CustomerController.findCustomerById);
router.put('/updateCustomer/:id', CustomerController.updateCustomer);
router.delete('/deleteCustomer/:id', CustomerController.deleteCustomer);

module.exports = router;