import { _decorator, Camera, CCBoolean, CCFloat, Component, math, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('FollowTarget')
export class FollowTarget extends Component {
    @property(Node)
    followNode: Node;
    @property(Node)
    targetNode: Node;
    @property(CCBoolean)
    enableX: boolean = true;
    @property(CCBoolean)
    enableY: boolean = false;
    @property(CCBoolean)
    enableZ: boolean = false;
    @property(CCFloat)
    lerpT: number = 0.6;

    private _isActive: boolean = false;
    private _checkDisMin: number = 2;

    start() {

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
        if (this.targetNode && this.followNode) {
            let targetPos = this.targetNode.getPosition();
            let followPos = this.followNode.getPosition();
            // let dis = Vec3.distance(targetPos, followPos);
            let newPos = v3(followPos);
            if (this.enableX) {
                if (Math.abs(followPos.x - targetPos.x) > this._checkDisMin) {
                    newPos.x = math.lerp(followPos.x, targetPos.x, this.lerpT);
                }
            }
            if (this.enableY) {
                if (Math.abs(followPos.y - targetPos.y) > this._checkDisMin) {
                    newPos.y = math.lerp(followPos.y, targetPos.y, this.lerpT);
                }
            }
            if (this.enableZ) {
                if (Math.abs(followPos.z - targetPos.z) > this._checkDisMin) {
                    newPos.z = math.lerp(followPos.z, targetPos.z, this.lerpT);
                }
            }
            this.followNode.setPosition(newPos);
        }
    }
}


