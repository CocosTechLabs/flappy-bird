import { _decorator, Camera, CCFloat, Component, find, math, Node, UITransform, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('CameraFollowTarget2D')
export class CameraFollowTarget2D extends Component {
    @property(Node)
    cameraNode: Node;
    @property(Node)
    targetNode: Node;
    @property(CCFloat)
    lerpT: number = 0.6;
    @property(CCFloat)
    rightBorder: number = 0.6;
    @property(CCFloat)
    moveSpeed: number = 100;

    private _screenW: number = 0;
    private _offX: number = 0;
    private _isActive: boolean = false;
    private _checkDisMin: number = 1;

    start() {
        let canvas: Node = find('Canvas');
        let b = canvas.getComponent(UITransform);
        this._screenW = b.width;
        this._offX = this._screenW * this.rightBorder;
    }

    update(deltaTime: number) {
        if (this._isActive) {
            this._following(deltaTime);
        }
    }

    public setTarget(target: Node) {
        this.targetNode = target;
    }

    public run() {
        this._isActive = true;
    }
    public stop() {
        this._isActive = false;
    }

    private _following(dt: number) {
        if (this.targetNode && this.cameraNode) {
            let targetPos = this.targetNode.getPosition();
            let followPos = this.cameraNode.getPosition();
            let x = targetPos.x - this._offX;
            // let dis = Vec3.distance(targetPos, followPos);
            let newPos = v3(followPos);
            if ((x - followPos.x) > this._checkDisMin) {
                newPos.x = math.lerp(followPos.x, x, this.lerpT);
            }
            this.cameraNode.setPosition(newPos);
        }
    }
}


