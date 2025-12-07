import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  gameData: { // <-- nueva sección
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String }
  },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending','paid','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  paymentInfo: {
    cardHolder: String,
    last4: String,
    simulated: { type: Boolean, default: true }
  }
});

export default mongoose.model('Order', OrderSchema);
