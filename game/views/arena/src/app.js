const onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    const socketUrl = 'ws://localhost:3000';
    const socketBuilder = new SocketBuider({ socketUrl });
    const view = new View();
    const utils = new Utils();

    const peerConfig = Object.values({
        id: undefined,
        config: {
            port: 9000,
            host: 'localhost',
            path: '/'
        }
    });
    const peerBuilder = new PeerBuilder({ peerConfig });

    const dependencies = {
        view,
        socketBuilder,
        utils,
        peerBuilder,
        room
    };

    Business.initialize(dependencies);
}

window.onload = onload;