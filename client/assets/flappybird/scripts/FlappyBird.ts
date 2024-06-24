import { _decorator, Component, EventTouch, Input, Node, Prefab, find, UITransform, EventKeyboard, KeyCode, input, CCInteger, PhysicsSystem2D, Label, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
import { FBird } from './FBird';
import { PoolManager } from '../../scripts/framework/common/PoolManager';
import { ScrollControl } from './ScrollControl';
import { FLevel, FLevelInitParams } from './FLevel';
import { GameBase } from '../../scripts/framework/base/GameBase';
import { FBGlobalData } from './FBGlobalData';
import { GameResult, GameResultInitParams } from './GameResult';
import { FBAction, FBInputType, FBRecordManager } from './FBRecordManager';
import { LogManager } from '../../scripts/framework/common/LogManager';
const { ccclass, property } = _decorator;

@ccclass('FlappyBird')
export class FlappyBird extends GameBase {
    @property(Prefab)
    birdPrefab: Prefab = null;
    @property(Node)
    birdRoot: Node = null;
    @property(Node)
    touchLayer: Node = null;
    @property(Node)
    startLayer: Node = null;
    @property(Node)
    gameOverLayer: Node = null;
    @property(ScrollControl)
    bgScroll: ScrollControl = null;
    @property(ScrollControl)
    groundScroll: ScrollControl = null;
    @property(FLevel)
    levelMng: FLevel = null;
    @property(CCInteger)
    initMoveSpeed: number = 200;
    @property(CCInteger)
    skyY: number = 360;
    @property(CCInteger)
    groundY: number = -180;
    @property(Label)
    scoreLbl: Label = null;
    @property(Collider2D)
    skyCollider: Collider2D = null;
    @property(Collider2D)
    groundCollider: Collider2D = null;
    @property(GameResult)
    gameResult: GameResult;

    private _bird: FBird = null;
    private _touchStarted: boolean = false;
    private _score: number = 0;

    protected onLoad() {
        LogManager.log(`Game:FlappyBird version:${FBGlobalData.VERSION}`);

        this._rigesterEvent();
        this._initPhyEnv();
        // this._setPhy2DDebug(true);
    }

    start() {
        this._loadLevel();
        this.startLayer && (this.startLayer.active = true);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        if (this.skyCollider) {
            this.skyCollider.on(Contact2DType.BEGIN_CONTACT, this._outofSky, this);
        }
        if (this.groundCollider) {
            this.groundCollider.on(Contact2DType.BEGIN_CONTACT, this._onGround, this);
        }
        if (this.gameResult) {
            this.gameResult.hide()
        }
        if (this.scoreLbl) {
            this.scoreLbl.node.active = false;
        }
        this._emitGameLoaded();
    }

    update(deltaTime: number) {
        if (this._isGameRunning) {
            this._updateBird();
            this._updateLevel();
            this._updateScore();
        }
    }

    protected onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this._onKeyUp, this);
    }
    protected onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _rigesterEvent() {
        if (this.touchLayer) {
            this.touchLayer.on(Input.EventType.TOUCH_START, this._onTouchStart, this);
            this.touchLayer.on(Input.EventType.TOUCH_END, this._onTouchEnd, this);
        }
        if (this.startLayer) {
            this.startLayer.on(Input.EventType.TOUCH_END, this.startGame, this);
        }
        if (this.gameOverLayer) {
            this.gameOverLayer.on(Input.EventType.TOUCH_END, this.resetGame, this);
        }
    }

    private _loadLevel() {
        this._bird = this._createBird();
        this._bird.init(this.skyY, this.groundY);
        let canvas: Node = find('Canvas');
        let b = canvas.getComponent(UITransform);
        this.bgScroll.init(b.width, this.initMoveSpeed);
        this.groundScroll.init(b.width, this.initMoveSpeed);
        this.startLayer && (this.startLayer.active = true);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        let data: FLevelInitParams = {
            screenWidth: b.width,
            initMoveSpeed: this.initMoveSpeed,
            addScoreCb: () => this._addScore(),
            dieCb: () => this._onDead(),
            addCoinCb: undefined
        }
        this.levelMng.init(data);
    }

    private _createBird(): FBird {
        let bird: FBird = null;
        if (this.birdPrefab) {
            let birdNode: Node = PoolManager.Instance().getNode(this.birdPrefab, this.birdRoot);
            if (birdNode) {
                bird = birdNode.getComponent(FBird);
            }
        }
        return bird;
    }

    private _onTouchStart(event: EventTouch) {
        this._touchStarted = true;
        FBRecordManager.Instance().addRecord(FBAction.TOUCH_DOWN, FBInputType.TOUCH_OR_MOUSE);
    }

    private _onTouchEnd(event: EventTouch) {
        this._touchStarted = false;
        FBRecordManager.Instance().addRecord(FBAction.TOUCH_UP, FBInputType.TOUCH_OR_MOUSE);
    }

    private _onKeyDown(event: EventKeyboard) {
        LogManager.log('onKeyDown', event.keyCode);
        switch (event.keyCode) {
            case KeyCode.SPACE:
                this._touchStarted = true;
                FBRecordManager.Instance().addRecord(FBAction.TOUCH_DOWN, FBInputType.KEYBOARD);
                break;
        }
    }

    private _onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.SPACE:
                this._touchStarted = false;
                FBRecordManager.Instance().addRecord(FBAction.TOUCH_UP, FBInputType.KEYBOARD);
                break;
        }
    }

    private _updateBird() {
        if (this._touchStarted) {
            this._bird.fly();
        } else {
            this._bird.fall();
        }
    }

    private _updateLevel() {
        this.levelMng.onUpdate();
    }

    startGame() {
        this.startLayer && (this.startLayer.active = false);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        this._isGameRunning = true;
        this._score = 0;
        this.bgScroll.setRun(true);
        this.groundScroll.setRun(true);
        this._bird.startFly();
        this.levelMng.run();
        if (this.scoreLbl) {
            this.scoreLbl.node.active = true;
            this.scoreLbl.string = '0';
        }
        FBRecordManager.Instance().recordStart();
    }

    gameOver() {
        FBRecordManager.Instance().recordEnd();
        this.startLayer && (this.startLayer.active = false);
        // this.gameOverLayer && (this.gameOverLayer.active = true);
        this._isGameRunning = false;
        this.bgScroll.setRun(false);
        this.groundScroll.setRun(false);
        this._bird.die();
        this.levelMng.stop();
        if (this.gameResult) {
            let data: GameResultInitParams = {
                score: this._score,
                coin: 0,
                restartCb: () => this.resetGame(),
                isShowButtons: this._isSingleGameMode()
            }
            this.gameResult.init(data);
            this.gameResult.show()
        }
        this._emitGameOver(this._score, FBRecordManager.Instance().getData());
    }

    protected _onGameResetCb(data: Record<string, never>): void {
        this.resetGame();
    }

    resetGame() {
        this.startLayer && (this.startLayer.active = true);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        // this._isGameRunning = true;
        this._score = 0;
        // this.bgScroll.setRun(true);
        // this.groundScroll.setRun(true);
        this._bird.reset();
        this.levelMng.reset();
        if (this.gameResult) {
            this.gameResult.hide()
        }
        if (this.scoreLbl) {
            this.scoreLbl.node.active = false;
            this.scoreLbl.string = '0';
        }
        FBRecordManager.Instance().reset();
    }

    private _onDead() {
        this.gameOver();
    }

    private _addScore() {
        if (this._isGameRunning) {
            this._score++;
        }
    }

    private _updateScore() {
        if (this.scoreLbl) {
            this.scoreLbl.string = this._score.toString();
        }
    }

    private _onGround(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._isGameRunning) {
            this._onDead();
        }
    }

    private _outofSky(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._isGameRunning) {
            this._onDead();
        }
    }
}


