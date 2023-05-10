class Player {
    handler;
    lastMoveCommand;
    isShot;
    shotPosition;
    shotCommandPosition;
    fireX;
    fireY;
    shotInterval;
    onAction;
    playersPosition;
    destroyPlayer;

    constructor({context, positionX, positionY, peerId, playerId, color, command}) {
        this.LEFT = 37;
        this.RIGHT = 39;
        this.UP = 38;
        this.DOWN = 40;
        this.FIRE = 70;
        this.MOVE_LENGTH = 10;
        this.rectWidth = 10;
        this.viewPortWidth = 500;
        this.viewPortHeight = 500;
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this._getAction(command).setHandler();
        this.peerId = peerId;
        this.playerId = playerId;
        this.playerColor = color;
    }

    setOnAction(onAction) {
        this.onAction = onAction;
    }

    setPlayersPosition(playersPosition) {
        this.playersPosition = playersPosition;
    }

    setDestroyPlayer(destroyPlayer) {
        this.destroyPlayer = destroyPlayer;
    }

    onReceiveData({x, y, fireX, fireY, isShot, command}) {
        this.positionX = x;
        this.positionY = y;
        this.fireX = fireX;
        this.fireY = fireY;
        this.isShot = isShot;
        this._getAction(command)?.setHandler();
    }

    move(command) {
        if (command != this.FIRE) this.lastMoveCommand = command;
        this._getAction(command)?.action();
        this.build();
    }

    build() {
        if (!this.handler) return;
        this._setMoveRules();        
        this.handler(this.positionX, this.positionY);

        if (this.isShot) {
            this._buildFire();
            this.colision();
        }

        if (this.onAction) {
            this.onAction({
                type: 0,
                x: this.positionX,
                y: this.positionY,
                fireX: this.fireX,
                fireY: this.fireY,
                playerId: this.playerId,
                isShot: this.isShot,
                command: this.lastMoveCommand
            });
        }
    }

    _setMoveRules() {
        if (this.positionY < 0) this.positionY = 0;
        if (this.positionY > (this.viewPortHeight - 30)) this.positionY = (this.viewPortHeight - 30);
        if (this.positionX > (this.viewPortWidth - 30)) this.positionX = this.viewPortWidth - 30;
        if (this.positionX < 0) this.positionX = 0;
    }

    _getAction(command) {
        if (this._isValidCommand(command))
            return this._getActionMethods()[command];
        return undefined;
    }

    _getFireAction() {
        if (this._isValidCommand(this.shotCommandPosition))
            return this._getActionMethods()[this.shotCommandPosition];
        return undefined;
    }

    _isValidCommand(command) {
        return [this.LEFT, this.DOWN, this.RIGHT, this.UP, this.FIRE].includes(command)
    }

    _getActionMethods() {
        return {
            [this.LEFT]: {
                action: () => {
                    this.positionX -= this.MOVE_LENGTH;
                    this.handler = this._moveLeft;
                },
                setHandler: () => this.handler = this._moveLeft,
                setFirePosition: (x, y) => {
                    this.fireX = x - this.rectWidth * 2;
                    this.fireY = y + this.rectWidth;
                },
                moveFire: () => this.fireX -= 10
            },
            [this.RIGHT]: {
                action: () => {
                    this.positionX += this.MOVE_LENGTH;
                    this.handler = this._moveRight;
                },
                setHandler: () => this.handler = this._moveRight,
                setFirePosition: (x, y) => {
                    this.fireX = x + this.rectWidth * 4;
                    this.fireY = y + this.rectWidth;
                },
                moveFire: () => this.fireX += 10
            },
            [this.UP]: {
                action: () => {
                    this.positionY -= this.MOVE_LENGTH;
                    this.handler = this._moveTop;
                },
                setHandler: () => this.handler = this._moveTop,
                setFirePosition: (x, y) => {
                    this.fireX = x + this.rectWidth;
                    this.fireY = y - this.rectWidth * 2;
                },
                moveFire: () => this.fireY -= 10
            },
            [this.DOWN]: {
                action: () => {
                    this.positionY += this.MOVE_LENGTH;
                    this.handler = this._moveDown;
                },
                setHandler: () => this.handler = this._moveDown,
                setFirePosition: (x, y) => {
                    this.fireX = x + this.rectWidth;
                    this.fireY = y + this.rectWidth * 4;
                },
                moveFire: () => this.fireY += 10
            },
            [this.FIRE]: {
                action: () => this._fire()
            }
        }
    }

    _moveLeft(x, y) {
        const width = this.rectWidth;
        this.context.fillStyle = this.playerColor;
        this.context.fillRect(x, y, width, width * 3);
        this.context.fillRect(x, y, width + width, width * 3);
        this.context.fillRect(x, y, width + width * 2, width * 3);
        this.context.fillRect(x - width, y + width, width, width);
    }

    _moveRight(x, y) {
        const width = this.rectWidth;
        this.context.fillStyle = this.playerColor;
        this.context.fillRect(x, y, width, width * 3);
        this.context.fillRect(x, y, width + width, width * 3);
        this.context.fillRect(x, y, width + width * 2, width * 3);
        this.context.fillRect(x + width * 3, y + width, width, width);
    }

    _moveTop(x, y) {
        const width = this.rectWidth;
        this.context.fillStyle = this.playerColor;
        this.context.fillRect(x, y, width, width * 3);
        this.context.fillRect(x, y, width + width, width * 3);
        this.context.fillRect(x, y, width + width * 2, width * 3);
        this.context.fillRect(x + width, y - width, width, width);
    }

    _moveDown(x, y) {
        const width = this.rectWidth;
        this.context.fillStyle = this.playerColor;
        this.context.fillRect(x, y, width, width * 3);
        this.context.fillRect(x , y, width + width, width * 3);
        this.context.fillRect(x , y, width+ width * 2, width * 3);
        this.context.fillRect(x + width, y + width * 3, width, width);
    }

    _fire() {
        if (this.isShot) return;
        this.shotCommandPosition = this.lastMoveCommand;
        this.isShot = true;

        this._getFireAction()?.setFirePosition(this.positionX, this.positionY);

        this.shotInterval = setInterval(() => {
            this._getFireAction()?.moveFire();
        }, 25);
    }

    _buildFire() {
        this.context.fillStyle = this.playerColor;
        this.context.fillRect(this.fireX, this.fireY, this.rectWidth, this.rectWidth);
    }

    colision() {
        const fireX = this.fireX + 10;
        const fireY = this.fireY + 10;

        this.playersPosition?.forEach(player => {
            const x = player.x;
            const y = player.y;

            if (x < fireX && x + 40 > fireX &&
                y < fireY && y + 40 > fireY) {
                    this.isShot = false;
                    this.onAction({
                        type: 1,
                        playerId: player.playerId
                    });
                    this.destroyPlayer(player.playerId);
                    clearInterval(this.shotInterval);
                }

            if (fireX < 0 || fireX > this.viewPortWidth ||
                fireY < 0 || fireY > this.viewPortHeight) {
                    this.isShot = false;
                    clearInterval(this.shotInterval);
                }
        });
    }
}