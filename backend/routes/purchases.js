// backend/routes/purchases.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Game from '../models/Game.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear compra para un juego (solo si no tiene otra orden 'pending' y no está comprado)
router.post('/:gameId', async (req, res) => {
  try {
    const userId = req.user._id;
    const gameId = req.params.gameId;

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Juego no encontrado' });

    // Verificar si ya compró el juego
    const alreadyPurchased = await Order.findOne({ 
      buyer: userId,
      game: gameId,
      status: 'paid'
    });
    if (alreadyPurchased) {
      return res.status(400).json({ msg: 'Ya compraste este juego' });
    }

    // Verificar si hay orden pendiente
    const existing = await Order.findOne({ buyer: userId, status: 'pending' });

    if (existing) {
      // Si es el mismo juego, devolvemos la orden existente
      if (existing.game.toString() === gameId) {
        return res.json(existing);
      }

      // Cancelamos la anterior automáticamente
      existing.status = 'cancelled';
      await existing.save();
    }

    // Crear orden guardando los datos del juego en gameData
    const order = new Order({
      buyer: userId,
      game: gameId,
      gameData: {
        name: game.name,
        price: game.price,
        image: game.image,
        description: game.description
      },
      price: game.price,
      status: 'pending'
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Biblioteca de juegos comprados
router.get('/library/me', async (req, res) => {
  try {
    const orders = await Order.find({ 
      buyer: req.user._id,
      status: 'paid'
    });

    // Enviar los datos del juego desde gameData
    res.json(orders.map(o => ({
      _id: o._id,
      name: o.gameData.name,
      price: o.gameData.price,
      image: o.gameData.image,
      description: o.gameData.description,
      status: o.status
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Obtener compras del usuario
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Simular pago (marcar 'paid')
router.post('/:orderId/pay', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { cardHolder, cardNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Orden no encontrada' });
    if (order.buyer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado para pagar esta orden' });
    }
    if (order.status !== 'pending') return res.status(400).json({ msg: 'La orden ya no está pendiente' });

    const last4 = (cardNumber || '').slice(-4);
    order.status = 'paid';
    order.paymentInfo = { cardHolder: cardHolder || 'Simulado', last4, simulated: true };
    await order.save();

    res.json({ msg: 'Pago simulado exitoso', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Cancelar orden (usuario)
router.post('/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: 'Orden no encontrada' });
    if (order.buyer.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'No autorizado' });
    if (order.status !== 'pending') return res.status(400).json({ msg: 'Solo se pueden cancelar órdenes pendientes' });

    order.status = 'cancelled';
    await order.save();
    res.json({ msg: 'Orden cancelada', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Descargar archivo simulado del juego
router.get('/:orderId/download', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: 'Orden no encontrada' });

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ msg: 'Debes completar el pago primero' });
    }

    const fileContent = `
Juego: ${order.gameData.name}
Gracias por tu compra.

Descarga en curso.
    `;

    const safeName = order.gameData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.setHeader('Content-Disposition', `attachment; filename=${safeName}.txt`); 
    res.setHeader('Content-Type', 'text/plain');

    res.send(fileContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

export default router;
