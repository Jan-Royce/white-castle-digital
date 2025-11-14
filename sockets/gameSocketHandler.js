const Player = require('./../src/Player');
function registerGameSocketHandler(io, game) {
    let playerCount = 0;
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);

        const player = new Player(socket.id);
        if(playerCount >= 4){
            socket.emit("lobby_full");
            console.log(`user ${socket.id} disconnected`);
            socket.disconnect();
            return;
        }

        playerCount++;        
        game.addPlayer(socket.id, player);
        updatePlayers(game.players);

        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);
            game.removePlayer(socket.id);
            playerCount--;
            updatePlayers(game.players);
        });
        
    });

    function updatePlayers(players) {
        io.emit('update_players', players);
    }
}

module.exports = { registerGameSocketHandler };