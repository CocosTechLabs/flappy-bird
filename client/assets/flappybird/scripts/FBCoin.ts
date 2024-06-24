import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { LogManager } from '../../scripts/framework/common/LogManager';
const { ccclass, property } = _decorator;

export interface FBCoinInitParams {
    onPickCb: (selfCollider: Collider2D, otherCollider: Collider2D, self: FBCoin) => void;
}

@ccclass('FBCoin')
export class FBCoin extends Component {
    @property(Collider2D)
    collider: Collider2D;
    @property(Node)
    coinImg: Node;

    private _onPickCb: (selfCollider: Collider2D, otherCollider: Collider2D, self: FBCoin) => void = null;
    private _bAlive: boolean = true;
    public set isAlive(v: boolean) {
        this._bAlive = v;
    }

    public init(data: FBCoinInitParams) {
        this._onPickCb = data.onPickCb;
        this.setVisible(true);
        this._bAlive = true;
    }

    protected onLoad(): void {
        if (!this.collider) {
            this.collider = this.node.getComponent(Collider2D);
        }
    }

    protected onEnable(): void {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this._onPick, this);
    }

    protected onDisable(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this._onPick, this);
    }

    private _onPick(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // LogManager.log('onPick', selfCollider, otherCollider, contact);
        if (this._bAlive) {
            this._onPickCb && this._onPickCb(selfCollider, otherCollider, this);
        }
    }

    public setVisible(isVisible: boolean) {
        this.coinImg && (this.coinImg.active = isVisible);
    }
}


