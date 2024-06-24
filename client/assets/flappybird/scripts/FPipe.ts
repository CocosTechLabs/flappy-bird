import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FPipe')
export class FPipe extends Component {
    @property(Collider2D)
    dieUpArea: Collider2D;
    @property(Collider2D)
    dieDownArea: Collider2D;
    @property(Collider2D)
    passArea: Collider2D;

    private _onDieCb: Function = null;
    private _onPassCb: Function = null;
    private _bActive: boolean = false;
    public setActive(isActive: boolean) {
        this._bActive = isActive;
    }

    protected start(): void {
        if (this.dieUpArea) {
            this.dieUpArea.on(Contact2DType.BEGIN_CONTACT, this._onDie, this);
        }
        if (this.dieDownArea) {
            this.dieDownArea.on(Contact2DType.BEGIN_CONTACT, this._onDie, this);
        }
        if (this.passArea) {
            this.passArea.on(Contact2DType.END_CONTACT, this._onPass, this);
        }
    }

    public removeColliderListener() {
        if (this.dieUpArea) {
            this.dieUpArea.off(Contact2DType.BEGIN_CONTACT, this._onDie, this);
        }
        if (this.dieDownArea) {
            this.dieDownArea.off(Contact2DType.BEGIN_CONTACT, this._onDie, this);
        }
        if (this.passArea) {
            this.passArea.off(Contact2DType.END_CONTACT, this._onPass, this);
        }
    }

    public init(dieCb: Function, passCb: Function) {
        this._onDieCb = dieCb;
        this._onPassCb = passCb;
        this._bActive = true;
    }

    private _onDie(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this._bActive && this._onDieCb && this._onDieCb();
    }

    private _onPass(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this._bActive && this._onPassCb && this._onPassCb();
    }
}


