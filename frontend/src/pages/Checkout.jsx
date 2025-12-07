// frontend/src/pages/Checkout.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { orderId } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const nav = useNavigate();

  useEffect(() => {
    axios.get('/api/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const o = res.data.find(x => x._id === orderId);
      setOrder(o);
    });
  }, [orderId]);

  const pay = async () => {
    await axios.post(
      `/api/purchases/${orderId}/pay`,
      { cardHolder, cardNumber },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    nav('/perfil');
  };

  if (!order) return <p>Cargando...</p>;

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">
        Pagar {order.game.name}
      </h1>

      <p>Precio: ${order.price}</p>

      <input
        className="input"
        placeholder="Nombre del titular"
        value={cardHolder}
        onChange={e => setCardHolder(e.target.value)}
      />

      <input
        className="input"
        placeholder="Número de tarjeta (simulado)"
        value={cardNumber}
        onChange={e => setCardNumber(e.target.value)}
      />

      <button className="btn-primary w-full" onClick={pay}>
        Pagar
      </button>
    </div>
  );
}
