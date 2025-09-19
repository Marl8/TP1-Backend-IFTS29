const express = require('express');
const router = express.Router();
const { findData } = require('../data/db.js');
const CustomerController = require('../controllers/CustomerController.js')

// Rutas web (vistas Pug)

router.get('/', (req, res) => {
    res.render('index', {title: 'Sabor Urbano'});
});
router.get('/customers', (req, res) => {
    const db = findData();
    res.render('customers', { title: 'Clientes', customers: db.customer, query: req.query });
});
router.get('/customers/add', (req, res) => res.render('addCustomer', {title: 'Agregar Cliente'}));
router.get('/customers/list', CustomerController.listCustomers);
router.get('/customers/update', CustomerController.findCustomerByIdWeb);

router.post('/customers/save', CustomerController.saveCustomerWeb);
router.post('/customers/update/:id', CustomerController.updateCustomerWeb);


module.exports = router;