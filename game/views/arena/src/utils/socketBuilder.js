class SocketBuider {
    constructor({ socketUrl }) {
        this.socketUrl = socketUrl;
        this.onPlayerConnect = () => { };
        this.onPlayerDisconnect = () => { };
    }

    setOnPlayerConnect(fn) {
        this.onPlayerConnect = fn;
        return this;
    }

    setOnPlayerDisconnect(fn) {
        this.onPlayerDisconnect = fn;
        return this;
    }

    build() {
        const socket = io(this.socketUrl, {
            withCredentials: false
        });

        socket.on('player-connect', (player) => this.onPlayerConnect(player));
        socket.on('player-disconnect', (playerId) => this.onPlayerDisconnect(playerId));

        return socket;
    }
}