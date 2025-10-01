import express from 'express';
const router = express.Router();
const DeliveryOrderController = require('../controllers/DeliveryOrderController');

// PEDIDOS PROPIOS/MANUALES
router.post('/create', DeliveryOrderController.crearPedido);

// PEDIDOS EXTERNOS (Rappi, Uber Eats, PedidosYa)
router.post('/create-external', DeliveryOrderController.crearPedidoExterno);

// LISTAR PEDIDOS CONFIRMADOS / PROPIOS
router.get('/', DeliveryOrderController.listarPedidos);

// LISTAR PEDIDOS EXTERNOS PENDING
router.get('/external-pending', DeliveryOrderController.listarPedidosExternos);

// CONFIRMAR PEDIDO EXTERNO Y PASAR A PREPARING
router.patch('/confirm-external/:id', DeliveryOrderController.confirmarPedidoExterno);

// DESPACHAR PEDIDO (CAMBIAR ESTADO A "dispatched")
router.post('/dispatch/:id', DeliveryOrderController.despacharPedido);
// GET con query param
router.get('/filter', DeliveryOrderController.filtrarPorPlataforma);

// POST con body
router.post('/filter', DeliveryOrderController.filtrarPorPlataforma);

module.exports = router;

