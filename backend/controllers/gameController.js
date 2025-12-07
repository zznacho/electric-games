const Game = require('../models/Game');

exports.createGame = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const game = new Game({ name, description, price, image });
    await game.save();

    res.json({ message: "Juego creado exitosamente", game });
  } catch (err) {
    res.status(500).json({ message: "Error al crear juego", error: err });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const updated = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Juego actualizado", updated });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar juego", error: err });
  }
};

exports.getGames = async (req, res) => {
  const games = await Game.find();
  res.json(games);
};
