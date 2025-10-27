import express from 'express';
import DeliveryOrderController from '../controllers/DeliveryOrderController.js';
const router = express.Router();


// Crear pedido propio/manual
router.post('/create', DeliveryOrderController.crearPedido);

// Crear pedido externo (Rappi, Uber Eats, PedidosYa)
router.post('/create-external', DeliveryOrderController.crearPedidoExterno);

// Listar pedidos propios/confirmados
router.get('/', DeliveryOrderController.listarPedidos);

// Listar pedidos externos pendientes
router.get('/external-pending', DeliveryOrderController.listarPedidosExternos);

// Confirmar pedido externo
router.patch('/confirm-external/:id', DeliveryOrderController.confirmarPedidoExterno);

// Despachar pedido
router.post('/dispatch/:id', DeliveryOrderController.despacharPedido);

// Filtrar pedidos por plataforma
router.get('/filter', DeliveryOrderController.filtrarPorPlataforma);
router.post('/filter', DeliveryOrderController.filtrarPorPlataforma);

export default router;

