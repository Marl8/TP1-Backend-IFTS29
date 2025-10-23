import DeliveryService from "../services/DeliveryService.js";
import { findData } from "../data/db.js";
import CustomerService from "../services/CustomerService.js";
import { log } from "console";

<<<<<<< HEAD
const DeliveryWebController = {
  listDeliveriesWeb: (req, res) => {
    try {
      const deliveries = DeliveryService.listarPedidos();
      res.render("deliveryViews/listDeliveries", { title: "Listado de Pedidos", deliveries });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  showAddForm: (req, res) => {
    const db = findData();
    res.render("deliveryViews/addDelivery", {
      title: "Agregar Pedido",
      menuItems: db.MenuItem || [],
      customer: null,
      customerId: null,
      oldData: {}
    });
  },

  findCustomerForAdd: async (req, res) => {
    const db = findData();
    try {
      const { dni } = req.body;
      if (!dni) {
        return res.render("deliveryViews/addDelivery", {
          title: "Agregar Pedido",
          menuItems: db.MenuItem || [],
          error: "Debe ingresar un DNI",
          customer: null,
          customerId: null,
          oldData: { dni }
        });
      }

      const customer = await CustomerService.findCustomerByDni(dni);
      const customerId = customer._id?.toString?.() ?? customer.id;

      return res.render("deliveryViews/addDelivery", {
        title: "Agregar Pedido",
        menuItems: db.MenuItem || [],
        customer,
        customerId,
        oldData: { dni }
      });
    } catch (error) {
      return res.render("deliveryViews/addDelivery", {
        title: "Agregar Pedido",
        menuItems: db.MenuItem || [],
        error: error.message,
        customer: null,
        customerId: null,
        oldData: req.body
      });
    }
  },

  saveDeliveryWeb: (req, res) => {
    try {
      console.log("Entró al try de saveDeliveryWeb");

      const { customerId } = req.body;
      let { items } = req.body; // puede venir string JSON, string simple, o incluso array

    // 1) Normalizamos items si viene como string JSON del hidden
      if (typeof items === 'string') {
        const trimmed = items.trim();

        if (trimmed.startsWith('[')) {
        // Caso formulario nuevo: '[{"id":"1","quantity":2}, ...]'
          try {
            items = JSON.parse(trimmed);
          } catch (e) {
            console.warn("items no es JSON válido:", trimmed);
            items = [];
          }
        } else if (trimmed.length > 0) {
        // Caso fallback (textarea): '1,2,3' -> lo convertimos a [{id, quantity:1}, ...]
          items = trimmed
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(id => ({ id, quantity: 1 }));
        } else {
          items = [];
        }
      }

    // 2) Si por alguna razón sigue sin ser array, lo forzamos a vacío
      if (!Array.isArray(items)) {
        console.warn("items no es array después de normalizar:", items);
        items = [];
      }

      console.log("Datos normalizados:", { customerId, items });

    // 3) Lógica de negocio
      const pedido = DeliveryService.crearPedido(customerId, items);
      console.log("Pedido creado correctamente:", pedido?.id);
      // const { customerId, items } = req.body;
      // console.log("Datos recibidos:", { customerId, items });
      // DeliveryService.crearPedido(customerId, items);
      // console.log("Pedido creado correctamente");
        
      res.redirect("/delivery/list");
    } catch (error) {
      console.error("Error en saveDeliveryWeb:", error.message);
      res.render("deliveryViews/addDelivery", {
        title: "Agregar Pedido",
        error: error.message,
        oldData: req.body
      });
    }
  },

  showDeliveryToEdit: (req, res) => {
    try {
      const delivery = DeliveryService.listarPedidos().find(
        d => d.id.toString() === req.query.id
      );
      res.render("deliveryViews/updateDelivery", { delivery });
    } catch (error) {
      res.render("deliveryViews/updateDelivery", { error: error.message });
    }
  },

  updateDeliveryWeb: (req, res) => {
    try {
      DeliveryService.despacharPedido(req.params.id);
      res.redirect("/delivery/list");
    } catch (error) {
      res.render("deliveryViews/updateDelivery", {
        title: "Editar Pedido",
        error: error.message,
        delivery: req.body
      });
    }
  },

  showDeliveryToDelete: (req, res) => {
    try {
      const delivery = DeliveryService.listarPedidos().find(
        d => d.id.toString() === req.query.id
      );
      res.render("deliveryViews/deleteDelivery", { delivery });
    } catch (error) {
      res.render("deliveryViews/deleteDelivery", { error: error.message });
    }
  },

  deleteDeliveryWeb: (req, res) => {
    try {
      DeliveryService.despacharPedido(req.params.id);
      res.redirect("/delivery/list");
    } catch (error) {
      res.status(500).send(error.message);
    }
=======
const showDeliveryMenu = (req, res) => {
  try {
    res.render("deliveryViews/deliveryMenu", {
      title: "Gestión de Pedidos",
      query: req.query
    });
  } catch (error) {
    res.status(500).send(error.message);
>>>>>>> bc007afba3efa2f8b6db4409dad23d58a13ace53
  }
};

const DeliveryWebController = {
showDeliveryMenu,
  listDeliveriesWeb: (req, res) => {

    try {

      const deliveries = DeliveryService.listarPedidos();

      res.render("deliveryViews/listDeliveries", { title: "Listado de Pedidos", deliveries });

    } catch (error) {

      res.status(500).send(error.message);

    }

  },



  showAddForm: (req, res) => {

    res.render("deliveryViews/addDelivery", { title: "Agregar Pedido" });

  },



  saveDeliveryWeb: (req, res) => {

    try {

      const { customerId, items } = req.body;

      DeliveryService.crearPedido(customerId, items);

      res.redirect("/delivery-orders/list");

    } catch (error) {

      res.render("deliveryViews/addDelivery", {

        title: "Agregar Pedido",

        error: error.message,

        oldData: req.body

      });

    }

  },



  showDeliveryToEdit: (req, res) => {

    try {

      const delivery = DeliveryService.listarPedidos().find(

        d => d.id.toString() === req.query.id

      );

      res.render("deliveryViews/updateDelivery", { delivery });

    } catch (error) {

      res.render("deliveryViews/updateDelivery", { error: error.message });

    }

  },



  updateDeliveryWeb: (req, res) => {

    try {

      DeliveryService.despacharPedido(req.params.id);

      res.redirect("/delivery-orders/list");

    } catch (error) {

      res.render("deliveryViews/updateDelivery", {

        title: "Editar Pedido",

        error: error.message,

        delivery: req.body

      });

    }

  },



  showDeliveryToDelete: (req, res) => {

    try {

      const delivery = DeliveryService.listarPedidos().find(

        d => d.id.toString() === req.query.id

      );

      res.render("deliveryViews/deleteDelivery", { delivery });

    } catch (error) {

      res.render("deliveryViews/deleteDelivery", { error: error.message });

    }

  },



  deleteDeliveryWeb: (req, res) => {

    try {

      DeliveryService.despacharPedido(req.params.id);

      res.redirect("/delivery-orders/list");

    } catch (error) {

      res.status(500).send(error.message);

    }

  }

};



export default DeliveryWebController;
