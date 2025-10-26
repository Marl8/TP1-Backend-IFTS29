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




/*import express from 'express';
const router = express.Router();
import DeliveryOrderController from '../controllers/DeliveryOrderController.js';

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

export default router;*/

