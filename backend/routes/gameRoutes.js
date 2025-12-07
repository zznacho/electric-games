import express from 'express';
import { getGames, createGame, updateGame } from '../controllers/gameController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Obtener juegos
router.get('/', getGames);

// Crear juego (solo admin)
router.post('/', auth, admin, createGame);

// Editar juego (solo admin)
router.put('/:id', auth, admin, updateGame);

export default router;
