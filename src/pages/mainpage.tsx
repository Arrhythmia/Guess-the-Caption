type MainPageProps = {
    socket: any;
    lobbyCode: string;
    setLobbyCode: React.Dispatch<React.SetStateAction<string>>;
}
export default function Home({ socket, lobbyCode, setLobbyCode }: MainPageProps) {

    const handleCreateLobby = () => {
        socket.emit('createLobby');
      };
    
      const handleJoinLobby = () => {
        socket.emit('joinLobby', lobbyCode);
      };


    return (
        
        <>
          <h1>Create or Join a Lobby</h1>
          <button onClick={handleCreateLobby}>Create Lobby</button>
          <div>
            <label htmlFor="lobbyCode">Lobby Code:</label>
            <input
              type="text"
              id="tempLobbyCode"
              onChange={(e) => setLobbyCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() }}}
            />
            <button onClick={handleJoinLobby}>Join Lobby</button>
          </div>
        </>
    );
};