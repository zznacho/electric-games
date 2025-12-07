import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import adminRoutes from './routes/admin.js';
import purchasesRoutes from './routes/purchases.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a la base de datos
connectDB(process.env.MONGO_URI);

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/purchases', purchasesRoutes);

// Servir imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});
