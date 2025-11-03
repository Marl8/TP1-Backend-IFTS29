import express from 'express';
import DeliveryOrderController from '../controllers/DeliveryOrderController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
const router = express.Router();


// Crear pedido propio/manual
router.post('/create', verifyToken, DeliveryOrderController.crearPedido);

// Crear pedido externo (Rappi, Uber Eats, PedidosYa)
router.post('/create-external', verifyToken, DeliveryOrderController.crearPedidoExterno);

// Listar pedidos propios/confirmados
router.get('/', verifyToken, DeliveryOrderController.listarPedidos);

// Listar pedidos externos pendientes
router.get('/external-pending', verifyToken, DeliveryOrderController.listarPedidosExternos);

// Confirmar pedido externo
router.patch('/confirm-external/:id', verifyToken, DeliveryOrderController.confirmarPedidoExterno);

// Despachar pedido
router.post('/dispatch/:id', verifyToken, DeliveryOrderController.despacharPedido);

// Filtrar pedidos por plataforma
router.get('/filter', verifyToken, DeliveryOrderController.filtrarPorPlataforma);
router.post('/filter', verifyToken, DeliveryOrderController.filtrarPorPlataforma);

export default router;

