const express = require('express');
const router = express.Router();
const DeliveryOrderController = require('../controllers/DeliveryOrderController');

router.post('/', DeliveryOrderController.crearPedido);
router.get('/', DeliveryOrderController.listarPedidos);


module.exports = router;
