import { _decorator, CCInteger, Collider2D, Component, Node, Prefab, v3 } from 'cc';
import { PoolManager } from '../../scripts/framework/common/PoolManager';
import { FPipe } from './FPipe';
import { FBCoin, FBCoinInitParams } from './FBCoin';
import { LogManager } from '../../scripts/framework/common/LogManager';
const { ccclass, property } = _decorator;

export interface FLevelInitParams {
    screenWidth: number;
    initMoveSpeed: number;
    dieCb: Function;
    addScoreCb: Function;
    addCoinCb: Function;
}

@ccclass('FLevel')
export class FLevel extends Component {
    @property(Prefab)
    pipePrefab: Prefab = null;
    @property(Prefab)
    coinPrefab: Prefab = null;
    @property(CCInteger)
    pipeSpace: number = 400;
    @property(CCInteger)
    coinSpace: number = 100;
    @property(Node)
    step1: Node;
    @property(Node)
    step2: Node;
    @property(CCInteger)
    yMin: number = -100;
    @property(CCInteger)
    yMax: number = 200;

    private _isRunning: boolean = false;
    private _dieCb: Function = null;
    private _addScoreCb: Function = null;
    private _screenW: number = 0;
    private _screenLeft: number = 0;
    private _screenRight: number = 0;
    private _initMoveSpeed: number = 0;
    private _curMoveSpeed: number = 0;
    private _subCount: number = 0;
    private _subLen: number = 0;
    private _pipes1: Node[] = [];
    private _pipes2: Node[] = [];

    private _coins1: Node[] = [];
    private _coins2: Node[] = [];
    private _addCoinCb: Function = null;

    public init(data: FLevelInitParams) {
        this._screenW = data.screenWidth;
        this._screenRight = Math.floor(data.screenWidth * 0.5);
        this._screenLeft = -this._screenRight;
        this._initMoveSpeed = data.initMoveSpeed;
        this._curMoveSpeed = data.initMoveSpeed;
        this._subCount = Math.ceil(data.screenWidth / this.pipeSpace);
        this._subLen = this._subCount * this.pipeSpace;
        this._dieCb = data.dieCb;
        this._addScoreCb = data.addScoreCb;
        this._addCoinCb = data.addCoinCb;
    }

    public run() {
        this._isRunning = true;
        let x = this._screenRight;
        let pos1 = this.step1.position;
        this.step1.setPosition(x, pos1.y);
        this._pipes1 = this._createStepPipes(this.step1, this._subCount);
        this._coins1 = this._createStepCoins(this.step1, this._subCount * 3);
        x += this._subLen;
        let pos2 = this.step2.position;
        this.step2.setPosition(x, pos2.y);
        this._pipes2 = this._createStepPipes(this.step2, this._subCount);
        this._coins2 = this._createStepCoins(this.step2, this._subCount * 3);
    }
    public stop() {
        this._isRunning = false;

        for (let i = 0; i < this._pipes1.length; ++i) {
            let pipe = this._pipes1[i].getComponent(FPipe);
            pipe.setActive(false);
        }
        for (let i = 0; i < this._pipes2.length; ++i) {
            let pipe = this._pipes2[i].getComponent(FPipe);
            pipe.setActive(false);
        }
    }
    public reset() {
        for (let i = 0; i < this._pipes1.length; ++i) {
            PoolManager.Instance().putNode(this._pipes1[i]);
        }
        for (let i = 0; i < this._pipes2.length; ++i) {
            PoolManager.Instance().putNode(this._pipes2[i]);
        }
        for (let i = 0; i < this._coins1.length; ++i) {
            PoolManager.Instance().putNode(this._coins1[i]);
        }
        for (let i = 0; i < this._coins2.length; ++i) {
            PoolManager.Instance().putNode(this._coins2[i]);
        }
        // this.run();
    }

    public setSpeed(v: number) {
        this._curMoveSpeed = v;
    }

    public onUpdate() {
    }

    protected update(dt: number): void {
        if (this._isRunning) {
            let pos1 = v3(this.step1.position);
            pos1.x -= this._initMoveSpeed * dt;
            this.step1.setPosition(pos1);
            let pos2 = v3(this.step2.position);
            pos2.x -= this._initMoveSpeed * dt;
            this.step2.setPosition(pos2);
            if (pos2.x < this._screenLeft) {
                for (let i = 0; i < this._pipes1.length; ++i) {
                    PoolManager.Instance().putNode(this._pipes1[i]);
                }
                this._pipes1 = this._pipes2;
                let step = this.step1;
                this.step1 = this.step2;
                this.step2 = step;
                let x = this.step1.position.x + this._subLen;
                LogManager.log('switch step', `step1:${this.step1.name},step2:${this.step2.name}`, this.step1.position.x, x);
                this.step2.setPosition(x, pos1.y);
                this._pipes2 = this._createStepPipes(this.step2, this._subCount);
                // coins
                for (let i = 0; i < this._coins1.length; ++i) {
                    PoolManager.Instance().putNode(this._coins1[i]);
                }
                this._coins1 = this._coins2;
                this._coins2 = this._createStepCoins(this.step2, this._subCount * 3);
            }
        }
    }

    private _createStepPipes(rootNode: Node, count: number): Node[] {
        let pipes: Node[] = [];
        let x = 0;
        let h = this.yMax - this.yMin;
        for (let i = 0; i < count; ++i) {
            let pipe: Node = PoolManager.Instance().getNode(this.pipePrefab, rootNode);
            let y = this.yMin + Math.random() * h;
            pipe.setPosition(x, y);
            pipes.push(pipe);
            x += this.pipeSpace;

            let script: FPipe = pipe.getComponent(FPipe);
            if (script) {
                script.init(() => (this._dieCb && this._dieCb()), () => (this._addScoreCb && this._addScoreCb()));
            }
        }
        return pipes;
    }

    private _createStepCoins(rootNode: Node, count: number): Node[] {
        let coins: Node[] = [];
        let x = this.coinSpace;
        let h = this.yMax - this.yMin;
        for (let i = 0; i < count; ++i) {
            let coin: Node = PoolManager.Instance().getNode(this.coinPrefab, rootNode);
            let y = this.yMin + Math.random() * h;
            coin.setPosition(x, y);
            coin.active = true;
            coins.push(coin);
            x += this.coinSpace;
            if (x % this.pipeSpace == 0) {
                x += this.coinSpace;
            }

            let script: FBCoin = coin.getComponent(FBCoin);
            if (script) {
                let data: FBCoinInitParams = {
                    onPickCb: (selfCollider: Collider2D, otherCollider: Collider2D, self: FBCoin): void => {
                        LogManager.log('onPickCb', selfCollider, otherCollider);
                        self.setVisible(false);
                        self.isAlive = false;
                        this._addCoinCb();
                    }
                }
                script.init(data);
            }
        }
        return coins;
    }
}


