import React, { useState } from "react";
import { useRouter } from "next/router";

const Lobby = () => {
  const [lobbyCode, setLobbyCode] = useState("");
  const router = useRouter();

  const handleCreateLobby = async () => {
    // Call API to create lobby and get lobby code
    const response = await fetch("/api/createLobby");
    const data = await response.json();
    setLobbyCode(data.lobbyCode);
  };

  const handleJoinLobby = () => {
    router.push(`/lobby/${lobbyCode}`);
  };

  return (
    <div>
      <button onClick={handleCreateLobby}>Create Lobby</button>
      <input
        type="text"
        placeholder="Enter Lobby Code"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
      />
      <button onClick={handleJoinLobby}>Join Lobby</button>
    </div>
  );
};

export default Lobby;