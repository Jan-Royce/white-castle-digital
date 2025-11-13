const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { registerGameSocketHandler } = require("./sockets/gameSocketHandler.js");

const app = express();
const server = createServer(app);
const io = new Server(server);

const Game = require('./src/Game');
const game = new Game();

registerGameSocketHandler(io, game);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './index.html'));
});

server.listen(3000, () => {
    console.log('server running at localhost:3000');
});