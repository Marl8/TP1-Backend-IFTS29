const express = require('express');
const router = express.Router();
const DeliveryOrderController = require('../controllers/DeliveryOrderController');

// Crear un nuevo pedido
router.post('/', DeliveryOrderController.crearPedido);

// Listar todos los pedidos
router.get('/', DeliveryOrderController.listarPedidos);

// Filtrar pedidos por plataforma
router.get('/filter', DeliveryOrderController.listarPedidosPorPlataforma);

// Listar pedidos externos pendientes
router.get('/external/pending', DeliveryOrderController.listarPedidosExternos);

// Confirmar pedido externo (pasar a pedidos activos)
//router.post('/external/confirm/:id', DeliveryOrderController.confirmarPedidoExterno);
router.patch('/external/confirm/:id', DeliveryOrderController.confirmarPedidoExterno);

module.exports = router;
