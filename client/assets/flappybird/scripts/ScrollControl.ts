import { _decorator, CCInteger, Component, Node, Sprite, UITransform, v3, Vec3 } from 'cc';
import { LogManager } from '../../scripts/framework/common/LogManager';
const { ccclass, property } = _decorator;

@ccclass('ScrollControl')
export class ScrollControl extends Component {
    @property(CCInteger)
    moveSpeed: number = 200;
    @property(CCInteger)
    loopWidth: number = 432;
    @property(CCInteger)
    extWidth: number = 64;
    @property(Sprite)
    bgSpr: Sprite = null;

    private _isRunning: boolean = false;
    private _startPos: Vec3 = v3();

    public init(screenWidth: number, initMoveSpeed: number) {
        this._isRunning = false;
        let uiTransform = this.bgSpr.getComponent(UITransform);
        uiTransform.width = screenWidth + this.loopWidth + this.extWidth;
        LogManager.log('init width', screenWidth, this.loopWidth, this.extWidth, uiTransform.width);
        this._startPos = v3(this.bgSpr.node.position);
        this._startPos.x = -Math.ceil(screenWidth * 0.5);
        this.moveSpeed = initMoveSpeed;
    }

    public setRun(isRunning: boolean) {
        this._isRunning = isRunning;
    }

    public setMoveSpeed(v: number) {
        this.moveSpeed = v;
    }

    update(deltaTime: number) {
        if (this._isRunning) {
            let pos = this.bgSpr.node.position;
            let newPos = v3(pos.x - this.moveSpeed * deltaTime, pos.y);
            if (this._startPos.x - newPos.x > this.loopWidth) {
                newPos.x += this.loopWidth;
            }
            this.bgSpr.node.setPosition(newPos);
        }
    }
}


