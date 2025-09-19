const express = require('express');
const router = express.Router();
const { findData } = require('../data/db.js');
const CustomerController = require('../controllers/CustomerController.js')


router.get('/', (req, res) => {
    res.render('index', {title: 'Sabor Urbano'});
});
router.get('/customers', (req, res) => {
    const db = findData();
    res.render('customers', { title: 'Clientes', customers: db.customer, query: req.query });
});
router.get('/customers/add', (req, res) => res.render('addCustomer', {title: 'Agregar Cliente'}));
router.get('/customers/list', CustomerController.listCustomers);
router.get('/customers/update', CustomerController.showCustomerToEdit);
router.get('/customers/delete', CustomerController.showCustomerToDelete);

router.post('/customers/save', CustomerController.saveCustomerWeb);
router.post('/customers/update/:id', CustomerController.updateCustomerWeb);

router.delete('/customers/delete/:id', CustomerController.deleteCustomerWeb);


module.exports = router;