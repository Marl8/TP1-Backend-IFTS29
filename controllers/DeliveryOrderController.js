const DeliveryOrder = require('../models/DeliveryOrder');
const { findData, writeData } = require('../data/db');

// Crear un nuevo pedido
async function crearPedido(req, res) {
    const { customerId, items, plataforma } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos o items inválidos' });
    }

    // Validar plataforma (opcional), default 'Propia'
    let plataformaPedido = 'Propia';
    if (plataforma) {
        if (typeof plataforma !== 'string') {
            return res.status(400).json({ message: 'Plataforma debe ser un string' });
        }
        plataformaPedido = plataforma;
    }

    const db = findData();
    const menuItems = db.MenuItem;
    const pedidos = db.deliveryOrder;

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

    const nuevoPedido = new DeliveryOrder(Date.now(), customerId, total, 'preparing', plataformaPedido);
    nuevoPedido.setItems(itemsConDatos);

    pedidos.push(nuevoPedido);
    writeData(db);

    res.status(201).json({ message: 'Pedido creado con éxito', pedido: nuevoPedido });
}

// Listar todos los pedidos
async function listarPedidos(req, res) {
    const db = findData();
    res.status(200).json(db.deliveryOrder || []);
}

// Filtrar pedidos por plataforma
async function listarPedidosPorPlataforma(req, res) {
    const { plataforma } = req.query;

    if (!plataforma) {
        return res.status(400).json({ message: 'Es necesario proporcionar una plataforma para filtrar' });
    }

    const db = findData();
    const pedidosFiltrados = db.deliveryOrder.filter(pedido => pedido.plataforma === plataforma);

    res.status(200).json(pedidosFiltrados);
}

//  Listar pedidos externos pendientes
async function listarPedidosExternos(req, res) {
    const db = findData();
    const externos = db.externalOrders || [];

    // Solo mostrar los que están pendientes
    const pendientes = externos.filter(p => p.status === 'pending');
    res.status(200).json(pendientes);
}

// Confirmar pedido externo
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

    // Cambiar estado del pedido externo
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

    writeData(db);

    res.status(200).json({
        message: 'Pedido externo confirmado y en preparación',
        pedido: nuevoPedido
    });
}

// Exportar TODO
module.exports = {
    crearPedido,
    listarPedidos,
    listarPedidosPorPlataforma,
    listarPedidosExternos,
    confirmarPedidoExterno
};

