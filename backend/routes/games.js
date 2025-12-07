import express from 'express';
import multer from 'multer';
import path from 'path';
import Game from '../models/Game.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ---------------------------
// RUTAS
// ---------------------------
// Listar todos los juegos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Crear un juego (solo admin)
router.post('/', authMiddleware, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !req.file) {
      return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    const newGame = new Game({
      name,
      description,
      price,
      image: '/uploads/' + req.file.filename,
      category
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});



// Obtener un juego por ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Juego no encontrado' });
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});



// Editar un juego por ID (solo admin)
router.put('/:id', authMiddleware, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };

    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedGame) return res.status(404).json({ msg: 'Juego no encontrado' });

    res.json(updatedGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Borrar un juego por ID (solo admin)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) return res.status(404).json({ msg: 'Juego no encontrado' });

    res.json({ msg: 'Juego eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

export default router;
