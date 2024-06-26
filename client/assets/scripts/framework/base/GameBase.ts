import { _decorator, Component, EPhysics2DDrawFlags, PhysicsSystem2D } from 'cc';
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
}


