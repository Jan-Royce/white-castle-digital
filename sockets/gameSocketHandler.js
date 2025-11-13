const Player = require('./../src/Player');
function registerGameSocketHandler(io, game) {
    
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);

        const player = new Player(socket.id);
        //TODO add 4p limit
        game.addPlayer(socket.id, player);

        updatePlayers(game.players);

        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);
            game.removePlayer(socket.id);

            updatePlayers(game.players);
        });
    });

    function updatePlayers(players) {
        io.emit('update_players', players);
    }
}

module.exports = { registerGameSocketHandler };