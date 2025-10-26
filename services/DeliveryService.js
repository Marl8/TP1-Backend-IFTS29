import DeliveryOrder from "../models/DeliveryOrder.js";

const DeliveryService = {
  crearPedido: async (customerId, items, status, assignedRiderId = null, estimatedTime = null, plataforma = "Propia") => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const newOrder = new DeliveryOrder({
      customerId,
      items,
      status,
      total,
      assignedRiderId,
      estimatedTime: estimatedTime ? new Date(Date.now() + estimatedTime * 60000) : null,
      plataforma
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Pedido guardado en Mongo:", savedOrder._id);
    return savedOrder;
  },

  listarPedidos: async () => {
    return await DeliveryOrder.find()
      .populate("customerId")
      .populate("items.menuItem")
      .populate("assignedRiderId");
  },

  despacharPedido: async (id) => {
    const pedido = await DeliveryOrder.findById(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    pedido.status = "dispatched";
    await pedido.save();
    return pedido;
  },

  eliminarPedido: async (id) => {
    await DeliveryOrder.findByIdAndDelete(id);
    return true;
  }
};

export default DeliveryService;


/*
// DeliveryService.js
import DeliveryOrder from "../models/DeliveryOrder.js";

const DeliveryService = {

  // Crear un nuevo pedido
  crearPedido: async (
    customerId,
    items = [],
    status = "preparing",
    total = 0,
    assignedRiderId = null,
    estimatedTime = null,
    plataforma = "Propia"
  ) => {
    try {
      const newOrder = new DeliveryOrder({
        customerId,
        items: items.map(i => ({
          menuItem: i.menuItem,  // ObjectId de MenuItem
          quantity: i.quantity,
          price: i.price
        })),
        status,
        total,
        assignedRiderId,
        estimatedTime: estimatedTime ? new Date(Date.now() + estimatedTime * 60000) : null,
        plataforma
      });

      const savedOrder = await newOrder.save();
      console.log("✅ Pedido guardado en Mongo:", savedOrder._id);
      return savedOrder;
    } catch (err) {
      console.error("❌ Error en DeliveryService.crearPedido:", err);
      throw err;
    }
  },

  // Listar todos los pedidos, opcional por plataforma
  listarPedidos: async (plataforma) => {
    const filter = plataforma ? { plataforma } : {};
    return await DeliveryOrder.find(filter)
      .populate("customerId")
      .populate("items.menuItem")
      .populate("assignedRiderId");
  },

  // Listar pedidos externos (no Propia)
  listarPedidosExternos: async () => {
    return await DeliveryOrder.find({ status: "pending", plataforma: { $ne: "Propia" } })
      .populate("customerId")
      .populate("items.menuItem");
  },

  // Confirmar pedido externo
  confirmarPedidoExterno: async (id) => {
    const pedido = await DeliveryOrder.findById(id);
    if (!pedido) throw new Error("Pedido externo no encontrado");
    pedido.status = "preparing";
    await pedido.save();
    return pedido;
  },

  // Despachar pedido
  despacharPedido: async (id) => {
    const pedido = await DeliveryOrder.findById(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    pedido.status = "dispatched";
    await pedido.save();
    return pedido;
  },

  // Eliminar pedido
  eliminarPedido: async (id) => {
    await DeliveryOrder.findByIdAndDelete(id);
    return true;
  }
};

export default DeliveryService;






/*import DeliveryOrder from "../models/DeliveryOrder.js";
import { findData, writeData } from "../data/db.js";

const EXTERNAL_PLATFORMS = ["Rappi", "PedidosYa", "Uber Eats"];
const MODE = process.env.DATA_SOURCE || "local"; // "local" o "mongo"

const DeliveryService = {
  /**
   * Crear un pedido (local o mongo)
   */
 /* async crearPedido(customerId, items, estado, total, repartidor, estEntrega, plataforma) {
    if (!customerId || !Array.isArray(items) || items.length === 0 || !plataforma) {
      throw new Error("Datos incompletos. Se requieren: Cliente, Ítems y Plataforma.");
    }

    if (MODE === "mongo") {
      // ====== 💾 VERSIÓN MONGO ======
      const delivery = new DeliveryOrder({
        customerId,
        items: items.map(i => i.id),
        status: estado || "preparing",
        total: total || 0,
        assignedRiderId: repartidor || null,
        estimatedTime: estEntrega ? new Date(Date.now() + estEntrega * 60000) : null,
        plataforma: plataforma || "Propia",
      });

      await delivery.save();
      return delivery;
    } else {
      // ====== 📁 VERSIÓN LOCAL ======
      console.log("🟢 MODO LOCAL activo (guardando en data/data.json)");//borrar
      const db = findData();
      console.log("📦 Contenido actual del archivo:", db.deliveryOrder?.length || 0, "pedidos existentes");//borrar
      const menuItems = db.MenuItem;
      let calculatedTotal = 0;
      const itemsConDatos = [];

      for (let pedidoItem of items) {
        const menuItem = menuItems.find(mi => String(mi.id) === String(pedidoItem.id));
        if (!menuItem) {
          console.error("❌ Item no encontrado en el menú:", pedidoItem.id);//borrar
          throw new Error(`Item con id ${pedidoItem.id} no existe`);
        }
        if (menuItem.stock < pedidoItem.quantity){
          console.error(`⚠️ Stock insuficiente para ${menuItem.name} (stock: ${menuItem.stock}, pedido: ${pedidoItem.quantity})`);//borrar
          throw new Error(`Stock insuficiente para ${menuItem.name}`);
        }
          

        menuItem.stock -= pedidoItem.quantity;
        calculatedTotal += menuItem.price * pedidoItem.quantity;

        itemsConDatos.push({
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: pedidoItem.quantity,
        });
      }

      const finalTotal = total ? parseFloat(total) : calculatedTotal;

      const nuevoPedido = {
        id: Date.now(),
        customerId,
        total: finalTotal,
        status: estado || "preparing",
        plataforma: plataforma || "Propia",
        items: itemsConDatos,
        assignedRiderId: repartidor || null,
        estimatedTime: estEntrega || null,
      };

      console.log("🧾 Nuevo pedido a guardar:", JSON.stringify(nuevoPedido, null, 2));
      
      if (!Array.isArray(db.deliveryOrder)) {
        console.warn("⚠️ db.deliveryOrder no existe o no es array. Creando uno nuevo.");
        db.deliveryOrder = [];
      }

      db.deliveryOrder.push(nuevoPedido);
      console.log("📥 Pedido agregado a memoria. Total actual:", db.deliveryOrder.length);//borrar

      try {
        writeData(db);
        console.log("💾 Archivo data.json actualizado correctamente.");
      } catch (err) {
        console.error("❌ Error al escribir en data.json:", err);
      }

      console.log("✅ Pedido guardado correctamente con ID:", nuevoPedido.id);
      return nuevoPedido;
      }
  },/*

  /**
   * Crear pedido externo (PedidosYa, Rappi, UberEats)
   */
 /* async crearPedidoExterno(customerId, items, plataforma) {
    if (!customerId || !Array.isArray(items) || items.length === 0 || !plataforma) {
      throw new Error("Datos incompletos");
    }

    if (!EXTERNAL_PLATFORMS.includes(plataforma)) {
      throw new Error(`Plataforma inválida. Debe ser: ${EXTERNAL_PLATFORMS.join(", ")}`);
    }

    if (MODE === "mongo") {
      const delivery = new DeliveryOrder({
        customerId,
        items: items.map(i => i.id),
        status: "pending",
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        plataforma,
      });
      await delivery.save();
      return delivery;
    } else {
      const db = findData();
      const customer = db.customer.find(c => c.id === customerId || c._id === customerId);
      if (!customer) throw new Error(`Cliente con id ${customerId} no existe`);

      const menuItems = db.MenuItem;
      let total = 0;
      const itemsConDatos = [];

      for (let pedidoItem of items) {
        const item = menuItems.find(mi => String(mi.id) === String(pedidoItem.id));
        if (!item) throw new Error(`Item con id ${pedidoItem.id} no existe`);
        if (item.stock < pedidoItem.quantity)
          throw new Error(`Stock insuficiente para ${item.name}`);

        item.stock -= pedidoItem.quantity;
        total += item.price * pedidoItem.quantity;

        itemsConDatos.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: pedidoItem.quantity,
        });
      }

      const nuevoPedido = {
        id: Date.now(),
        customerId,
        total,
        status: "pending",
        plataforma,
        items: itemsConDatos,
      };

      db.externalOrders.push(nuevoPedido);
      writeData(db);
      return nuevoPedido;
    }
  },

  /**
   * Listar pedidos
   */
  /*async listarPedidos(plataforma) {
    if (MODE === "mongo") {
      const filter = plataforma ? { plataforma } : {};
      return await DeliveryOrder.find(filter)
        .populate("customerId")
        .populate("items")
        .populate("assignedRiderId");
    } else {
      const db = findData();
      let pedidos = db.deliveryOrder || [];
      if (plataforma) {
        pedidos = pedidos.filter(
          p => p.plataforma && p.plataforma.toLowerCase() === plataforma.toLowerCase()
        );
      }
      return pedidos;
    }
  },

  /**
   * Listar pedidos externos pendientes
   */
 /* async listarPedidosExternos() {
    if (MODE === "mongo") {
      return await DeliveryOrder.find({ status: "pending", plataforma: { $ne: "Propia" } });
    } else {
      const db = findData();
      return (db.externalOrders || []).filter(p => p.status === "pending");
    }
  },

  /**
   * Confirmar pedido externo
   */
 /* async confirmarPedidoExterno(id) {
    if (MODE === "mongo") {
      const pedido = await DeliveryOrder.findById(id);
      if (!pedido) throw new Error("Pedido externo no encontrado");
      pedido.status = "preparing";
      await pedido.save();
      return pedido;
    } else {
      const db = findData();
      const pedidoExterno = db.externalOrders.find(p => String(p.id) === String(id));
      if (!pedidoExterno) throw new Error("Pedido externo no encontrado");
      pedidoExterno.status = "preparing";
      db.deliveryOrder.push(pedidoExterno);
      db.externalOrders = db.externalOrders.filter(p => String(p.id) !== String(id));
      writeData(db);
      return pedidoExterno;
    }
  },

  /**
   * Despachar pedido (cambia estado)
   */
 /* async despacharPedido(id) {
    if (MODE === "mongo") {
      const pedido = await DeliveryOrder.findById(id);
      if (!pedido) throw new Error("Pedido no encontrado");
      pedido.status = "dispatched";
      await pedido.save();
      return pedido;
    } else {
      const db = findData();
      const pedido = db.deliveryOrder.find(p => String(p.id) === String(id));
      if (!pedido) throw new Error("Pedido no encontrado");
      pedido.status = "dispatched";
      writeData(db);
      return pedido;
    }
  },

  /**
   * Eliminar pedido
   */
 /* async eliminarPedido(id) {
    if (MODE === "mongo") {
      await DeliveryOrder.findByIdAndDelete(id);
      return true;
    } else {
      const db = findData();
      const initialLength = db.deliveryOrder.length;
      db.deliveryOrder = db.deliveryOrder.filter(p => String(p.id) !== String(id));
      if (db.deliveryOrder.length === initialLength) {
        throw new Error("Pedido no encontrado para eliminar");
      }
      writeData(db);
      return true;
    }
  },
};

export default DeliveryService;*/
