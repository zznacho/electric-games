// backend/seed.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Game from './models/Game.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Limpiar colecciones
    await User.deleteMany({});
    await Game.deleteMany({});

    // Crear usuarios
    const admin = new User({
      username: 'admin',
      email: 'admin@electric.local',
      password: 'admin123',
      isAdmin: true
    });

    const user = new User({
      username: 'cliente',
      email: 'cliente@electric.local',
      password: 'cliente123',
      isAdmin: false
    });

    await admin.save();
    await user.save();

    // Crear juegos
    const games = [
      {
        name: 'Cyberpunk 2077',
        description: 'RPG futurista',
        price: 59.99,
        genre: 'RPG',
        platform: 'PC',
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBiF8g6CLUT5YjZW1RCwNVH1sR4W5z6Y58tDqL3LRKIAhTKHFAkZpaUZKJpmcSTN_JbgrFhcKwelkMoSvHTS5yL6d_-xAHNiQRPAERWQ&s=10"
      },
      {
        name: 'Hollow Knight',
        description: 'Metroidvania',
        price: 14.99,
        genre: 'Metroidvania',
        platform: 'PC',
        image: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch/70010000003208/4643fb058642335c523910f3a7910575f56372f612f7c0c9a497aaae978d3e51"
      },
      {
        name: 'God of War',
        description: 'Aventura',
        price: 49.99,
        genre: 'Acción',
        platform: 'PS5',
        image: "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S1_2560x1440-5d74d9b240bba8f2c40920dcde7c5c67_2560x1440-5d74d9b240bba8f2c40920dcde7c5c67"
      }
    ];

    await Game.insertMany(games);

    console.log('Seed completado.');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
