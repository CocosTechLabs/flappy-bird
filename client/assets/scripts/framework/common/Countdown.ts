import { _decorator, Camera, CCFloat, CCInteger, Component, find, Label, math, Node, tween, UITransform, v3, Vec3 } from 'cc';
import { LogManager } from './LogManager';
const { ccclass, property } = _decorator;


@ccclass('Countdown')
export class Countdown extends Component {
    @property(Label)
    numLbl: Label;

    private _isRunning: boolean = false;
    private _time: number = 0;
    private _timeInterval: number = 0;
    private _total: number = 3;
    private _timeupCb: Function = null;

    update(deltaTime: number) {
        if (this._isRunning) {
            this._timeInterval += deltaTime;
            if (this._timeInterval > this._total) {
                this._isRunning = false;
                this._timeupCb && this._timeupCb();
            } else if (this._timeInterval > this._time + 1) {
                this._time++;
                this._setTimeNum(this._total - this._time);
            }
        }
    }

    public run(total: number, cb: Function) {
        LogManager.log('Countdown run');
        this._isRunning = true;
        this._time = 0;
        this._timeInterval = 0;
        this._total = total;
        this._timeupCb = cb;
        this._setTimeNum(total);
    }

    private _setTimeNum(time: number) {
        if (this.numLbl) {
            this.numLbl.string = time.toString();
            let lblNode: Node = this.numLbl.node;
            lblNode.scale = v3(0.1, 0.1);
            let duration = 0.1;
            tween(lblNode)
                .to(duration, { scale: new Vec3(1.1, 1.1, 1.1) })
                .to(duration, { scale: new Vec3(1, 1, 1) })
                .start();
        }
    }
}


