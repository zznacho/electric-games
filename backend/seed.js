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
        description: 'Es un videojuego de acción y rol de mundo abierto ambientado en la peligrosa megalópolis de Night City, donde controlas a V, un mercenario que se enfrenta a las consecuencias de un atraco fallido',
        price: 59.99,
        image: '/uploads/1765125271747-659092627.jpg'
  
      },
      {
        name: 'Hollow Knight',
        description: 'Cuenta la historia del Caballero, en su búsqueda para descubrir los secretos del largamente abandonado reino de Hallownest, cuyas profundidades atraen a los aventureros y valientes con la promesa de tesoros o la respuesta a misterios antiguos.',
        price: 14.99,
        image: '/uploads/1765125348379-375503186.jpg'
      },
      {
        name: 'God of War',
        description: 'Sigue a Kratos, un antiguo dios de la guerra, mientras recorre los reinos nórdicos con su hijo Atreus. La trama principal se centra en Kratos tratando de controlar su ira para ser un buen padre, mientras se embarcan en una misión personal para cumplir el último deseo de su difunta esposa.',
        price: 49.99,
        image: '/uploads/1765125367481-460130303.jfif'
      },
      {
        name: 'Red Dead Redemption 2',
        description: 'Arthur Morgan y la banda Van der Linde, forajidos que huyen de la ley en Estados Unidos, en 1899, durante el fin del Salvaje Oeste, enfrentándose a agentes federales y dilemas internos mientras intentan sobrevivir y elegir entre sus ideales y la lealtad al grupo, en una épica historia de honor, traición y redención en un vasto mundo abierto lleno de detalles y personajes complejos.',
        price: 59.99,
        image: '/uploads/1765124624186-750055392.jpg'
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
