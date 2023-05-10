import http from 'http';
import { Server } from 'socket.io';

const rooms = new Map();
const idxs = [1,2,3,4];

const server = http.createServer((req, resp) => {
    resp.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    });
    resp.end('Running');
})

const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: false
    }
});

const getIndex = (roomId) => {
    const indexs = rooms.get(roomId)?.map(x => x.index);
    if (indexs)
        return idxs.find(x => !indexs.includes(x));

    return 1;
}

const setPlayer = (roomId, playerId, peerId, index) => {
    const newPlayer = {
        playerId,
        peerId,
        index: getIndex(roomId)
    };

    if (rooms.has(roomId)) {
        const currRoom = rooms.get(roomId);
        currRoom.push(newPlayer);
        rooms.set(roomId, currRoom);
    }
    else {
        rooms.set(roomId, [newPlayer]);
    }
}

const removePlayer = (roomId, playerId) => {
    const currRoom = rooms
        .get(roomId)
        .filter(player => player.playerId !== playerId);

    rooms.set(roomId, currRoom);
}

io.on('connection', socket => {

    socket.on('join', (roomId, peerId, playerId) => {
        socket.join(roomId);

        setPlayer(roomId, playerId, peerId, io.sockets.adapter.rooms.get(roomId).size);

        io.sockets.in(roomId).emit('player-connect', JSON.stringify(rooms.get(roomId)));
        
        socket.on('disconnect', () => {
            removePlayer(roomId, playerId);
            io.sockets.in(roomId).emit('player-disconnect', playerId);
        });
    });
});

const startServer = () => {
    console.info(`Server in running on port 3000`);
}

server.listen(3000, startServer);