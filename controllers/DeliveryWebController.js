import DeliveryService from "../services/DeliveryService.js";
import CustomerService from '../services/CustomerService.js'; 
import RiderService from "../services/RiderService.js"; 
import MenuItem from '../models/MenuItem.js';
import DeliveryOrder from "../models/DeliveryOrder.js";
import Rider from "../models/Rider.js";
import { findData, writeData } from "../data/db.js";

const showDeliveryMenu = (req, res) => {
    try {
        res.render("deliveryViews/deliveryMenu", {
            title: "Gestión de Pedidos",
            query: req.query
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};




const showAddForm = async (req, res) => {
  const { customerId } = req.query;
  let customer = null;
  let error = null;

  try {
    // 1️⃣ Buscar cliente si se pasó el ID
    if (customerId) {
      customer = await CustomerService.findCustomerById(customerId);
      if (!customer) error = `Cliente con ID/DNI ${customerId} no encontrado.`;
    }

    // 2️⃣ Traer todos los ítems del menú desde MongoDB y sus supplies
    const menuItems = await MenuItem.find().populate('supplies');

    // 3️⃣ Traer repartidores
    const { riders, message: ridersMessage } = await RiderService.findAllRiders();

    // 4️⃣ Renderizar la plantilla Pug pasando los datos de MongoDB
    res.render('deliveryViews/addDelivery', {
      title: 'Agregar Pedido',
      query: req.query,
      customer,
      customerId,
      menuItems,       // ✅ datos reales
      error,
      riders,
      ridersMessage,
      oldData: req.query
    });

  } catch (err) {
    console.error('Error en showAddForm:', err);
    res.status(500).render('errorView', {
      title: 'Error',
      message: 'Error interno al cargar datos: ' + err.message,
      query: req.query
    });
  }
};


const findCustomerByDni = async (req, res) => {
  const { dni } = req.body;

  try {
    if (!dni || dni.trim() === "") throw new Error("Debe ingresar un DNI válido.");

    const customer = await CustomerService.findCustomerByDni(dni);
    const menuItems = await MenuItem.find().populate('supplies'); // ✅ MongoDB

    if (!customer) {
      return res.render("deliveryViews/addDelivery", {
        title: "Agregar Pedido",
        error: `No se encontró ningún cliente con el DNI ${dni}.`,
        customer: null,
        customerId: null,
        menuItems,   // ✅ MongoDB
        oldData: { dni }
      });
    }

    res.render("deliveryViews/addDelivery", {
      title: "Agregar Pedido",
      customer,
      customerId: customer._id || customer.id,
      menuItems,     // ✅ MongoDB
      error: null,
      oldData: { dni }
    });

  } catch (err) {
    console.error("Error al buscar cliente:", err);

    const menuItems = await MenuItem.find().populate('supplies'); // ✅ MongoDB
    res.render("deliveryViews/addDelivery", {
      title: "Agregar Pedido",
      customer: null,
      customerId: null,
      menuItems,     // ✅ MongoDB
      error: err.message || "Ocurrió un error al buscar el cliente.",
      oldData: { dni }
    });
  }
};



const listDeliveries = async (req, res) => {
  try {
    // 1️ Traer todos los pedidos desde MongoDB
    const rawDeliveries = await DeliveryOrder.find()
      .populate('customerId')        // Datos del cliente
      .populate('assignedRiderId')   // Datos del repartidor
      .lean();                       // Devuelve objetos planos

    // 2️ Mapear cada pedido con toda la info necesaria
    const deliveries = rawDeliveries.map(d => ({
      _id: d._id.toString(),  // ✅ ID real de Mongo
      customerDisplayId: d.customerId ? d.customerId.dni : '-',
      customerName: d.customerId ? d.customerId.name : 'Cliente no encontrado',
      items: d.items || [],
      total: d.items ? d.items.reduce((sum, it) => sum + it.price * it.quantity, 0) : 0,
      totalItems: d.items ? d.items.reduce((sum, it) => sum + it.quantity, 0) : 0,
      status: d.status || 'preparing',
      assignedRiderId: d.assignedRiderId ? d.assignedRiderId.name : '-',
      estimatedDelivery: d.estimatedTime || '-',
      plataforma: d.plataforma || '-'
    }));

    // 3️ Renderizar la plantilla Pug con los datos listos
    res.render('deliveryViews/listDeliveries', {
      title: 'Listado de Pedidos',
      deliveries,
      query: req.query
    });

  } catch (err) {
    console.error("Error en listDeliveries:", err);
    res.render('deliveryViews/listDeliveries', {
      title: 'Listado de Pedidos',
      deliveries: [],
      error: "Error al cargar los pedidos",
      query: req.query
    });
  }
};




const saveDeliveryWeb = async (req, res) => {
  try {
    const { customerId, items, estado, repartidor, estEntrega, plataforma } = req.body;

    // Validar cliente
    const verifiedCustomer = await CustomerService.findCustomerById(customerId);
    if (!verifiedCustomer) throw new Error("Cliente no encontrado");

    // Parsear items del JSON
    let itemsArray = [];
    if (typeof items === "string" && items.trim() !== "") {
      itemsArray = JSON.parse(items);
    }

    if (!itemsArray.length) throw new Error("Debe agregar al menos un ítem");

    // Mapear solo lo que el modelo necesita
    const itemsForMongo = itemsArray.map(i => ({
      menuItem: i.menuItem,  // solo el ObjectId
      quantity: i.quantity,
      price: i.price
    }));

    // Calcular total
    const total = itemsForMongo.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Rider opcional
    const riderId = repartidor && repartidor.trim() !== "" ? repartidor : null;

    // Descontar stock en la base de datos
    for (const it of itemsForMongo) {
      const menuItemDoc = await MenuItem.findById(it.menuItem);
      if (!menuItemDoc) throw new Error(`Item con ID ${it.menuItem} no encontrado`);
      if (menuItemDoc.stock < it.quantity) throw new Error(`Stock insuficiente para ${menuItemDoc.name}`);
      menuItemDoc.stock -= it.quantity;
      await menuItemDoc.save();
    }

    // Guardar pedido en Mongo
    await DeliveryService.crearPedido(
      verifiedCustomer._id,
      itemsForMongo,
      estado,
      riderId,
      estEntrega,
      plataforma
    );

    res.redirect("/delivery/list?success=Pedido creado con éxito");
  } catch (error) {
    const errorMessage = encodeURIComponent(error.message);
    res.redirect(`/delivery/add?customerId=${req.body.customerId}&error=${errorMessage}`);
  }
};



const showDeliveryToEdit = async (req, res) => {
    try {
        const idToFind = req.query.id;
        let delivery = null;
        let riders = [];

        if (idToFind) {
            delivery = await DeliveryOrder.findById(idToFind)
                .populate('customerId')
                .populate('assignedRiderId')
                .lean();

            if (!delivery) {
                return res.render("deliveryViews/updateDelivery", { 
                    error: `No se encontró el pedido con ID ${idToFind}`,
                    query: req.query
                });
            }
        }

        // Traer todos los riders para el select
        riders = await Rider.find().lean();

        res.render("deliveryViews/updateDelivery", { delivery, riders, query: req.query });

    } catch (error) {
        console.error(error);
        res.render("deliveryViews/updateDelivery", { error: error.message, query: req.query });
    }
};

/*
// Guardar cambios de edición
const updateDeliveryWeb = async (req, res) => {
  try {
    const { estado, repartidor } = req.body;
    const id = req.params.id; // viene de /delivery/update/:id

    const delivery = await DeliveryOrder.findById(id);
    if (!delivery) throw new Error("Pedido no encontrado");

    if (estado) delivery.status = estado;
    if (repartidor) delivery.assignedRiderId = repartidor || null;

    await delivery.save(); // ✅ Cambios guardados en Mongo

    res.redirect("/delivery/list?success=Pedido actualizado");

  } catch (err) {
    console.error(err);
    res.render("deliveryViews/updateDelivery", {
      title: "Editar Pedido",
      error: err.message,
      delivery: req.body,
      query: req.query
    });
  }
};*/


const updateDeliveryWeb = async (req, res) => {
  try {
    const { estado, total, repartidor } = req.body;
    const id = req.params.id;

    // Buscar pedido
    const delivery = await DeliveryOrder.findById(id);
    if (!delivery) throw new Error('Pedido no encontrado');

    // Actualizar campos
    delivery.status = estado || delivery.status;
    delivery.total = total || delivery.total;
    delivery.assignedRiderId = repartidor || null;

    await delivery.save();

    res.redirect('/delivery/list?success=Pedido actualizado con éxito');
  } catch (err) {
    console.error('Error actualizando pedido:', err);
    res.render('deliveryViews/updateDelivery', {
      delivery: req.body,
      error: err.message,
      query: req.query,
      riders: await Rider.find() // si usás dropdown de repartidores
    });
  }
};




const showDeliveryToDelete = async (req, res) => { 
    const idToFind = req.query.id;
    let delivery = null;
    let error = null;
    let customerName = 'N/A';

    try {
        if (idToFind) {
            delivery = DeliveryService.listarPedidos().find(
                d => String(d.id) === String(idToFind)
            );
            
            if (delivery) {
                try {
                    const customer = await CustomerService.findCustomerById(delivery.customerId);
                    customerName = customer.name; 
                } catch (e) {
                    customerName = `ID Cliente: ${delivery.customerId}`;
                }
            } else {
                error = `El pedido con ID ${idToFind} no fue encontrado.`;
            }
        }
        
        res.render("deliveryViews/deleteDelivery", { 
            delivery, 
            query: req.query,
            error: error,
            customerName: customerName
        });

    } catch (err) {
        res.render("deliveryViews/deleteDelivery", { 
            error: err.message, 
            query: req.query,
            customerName: customerName
        });
    }
};


const deleteDeliveries = (req, res) => {
    try {
        DeliveryService.eliminarPedido(req.params.id);
        
        res.redirect("/delivery/list?success=eliminado"); 

    } catch (error) {
        const errorMessage = encodeURIComponent(error.message);
        res.redirect(`/delivery/delete?id=${req.params.id}&error=${errorMessage}`);
    }
};



const DeliveryWebController = {
    showDeliveryMenu,
    showAddForm,
    findCustomerByDni,
    listDeliveries,
    saveDeliveryWeb,
    showDeliveryToEdit,
    updateDeliveryWeb,
    showDeliveryToDelete,
    deleteDeliveries
};

export default DeliveryWebController;