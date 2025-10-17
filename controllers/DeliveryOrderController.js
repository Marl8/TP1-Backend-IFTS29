import DeliveryOrder from '../models/DeliveryOrder.js';
import { findData, writeData } from'../data/db.js';

// Plataformas externas válidas
const EXTERNAL_PLATFORMS = ["Rappi", "PedidosYa", "Uber Eats"];

// Crear pedido propio/manual
async function crearPedido(req, res) {
    const { customerId, items } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos o items inválidos' });
    }

    const db = findData();
    const customer = db.customer.find(c => c.id === customerId);
    if (!customer) {
        return res.status(400).json({ message: `Cliente con id ${customerId} no existe` });
    }

    const menuItems = db.MenuItem;
    let total = 0;
    const itemsConDatos = [];

    for (let pedidoItem of items) {
        const menuItem = menuItems.find(mi => mi.id === pedidoItem.id);
        if (!menuItem) {
            return res.status(400).json({ message: `Item con id ${pedidoItem.id} no existe` });
        }
        if (menuItem.stock < pedidoItem.quantity) {
            return res.status(400).json({ message: `Stock insuficiente para ${menuItem.name}` });
        }

        menuItem.stock -= pedidoItem.quantity;
        total += menuItem.price * pedidoItem.quantity;

        itemsConDatos.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: pedidoItem.quantity
        });
    }

    const nuevoPedido = new DeliveryOrder(Date.now(), customerId, total, 'preparing', 'Propia');
    nuevoPedido.setItems(itemsConDatos);

    db.deliveryOrder.push(nuevoPedido);
    writeData(db);

    res.status(201).json({ message: 'Pedido creado con éxito', pedido: nuevoPedido });
}

// Crear pedido externo (plataformas)
async function crearPedidoExterno(req, res) {
    const { customerId, items, plataforma } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0 || !plataforma) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    if (!EXTERNAL_PLATFORMS.includes(plataforma)) {
        return res.status(400).json({ message: `Plataforma inválida. Debe ser: ${EXTERNAL_PLATFORMS.join(", ")}` });
    }

    const db = findData();
    const customer = db.customer.find(c => c.id === customerId);
    if (!customer) {
        return res.status(400).json({ message: `Cliente con id ${customerId} no existe` });
    }

    const menuItems = db.MenuItem;
    let total = 0;
    const itemsConDatos = [];

    for (let pedidoItem of items) {
        const menuItem = menuItems.find(mi => mi.id === pedidoItem.id);
        if (!menuItem) {
            return res.status(400).json({ message: `Item con id ${pedidoItem.id} no existe` });
        }
        if (menuItem.stock < pedidoItem.quantity) {
            return res.status(400).json({ message: `Stock insuficiente para ${menuItem.name}` });
        }

        menuItem.stock -= pedidoItem.quantity;
        total += menuItem.price * pedidoItem.quantity;

        itemsConDatos.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: pedidoItem.quantity
        });
    }

    const nuevoPedido = new DeliveryOrder(Date.now(), customerId, total, 'pending', plataforma);
    nuevoPedido.setItems(itemsConDatos);

    db.externalOrders.push(nuevoPedido);
    writeData(db);

    res.status(201).json({ message: 'Pedido externo creado y pendiente de confirmación', pedido: nuevoPedido });
}

// Listar pedidos propios/confirmados
async function listarPedidos(req, res) {
    const db = findData();
    let pedidos = db.deliveryOrder || [];

    const { plataforma } = req.query;
    if (plataforma) {
        pedidos = pedidos.filter(p => p.plataforma && p.plataforma.toLowerCase() === plataforma.toLowerCase());
    }

    res.status(200).json(pedidos);
}

// Listar pedidos externos pending
async function listarPedidosExternos(req, res) {
    const db = findData();
    const pendientes = (db.externalOrders || []).filter(p => p.status === 'pending');
    res.status(200).json(pendientes);
}

// Confirmar pedido externo (mover a deliveryOrder)
async function confirmarPedidoExterno(req, res) {
    const { id } = req.params;
    const db = findData();

    const pedidoExterno = db.externalOrders.find(p => p.id.toString() === id.toString());
    if (!pedidoExterno) {
        return res.status(404).json({ message: 'Pedido externo no encontrado' });
    }

    if (pedidoExterno.status !== 'pending') {
        return res.status(400).json({ message: 'Pedido ya confirmado o procesado' });
    }

    pedidoExterno.status = 'preparing';
    const nuevoPedido = new DeliveryOrder(
        pedidoExterno.id,
        pedidoExterno.customerId,
        pedidoExterno.total,
        'preparing',
        pedidoExterno.plataforma
    );
    nuevoPedido.setItems(pedidoExterno.items);

    db.deliveryOrder.push(nuevoPedido);
    db.externalOrders = db.externalOrders.filter(p => p.id.toString() !== id.toString());
    writeData(db);

    res.status(200).json({
        message: 'Pedido externo confirmado y en preparación',
        pedido: nuevoPedido
    });
}

// Marcar pedido como despachado
async function despacharPedido(req, res) {
    const { id } = req.params;
    const db = findData();
    const pedido = db.deliveryOrder.find(p => p.id.toString() === id.toString());

    if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    pedido.status = 'dispatched';
    writeData(db);

    res.status(200).json({ message: 'Pedido despachado', pedido });
}

/**
 * Filtrar pedidos por plataforma
 * Incluye:
 *  - pedidos confirmados (deliveryOrder)
 *  - pedidos externos pending (externalOrders) si la plataforma es externa
 */
async function filtrarPorPlataforma(req, res) {
    const { plataforma } = req.query || req.body; // soporta GET query o POST body

    if (!plataforma) {
        return res.status(400).json({ message: "Debe indicar la plataforma" });
    }

    const db = findData();

    // Filtrar pedidos confirmados
    let pedidos = (db.deliveryOrder || []).filter(p => 
        p.plataforma && p.plataforma.toLowerCase() === plataforma.toLowerCase()
    );

    // Si es plataforma externa, agregar los pending de externalOrders
    if (EXTERNAL_PLATFORMS.includes(plataforma)) {
        const externosPendientes = (db.externalOrders || []).filter(p =>
            p.plataforma.toLowerCase() === plataforma.toLowerCase() &&
            p.status.toLowerCase() === "pending"
        );
        pedidos = pedidos.concat(externosPendientes);
    }

    res.status(200).json(pedidos);
}

const DeliveryOrderController = {
    crearPedido,
    crearPedidoExterno,
    listarPedidos,
    listarPedidosExternos,
    confirmarPedidoExterno,
    despacharPedido,
    filtrarPorPlataforma
};

export default DeliveryOrderController;


