import DeliveryService from "../services/DeliveryService.js";

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
