import { _decorator, Animation, AnimationClip, CCInteger, Component, Node, Sprite, SpriteFrame, v3 } from 'cc';
import { LogManager } from '../../scripts/framework/common/LogManager';
const { ccclass, property } = _decorator;

enum FLY_MODE {
    MOVE,
    ACC_ADD,
    SIMULATE,
}

@ccclass('FBird')
export class FBird extends Component {
    @property([SpriteFrame])
    birdFrames: SpriteFrame[] = [];
    @property(Animation)
    birdAnim: Animation;
    @property(CCInteger)
    upAcc: number = 800;
    @property(CCInteger)
    downAcc: number = 10;
    @property(CCInteger)
    upSpeedMax: number = 300;
    @property(CCInteger)
    downSpeedMax: number = 300;

    private _curVSpeed: number = 0;
    private _isAlive: boolean = false;
    private _isFlying: boolean = false;
    private _skyY: number = 0;
    private _groundY: number = 0;
    private _flyMode: FLY_MODE = FLY_MODE.MOVE;

    protected onLoad(): void {
    }

    public init(skyY: number, groundY: number) {
        this._skyY = skyY;
        this._groundY = groundY;
        switch (this._flyMode) {
            case FLY_MODE.MOVE:
                this._curVSpeed = -this.downSpeedMax * 0.8;
                break;
            case FLY_MODE.ACC_ADD:
                this._curVSpeed = 0;
                break;
            case FLY_MODE.SIMULATE:
                this._curVSpeed = 0;
                break;
        }
    }

    start() {
        this._createFrameClip();// 不能放在onLoad里，否则无法播放
    }

    update(deltaTime: number) {
        if (this._isAlive) {
            switch (this._flyMode) {
                case FLY_MODE.MOVE:
                    this._updateNormal(deltaTime);
                    break;
                case FLY_MODE.ACC_ADD:
                    this._updateAccAdd(deltaTime);
                    break;
                case FLY_MODE.SIMULATE:
                    this._updateBySimulate(deltaTime);
                    break;
            }
        }
    }

    private _updateBySimulate(deltaTime: number) {
        let preSpeed = this._curVSpeed;
        if (this._isFlying) {
            this._curVSpeed += this.upAcc * deltaTime;
        } else {
            this._curVSpeed -= this.downAcc * deltaTime;
        }
        if (this._curVSpeed > this.upSpeedMax) {
            this._curVSpeed = this.upSpeedMax;
        }
        if (this._curVSpeed < -this.downSpeedMax) {
            this._curVSpeed = -this.downSpeedMax;
        }
        let deltaY = preSpeed * deltaTime + this._curVSpeed * deltaTime * 0.5;
        let pos = v3(this.node.position);
        pos.y += deltaY;
        if (pos.y < this._groundY) {
            pos.y = this._groundY;
        }
        if (pos.y > this._skyY) {
            pos.y = this._skyY;
        }
        this.node.setPosition(pos);
    }

    private _updateNormal(deltaTime: number) {
        let pos = v3(this.node.position);
        pos.y += this._curVSpeed * deltaTime;
        if (pos.y < this._groundY) {
            pos.y = this._groundY;
        }
        if (pos.y > this._skyY) {
            pos.y = this._skyY;
        }
        this.node.setPosition(pos);
    }

    private _updateAccAdd(deltaTime: number) {
        let deltaV = -this.downAcc * deltaTime;
        let deltaY = this._curVSpeed * deltaTime + deltaV * deltaTime * 0.5;
        this._curVSpeed += deltaV;
        let pos = v3(this.node.position);
        pos.y += deltaY;
        if (pos.y < this._groundY) {
            pos.y = this._groundY;
        }
        if (pos.y > this._skyY) {
            pos.y = this._skyY;
        }
        this.node.setPosition(pos);
    }

    private _createFrameClip() {
        let clip = AnimationClip.createWithSpriteFrames(this.birdFrames, this.birdFrames.length);
        clip.name = 'fly';
        // clip.speed = 24;
        clip.wrapMode = AnimationClip.WrapMode.Loop;
        this.birdAnim.addClip(clip);
        // this.birdAnim.defaultClip = clip;
        this.birdAnim.play('fly');
        LogManager.log('create frame clip', this.birdFrames.length);
    }

    public startFly() {
        this._isAlive = true;
    }

    public fly() {
        this._isFlying = true;

        switch (this._flyMode) {
            case FLY_MODE.MOVE:
                {
                    let pos = v3(this.node.position);
                    pos.y += this.upSpeedMax * 0.03;
                    if (pos.y < this._groundY) {
                        pos.y = this._groundY;
                    }
                    if (pos.y > this._skyY) {
                        pos.y = this._skyY;
                    }
                    this.node.setPosition(pos);
                }
                break;
            case FLY_MODE.ACC_ADD:
                {
                    this._curVSpeed = this.upSpeedMax * 0.5;
                }
                break;
            case FLY_MODE.SIMULATE:
                break;
        }
    }

    public fall() {
        this._isFlying = false;
    }

    public die() {
        this._isAlive = false;
    }

    public reset() {
        this.node.setPosition(v3());
        // this._isAlive = true;
        switch (this._flyMode) {
            case FLY_MODE.MOVE:
                this._curVSpeed = -this.downSpeedMax * 0.8;
                break;
            case FLY_MODE.ACC_ADD:
                this._curVSpeed = 0;
                break;
            case FLY_MODE.SIMULATE:
                this._curVSpeed = 0;
                break;
        }
    }
}


