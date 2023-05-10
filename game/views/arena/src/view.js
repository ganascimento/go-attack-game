class View {
    viewPortWidth = 500;
    viewPortHeight = 500;
    context;
    players;

    configureCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this.viewPortWidth;
        canvas.height = this.viewPortHeight;
        this.context = canvas.getContext('2d');

        const content = document.getElementById('game');
        content.appendChild(canvas);
        this.animate();
        
        return this.context;
    }

    configureCommands(command) {
        const content = document.getElementsByTagName('html');
        content[0].addEventListener('keydown', (event) => this._onKeyDown(event.keyCode, command));
    }

    setPlayers(players) {
        this.players = players;
    }

    _onKeyDown(keyCode, command) {
        command(keyCode);
    }

    animate() {
        this.context.clearRect(0, 0, this.viewPortWidth, this.viewPortHeight);
        this._buildPlayer();
        requestAnimationFrame(this.animate.bind(this));
    }

    _buildPlayer() {
        if (!this.players || this.players.length === 0) return;

        this.players.forEach(player => {
            player.build();
        });
    }
}