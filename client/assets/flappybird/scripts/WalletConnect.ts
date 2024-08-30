import { _decorator, Component, Node, Prefab, instantiate, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WalletConnect')
export class WalletConnect extends Component {
    @property(Node)
    public contentNode: Node | null = null;

    @property(Prefab)
    public buttonPrefab: Prefab | null = null;

    @property(Node)
    public closeButton: Node | null = null;

    private items: string[] = ['选项1', '选项2', '选项3', '选项4', '选项5'];

    start() {
        this.initializeDialog();
    }

    initializeDialog() {
        if (this.contentNode && this.buttonPrefab) {
            for (let item of this.items) {
                let buttonNode = instantiate(this.buttonPrefab);
                this.contentNode.addChild(buttonNode);

                let button = buttonNode.getComponent(Button);
                let label = buttonNode.getComponentInChildren(Label);

                if (label) {
                    label.string = item;
                }

                if (button) {
                    button.node.on(Button.EventType.CLICK, () => {
                        console.log(`点击了 ${item}`);
                    }, this);
                }
            }
        }

        if (this.closeButton) {
            this.closeButton.on(Node.EventType.TOUCH_END, this.closeDialog, this);
        }
    }

    closeDialog() {
        this.node.active = false;
    }
}