import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
  if (!token) return res.status(401).json({ msg: 'Token faltante' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ msg: 'Usuario no encontrado' });
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ msg: 'Requiere privilegios de admin' });
  next();
};

