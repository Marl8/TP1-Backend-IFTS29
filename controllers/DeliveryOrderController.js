const DeliveryOrder = require('../models/DeliveryOrder');
const { findData, writeData } = require('../data/db');

async function crearPedido(req, res) {
    const { customerId, items } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos o items inválidos' });
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

    const nuevoPedido = new DeliveryOrder(Date.now(), customerId, total);
    nuevoPedido.setItems(itemsConDatos);

    pedidos.push(nuevoPedido);
    writeData(db);

    res.status(201).json({ message: 'Pedido creado con éxito', pedido: nuevoPedido });
}

async function listarPedidos(req, res) {
    const db = findData();
    res.status(200).json(db.deliveryOrder || []);
}

module.exports = {
    crearPedido,
    listarPedidos
};

