import { useEffect, useState } from "react";
import axios from "axios";

export default function Store() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("/api/games").then(res => setGames(res.data));
  }, []);

  return (
    <div>
      {games.map(game => (
        <div key={game._id}>
          <img src={game.image} width="200" />
          <h3>{game.name}</h3>
          <p>{game.description}</p>
          <strong>${game.price}</strong>
        </div>
      ))}
    </div>
  );
}
