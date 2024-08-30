import { _decorator, Component, Node, UIOpacity, tween, Vec2, UITransform, v3, View, ScrollView } from 'cc';
import globalEvent from '../../scripts/framework/event/GlobalEvent';
import { GameEvents } from './Events';
const { ccclass, property } = _decorator;

@ccclass('WalletView')
export class WalletView extends Component {

    @property(Node)
    background: Node = null;

    @property(Node)
    panel: Node = null;

    private backgroundOpacity: UIOpacity = null;
    private panelUITransform: UITransform = null;

    protected onLoad(): void {
        this.backgroundOpacity = this.background.getComponent(UIOpacity);
        this.backgroundOpacity.opacity = 0;
        this.panelUITransform = this.panel.getComponent(UITransform);
        let size = View.instance.getVisibleSize();
        this.panelUITransform.setContentSize(size.width, size.height * 0.4);
        this.panel.position = v3(0, - this.panelUITransform.height - size.height * 0.5, this.panel.position.z);
        this.background.active = false;
        this.panel.getChildByName('ScrollView').getComponent(ScrollView).scrollToTop();

        globalEvent.on(GameEvents.WALLET_SHOW, this.show, this);
        globalEvent.on(GameEvents.WALLET_HIDE, this.hide, this);
    }

    protected onDestroy(): void {
        globalEvent.off(GameEvents.WALLET_SHOW, this.show);
        globalEvent.off(GameEvents.WALLET_HIDE, this.hide);
    }


    public show() {
        this.panel.getChildByName('ScrollView').getComponent(ScrollView).scrollToTop();
        let size = View.instance.getVisibleSize();
        tween(this.backgroundOpacity)
            .call(() => {
                this.background.active = true;
            })
            .to(0.2, {opacity: 140})
            .start();
        tween(this.panel)
            .to(0.4, {position: v3(0, - size.height * 0.5 - 30, this.panel.position.z)})
            .start();
    }

    public hide() {
        let size = View.instance.getVisibleSize();
        tween(this.backgroundOpacity)
            .to(0.2, {opacity: 0})
            .call(() => {
                this.background.active = false;
            })
            .start();
        tween(this.panel)
            .to(0.4, {position: v3(0, - this.panelUITransform.height - size.height, this.panel.position.z)})
            .start();
    }

    public tonConnect() {
        console.log("ton Connect...");
    }
    public evmConnect() {
        console.log("evm Connect...");
    }
}


