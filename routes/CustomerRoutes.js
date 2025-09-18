const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController.js');


router.post('/saveCustomer', CustomerController.saveCustomerAPI);
router.get('/findCustomer/:id', CustomerController.findCustomerById);
router.put('/updateCustomer/:id', CustomerController.updateCustomer);
router.delete('/deleteCustomer/:id', CustomerController.deleteCustomer);

module.exports = router;