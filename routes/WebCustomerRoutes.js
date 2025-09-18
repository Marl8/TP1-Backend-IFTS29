const express = require('express');
const router = express.Router();

// Rutas web (vistas Pug)

router.get('/', (req, res) => {
    res.render('index', {title: 'Sabor Urbano'});
});
router.get('/customers', (req, res) => res.render('customers', {title: 'Clientes CRUD'}))
router.get('/customers/add', (req, res) => res.render('addCustomer', {title: 'Agregar Cliente'}));

module.exports = router;