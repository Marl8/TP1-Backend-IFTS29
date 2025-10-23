import DeliveryOrder from "../models/DeliveryOrder.js";
import { findData, writeData } from "../data/db.js";

const EXTERNAL_PLATFORMS = ["Rappi", "PedidosYa", "Uber Eats"];

const DeliveryService = {
  crearPedido(customerId, items, estado, total, repartidor, estEntrega, plataforma) {
    const db = findData();

    if (!customerId || !Array.isArray(items) || items.length === 0 || !estado || !plataforma) {
      throw new Error("Datos incompletos. Se requieren: Cliente, Ítems, Estado y Plataforma.");
    }

    const menuItems = db.MenuItem;
    let calculatedTotal = 0;
    const itemsConDatos = [];

    for (let pedidoItem of items) {
      const itemIDFromForm = String(pedidoItem.id); 
      const menuItem = menuItems.find(mi => String(mi.id) === itemIDFromForm);
        
      if (!menuItem) {
        throw new Error(`Item con id ${pedidoItem.id} no existe`);
      }
      if (menuItem.stock < pedidoItem.quantity) {
        throw new Error(`Stock insuficiente para ${menuItem.name}`);
      }

      menuItem.stock -= pedidoItem.quantity;
      calculatedTotal += menuItem.price * pedidoItem.quantity;

      itemsConDatos.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: pedidoItem.quantity
      });
    }

    const finalTotal = total ? parseFloat(total) : calculatedTotal; 

    const nuevoPedido = new DeliveryOrder({ 
        id: Date.now(), 
        customerId: customerId,
        total: finalTotal,
        status: estado, 
        plataforma: plataforma,
        items: itemsConDatos,
        assignedRiderId: repartidor || null,
        estimatedDelivery: estEntrega || null
    });

    db.deliveryOrder.push(nuevoPedido);
    writeData(db);

    return nuevoPedido;
  },

  crearPedidoExterno(customerId, items, plataforma) {
    const db = findData();

    if (!customerId || !Array.isArray(items) || items.length === 0 || !plataforma) {
      throw new Error("Datos incompletos");
    }

    if (!EXTERNAL_PLATFORMS.includes(plataforma)) {
      throw new Error(`Plataforma inválida. Debe ser: ${EXTERNAL_PLATFORMS.join(", ")}`);
    }

    const customer = db.customer.find(c => c.id === customerId || c._id === customerId);
    
    if (!customer) {
      throw new Error(`Cliente con id ${customerId} no existe`);
    }
    
    const menuItems = db.MenuItem;
    let total = 0;
    const itemsConDatos = [];

    for (let pedidoItem of items) {
      const itemIDFromForm = String(pedidoItem.id); 
      const menuItem = menuItems.find(mi => String(mi.id) === itemIDFromForm);
        
      if (!menuItem) {
        throw new Error(`Item con id ${pedidoItem.id} no existe`);
      }
      if (menuItem.stock < pedidoItem.quantity) {
        throw new Error(`Stock insuficiente para ${menuItem.name}`);
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

    const nuevoPedido = new DeliveryOrder({
        id: Date.now(), 
        customerId: customerId,
        total: total,
        status: "pending",
        plataforma: plataforma,
        items: itemsConDatos
    });

    db.externalOrders.push(nuevoPedido);
    writeData(db);

    return nuevoPedido;
  },

  listarPedidos(plataforma) {
    const db = findData();
    let pedidos = db.deliveryOrder || [];

    if (plataforma) {
      pedidos = pedidos.filter(
        p => p.plataforma && p.plataforma.toLowerCase() === plataforma.toLowerCase()
      );
    }

    return pedidos;
  },

  listarPedidosExternos() {
    const db = findData();
    return (db.externalOrders || []).filter(p => p.status === "pending");
  },

  confirmarPedidoExterno(id) {
    const db = findData();

    const pedidoExterno = db.externalOrders.find(p => p.id.toString() === id.toString());
    if (!pedidoExterno) {
      throw new Error("Pedido externo no encontrado");
    }

    if (pedidoExterno.status !== "pending") {
      throw new Error("Pedido ya confirmado o procesado");
    }

    pedidoExterno.status = "preparing";
    const nuevoPedido = new DeliveryOrder(
      pedidoExterno.id,
      pedidoExterno.customerId,
      pedidoExterno.total,
      "preparing",
      pedidoExterno.plataforma
    );
    nuevoPedido.setItems(pedidoExterno.items);

    db.deliveryOrder.push(nuevoPedido);
    db.externalOrders = db.externalOrders.filter(p => p.id.toString() !== id.toString());
    writeData(db);

    return nuevoPedido;
  },

  despacharPedido(id) {
    const db = findData();
    const pedido = db.deliveryOrder.find(p => p.id.toString() === id.toString());

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    pedido.status = "dispatched";
    writeData(db);

    return pedido;
  },

  eliminarPedido(id) {
    const db = findData();
    const initialLength = db.deliveryOrder.length;

    db.deliveryOrder = db.deliveryOrder.filter(p => String(p.id) !== String(id));

    if (db.deliveryOrder.length === initialLength) {
        throw new Error("Pedido no encontrado para eliminar");
    }

    writeData(db);
    return true;
  },

  filtrarPorPlataforma(plataforma) {
    const db = findData();

    if (!plataforma) {
      throw new Error("Debe indicar la plataforma");
    }

    let pedidos = (db.deliveryOrder || []).filter(
      p => p.plataforma && p.plataforma.toLowerCase() === plataforma.toLowerCase()
    );

    if (EXTERNAL_PLATFORMS.includes(plataforma)) {
      const externosPendientes = (db.externalOrders || []).filter(
        p =>
          p.plataforma.toLowerCase() === plataforma.toLowerCase() &&
          p.status.toLowerCase() === "pending"
      );
      pedidos = pedidos.concat(externosPendientes);
    }

    return pedidos;
  }
};

export default DeliveryService;