import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// Todas las rutas aquí requieren admin
router.use(authMiddleware, adminOnly);

// Listar usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Eliminar usuario
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId === req.user.id) return res.status(400).json({ msg: 'No puedes eliminarte a ti mismo' });

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    await Order.deleteMany({ buyer: userId });
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Listar órdenes
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer', 'username email').populate('game', 'name price image').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Cambiar estado de orden
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending','paid','cancelled'].includes(status)) return res.status(400).json({ msg: 'Estado inválido' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('buyer', 'username email')
      .populate('game', 'name price');
    if (!order) return res.status(404).json({ msg: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

export default router;
