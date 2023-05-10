class PeerBuilder {
    constructor({ peerConfig }) {
        this.peerConfig = peerConfig;
        this.peer = {};
        this.connections = [];

        const defaultFunctionValue = () => { };
        this.onConnectionOpened = defaultFunctionValue;
        this.onReceiveMessage = defaultFunctionValue;
    }

    setOnConnectionOpened(fn) {
        this.onConnectionOpened = fn;
        return this;
    }

    setOnReceiveMessage(fn) {
        this.onReceiveMessage = fn;
        return this;
    }

    build() {
        const peer = new Peer(...this.peerConfig)

        return new Promise(resolve => peer.on('open', id => {
            this.onConnectionOpened(id);

            peer.on('connection', (connection) => {
                connection.on('data', (data) => {
                    this.onReceiveMessage(data);
                })
            });

            this.peer = peer;
            return resolve(peer);
        }));
    }

    connect(peersId, fn) {
        this.connections = [];

        peersId.forEach(peerId => {
            const conn = this.peer.connect(peerId);
            this._handleConnection(conn, fn)
        });
    }

    sendMessage(message) {
        this.connections.forEach(conn => {
            conn.send(JSON.stringify(message));
        });
    }

    _handleConnection(conn, fn) {
        conn.on('open', () => {
            fn();
            this.connections.push(conn);
        });
    }
}
