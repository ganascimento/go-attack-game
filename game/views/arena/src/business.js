class Business {
    context;
    players = new Map();
    socket;
    playerId = crypto.randomUUID();

    constructor({ view, socketBuilder, utils, peerBuilder, room }) {
        this.view = view;
        this.socketBuilder = socketBuilder;
        this.utils = utils;
        this.peerBuilder = peerBuilder;
        this.room = room;
        this.stop = false;
    }

    static initialize(dependencies) {
        const instance = new Business(dependencies);
        instance._init();
    }

    async _init() {
        this.context = this.view.configureCanvas();
        this.socket = this.socketBuilder
            .setOnPlayerConnect(this.onPlayerConnect.bind(this))
            .setOnPlayerDisconnect(this.onPlayerDisconnect.bind(this))
            .build();

        await this.peerBuilder
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .setOnReceiveMessage(this.onPeerReceiveMessage.bind(this))
            .build()
    }

    _createPlayer(players) {
        players.forEach(({playerId, peerId, index}) => {
            const config = this.utils.getInitialConfig(index);
            this.players.set(playerId, new Player({
                context: this.context,
                positionX: config.x,
                positionY: config.y,
                peerId: peerId,
                playerId: playerId,
                color: config.color
            }));

            const isLocalUser = this.playerId === playerId;

            if (isLocalUser) {
                const player = this.players.get(playerId);
                this.view.configureCommands(player.move.bind(player));
            }
        });

        this._setView();
    }

    _removePlayer(playerId) {
        this.players.delete(playerId);
        this._setView();
    }

    _setView() {
        const data = Array.from(this.players.values());
        this.view.setPlayers(data);
    }

    _connect() {
        const peersId = Array.from(this.players.values()).map(player => player.peerId);
        this.peerBuilder.connect(peersId, this._configurePlayers.bind(this));
    }

    _configurePlayers() {
        const player = this.players.get(this.playerId);
        player.setOnAction(this.peerBuilder.sendMessage.bind(this.peerBuilder));
        player.setDestroyPlayer(this._removePlayer.bind(this));
    }

    onPlayerConnect(players) {
        this._createPlayer(JSON.parse(players));
        this._connect();
        this.setColisionValues();
    }

    onPlayerDisconnect(playerId) {
        this._removePlayer(playerId);
    }

    onPeerConnectionOpened() {
        return (peerId) => {
            this.socket.emit('join', this.room, peerId, this.playerId);
        }
    }

    onPeerReceiveMessage(data) {
        if (this.stop) return;
        const message = JSON.parse(data);

        if (message.type === 0) {
            const player = this.players.get(message.playerId);
            if (player) {
                player.onReceiveData({...message});
                this.players.set(player.playerId, player);
                this.setColisionValues();
            }
        }
        else if (message.type === 1) {
            this._removePlayer(message.playerId);
            this.stop = message.playerId === this.playerId;
        }
        
        this._setView();
    }

    setColisionValues() {
        const player = this.players.get(this.playerId);
        if (!player) return;

        const positions = Array.from(this.players.values())
            .filter(item => item.playerId !== this.playerId)
            .map(item => ({
                playerId: item.playerId,
                x: item.positionX,
                y: item.positionY
            }));

        player.setPlayersPosition(positions);
        this.players.set(this.playerId, player);
    }
}