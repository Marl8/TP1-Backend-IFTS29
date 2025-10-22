import DeliveryService from "../services/DeliveryService.js";

const DeliveryOrderController = {
  async crearPedido(req, res) {
    try {
      const { customerId, items } = req.body;
      const nuevoPedido = DeliveryService.crearPedido(customerId, items);
      res.status(201).json({ message: "Pedido creado con éxito", pedido: nuevoPedido });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async crearPedidoExterno(req, res) {
    try {
      const { customerId, items, plataforma } = req.body;
      const nuevoPedido = DeliveryService.crearPedidoExterno(customerId, items, plataforma);
      res.status(201).json({
        message: "Pedido externo creado y pendiente de confirmación",
        pedido: nuevoPedido
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async listarPedidos(req, res) {
    try {
      const pedidos = DeliveryService.listarPedidos(req.query.plataforma);
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async listarPedidosExternos(req, res) {
    try {
      const pendientes = DeliveryService.listarPedidosExternos();
      res.status(200).json(pendientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async confirmarPedidoExterno(req, res) {
    try {
      const pedido = DeliveryService.confirmarPedidoExterno(req.params.id);
      res.status(200).json({
        message: "Pedido externo confirmado y en preparación",
        pedido
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async despacharPedido(req, res) {
    try {
      const pedido = DeliveryService.despacharPedido(req.params.id);
      res.status(200).json({ message: "Pedido despachado", pedido });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async filtrarPorPlataforma(req, res) {
    try {
      const pedidos = DeliveryService.filtrarPorPlataforma(
        req.query.plataforma || req.body.plataforma
      );
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export default DeliveryOrderController;
