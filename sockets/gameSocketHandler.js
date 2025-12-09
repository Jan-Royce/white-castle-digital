const Player = require('./../src/Player');
function registerGameSocketHandler(io, game) {
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);

        const player = new Player(socket.id);
        if(game.getPlayerCount() >= 4){
            socket.emit("lobby_full");
            console.log(`user ${socket.id} disconnected`);
            socket.disconnect();
            return;
        }
           
        game.addPlayer(socket.id, player);
        updatePlayers(game.players);

        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);
            game.removePlayer(socket.id);
            updatePlayers(game.players);
        });
        
        socket.on('start_game', () => {
            // TODO Do NOT allow starting a game if there is only 1 player
            socket.broadcast.emit('start_game');
            
            game.startBoard();
            game.started = true;
            const board = game.board;
            
            io.emit('board_setup', board);
        });
        
        if(game.dev_mode) {
            socket.on('display_test_units', () => {
                console.log('display test units')
                game.board.generateTestUnits();
                io.emit('update_test_units', game.board);
            });
        }
        
        //NOTE: currently not used by anything
        socket.on('update_unit_display', () => {
            io.emit('update_unit_display');
        });
        
        socket.on('place_die', (data) => {
            socket.broadcast.emit('remote_place_die', data);
        });
        
        socket.on('undo_place_die', (data) => {
            data.player = socket.id;
            socket.broadcast.emit('remote_undo_place_die', data);
        });
    });

    function updatePlayers(players) {
        io.emit('update_players', players);
    }
}

module.exports = { registerGameSocketHandler };