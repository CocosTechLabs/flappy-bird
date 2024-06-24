import { _decorator, Component, EPhysics2DDrawFlags, PhysicsSystem2D } from 'cc';
import { gameBridge, GameEvent, GameEventData, WebEvent, WebEventData } from '../../webBridge/game-sdk';
import { Utils } from '../common/Utils';
import { LogManager } from '../common/LogManager';
const { ccclass, property } = _decorator;

@ccclass('GameBase')
export class GameBase extends Component {
    protected _isGameRunning: boolean = false;

    protected _isLoadingProgress: number = 0;
    protected _initPhyEnv() {
        // https://docs.cocos.com/creator/manual/zh/physics-2d/physics-2d-system.html
        PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.gravity = v2();
        // PhysicsSystem2D.instance.gravity = v2(0, -20 * PHYSICS_2D_PTM_RATIO);
        /*
        const system = PhysicsSystem2D.instance;
        // 物理步长，默认 fixedTimeStep 是 1/60
        system.fixedTimeStep = 1 / 30;
        // 每次更新物理系统处理速度的迭代次数，默认为 10
        system.velocityIterations = 8;
        // 每次更新物理系统处理位置的迭代次数，默认为 10
        system.positionIterations = 8;
        */
    }

    protected _setPhy2DDebug(active: boolean) {
        if (active) {
            PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
                EPhysics2DDrawFlags.Pair |
                EPhysics2DDrawFlags.CenterOfMass |
                EPhysics2DDrawFlags.Joint |
                EPhysics2DDrawFlags.Shape;
        } else {
            PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
        }
    }

    protected _isSingleGameMode(): boolean {
        let single = Utils.getLocationUrlParam('single');
        if (single) {
            return true;
        }
        return false;
    }

    // web bridge
    protected onDestroy(): void {
        this._unregisterWebBridge();
    }
    private _gameLoadedCb: (data: GameEventData[GameEvent.GameLoaded]) => void = null;
    private _gameOverCb: (data: GameEventData[GameEvent.GameOver]) => void = null;
    private _gameResetCb: (data: WebEventData[WebEvent.GameReset]) => void = null;
    private _gameDestroyCb: (data: WebEventData[WebEvent.GameDestroy]) => void = null;
    private _requestProgressCb: (data: WebEventData[WebEvent.RequestProgress]) => void = null;
    protected _intWebBridge() {
        this._registerWebBridge();
    }
    private _registerWebBridge() {
        this._gameLoadedCb = (data: GameEventData[GameEvent.GameLoaded]) => {
            this._onGameLoadedCb(data);
        }
        this._gameOverCb = (data: GameEventData[GameEvent.GameOver]) => {
            this._onGameOverCb(data);
        }
        this._gameResetCb = (data: WebEventData[WebEvent.GameReset]) => {
            this._onGameResetCb(data);
        }
        this._gameDestroyCb = (data: WebEventData[WebEvent.GameDestroy]) => {
            this._onGameDestroyCb(data);
        }
        this._requestProgressCb = (data: WebEventData[WebEvent.RequestProgress]) => {
            this._onRequestProgressCb(data);
        }
        gameBridge.on(GameEvent.GameLoaded, this._gameLoadedCb);
        gameBridge.on(GameEvent.GameOver, this._gameOverCb);
        gameBridge.on(WebEvent.GameReset, this._gameResetCb);
        gameBridge.on(WebEvent.GameDestroy, this._gameDestroyCb);
        gameBridge.on(WebEvent.RequestProgress, this._requestProgressCb);
    }
    private _unregisterWebBridge() {
        gameBridge.off(GameEvent.GameLoaded, this._gameLoadedCb);
        gameBridge.off(GameEvent.GameOver, this._gameOverCb);
        gameBridge.off(WebEvent.GameReset, this._gameResetCb);
        gameBridge.off(WebEvent.GameDestroy, this._gameDestroyCb);
        gameBridge.off(WebEvent.RequestProgress, this._requestProgressCb);
    }

    protected _emitGameLoaded() {
        LogManager.log('emit GameLoaded');
        this._isLoadingProgress = 1;
        gameBridge.emit(GameEvent.GameLoaded, { progress: 1 });
    }

    protected _emitGameOver(score: number, record: any) {
        LogManager.log('emit GameOver', score, record);
        gameBridge.emit(GameEvent.GameOver, {
            score,
            data: record
        });
    }

    protected _onGameLoadedCb(data: GameEventData[GameEvent.GameLoaded]) {
        LogManager.log('onGameLoadedCb', data);
    }

    protected _onGameOverCb(data: GameEventData[GameEvent.GameOver]) {
        LogManager.log('onGameOverCb', data);
    }

    protected _onGameResetCb(data: WebEventData[WebEvent.GameReset]) {
        LogManager.log('onGameResetCb', data);
    }

    protected _onGameDestroyCb(data: WebEventData[WebEvent.GameDestroy]) {
        LogManager.log('onGameDestroyCb', data);
    }

    protected _onRequestProgressCb(data: WebEventData[WebEvent.RequestProgress]) {
        LogManager.log('onRequestProgressCb', data);
        gameBridge.emit(GameEvent.GameLoaded, { progress: this._isLoadingProgress });
    }
}


