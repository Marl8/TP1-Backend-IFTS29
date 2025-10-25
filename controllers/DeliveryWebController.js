import DeliveryService from "../services/DeliveryService.js";
import CustomerService from '../services/CustomerService.js'; 
import RiderService from "../services/RiderService.js"; 
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
        if (customerId) {
            customer = await CustomerService.findCustomerById(customerId); 
            if (!customer) {
                error = `Cliente con ID/DNI ${customerId} no encontrado.`;
            }
        }
        
        const { riders, message: ridersMessage } = await RiderService.findAllRiders();

        res.render("deliveryViews/addDelivery", { 
            title: "Agregar Pedido",
            query: req.query,
            customer: customer,   
            error: error,
            riders,
            ridersMessage,
        });

    } catch(err) {
        console.error("Error en showAddForm:", err);
        res.status(500).render('errorView', {
             title: "Error",
             message: "Error interno al buscar cliente: " + err.message,
             query: req.query
        });
    }
};

const findCustomerByDni = async (req, res) => {
  const { dni } = req.body;
  const db = findData();

  try {
    if (!dni || dni.trim() === "") {
      throw new Error("Debe ingresar un DNI válido para buscar al cliente.");
    }

    const customer = await CustomerService.findCustomerByDni(dni);

    if (!customer) {
      return res.render("deliveryViews/addDelivery", {
        title: "Agregar Pedido",
        error: `No se encontró ningún cliente con el DNI ${dni}.`,
        customer: null,
        customerId: null,
        menuItems: db.MenuItem,
        oldData: { dni }
      });
    }

    // Si encontró cliente
    res.render("deliveryViews/addDelivery", {
      title: "Agregar Pedido",
      customer,
      customerId: customer._id || customer.id,
      menuItems: db.MenuItem,
      error: null,
      oldData: { dni }
    });

  } catch (err) {
    console.error("Error al buscar cliente:", err);
    res.render("deliveryViews/addDelivery", {
      title: "Agregar Pedido",
      customer: null,
      customerId: null,
      menuItems: db.MenuItem,
      error: err.message || "Ocurrió un error al buscar el cliente.",
      oldData: { dni }
    });
  }
};


const listDeliveriesWeb = async (req, res) => {
    try {
        const rawDeliveries = await DeliveryService.listarPedidos(); 
        
        const deliveries = await Promise.all(rawDeliveries.map(async (delivery) => {
            try {
                const customer = await CustomerService.findCustomerById(delivery.customerId);
                
                return {
                    ...delivery,
                    customerDisplayId: customer.customerId || customer._id, 
                    customerName: customer.name
                };
            } catch (e) {
                return {
                    ...delivery,
                    customerDisplayId: delivery.customerId, 
                    customerName: 'Cliente No Encontrado'
                };
            }
        }));

        res.render("deliveryViews/listDeliveries", { 
            title: "Listado de Pedidos", 
            deliveries: deliveries, 
            query: req.query 
        });

    } catch (error) {
        console.error("Error al listar pedidos:", error);
        res.status(500).render('errorView', { 
            title: "Error",
            message: "No se pudieron cargar los pedidos: " + error.message,
            query: req.query
        }); 
    }
};


const saveDeliveryWeb = async (req, res) => { 
    try {
        const { customerId, items, estado, total, repartidor, estEntrega, plataforma } = req.body;
        
        const verifiedCustomer = await CustomerService.findCustomerById(customerId); 
        if (!verifiedCustomer) {
            throw new Error("El cliente asociado al ID proporcionado no fue encontrado (Validación Mongoose).");
        }

        let itemsArray = [];
        if (typeof items === 'string' && items.trim() !== '') {
            try {
                itemsArray = JSON.parse(items);
            } catch (err) {
                console.error("❌ Error al parsear items:", err);
                throw new Error("Error en el formato de los ítems del pedido.");
            }
        }

        if (!customerId || itemsArray.length === 0) {
            throw new Error("Datos incompletos. Asegúrese de ingresar el ID del cliente y al menos un ítem.");
        }

        const riderId = repartidor && repartidor.trim() !== '' ? repartidor : null;

        //Borrar cuándo todo esté ok
        console.log("🟢 Guardando nuevo pedido...");
        console.log("Cliente:", verifiedCustomer._id || verifiedCustomer.id);
        console.log("Items:", itemsArray);
        console.log("Estado:", estado);
        console.log("Plataforma:", plataforma);

        
        await DeliveryService.crearPedido(verifiedCustomer._id, itemsArray, estado, total, riderId, estEntrega, plataforma); 

        res.redirect("/delivery/list?success=Pedido creado con éxito"); 

    } catch (error) {
        const errorMessage = encodeURIComponent(error.message);
        res.redirect(`/delivery/add?customerId=${req.body.customerId}&error=${errorMessage}`);
    }
};


const showDeliveryToEdit = (req, res) => {
    try {
        const idToFind = req.query.id;
        let delivery = null;

        if (idToFind) {
            delivery = DeliveryService.listarPedidos().find(
                d => String(d.id) === String(idToFind)
            );
        }

        res.render("deliveryViews/updateDelivery", { delivery, query: req.query }); 
    } catch (error) {
        res.render("deliveryViews/updateDelivery", { error: error.message, query: req.query }); 
    }
};


const updateDeliveryWeb = (req, res) => {
    try {
        DeliveryService.despacharPedido(req.params.id);
        res.redirect("/delivery/list?success=true"); 

    } catch (error) {
        res.render("deliveryViews/updateDelivery", {
            title: "Editar Pedido",
            error: error.message,
            delivery: req.body,
            query: req.query 
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


const deleteDeliveryWeb = (req, res) => {
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
    listDeliveriesWeb,
    saveDeliveryWeb,
    showDeliveryToEdit,
    updateDeliveryWeb,
    showDeliveryToDelete,
    deleteDeliveryWeb
};

export default DeliveryWebController;