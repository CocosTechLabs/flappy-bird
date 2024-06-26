import { _decorator, Component, Label, Node, Vec3 } from 'cc';
import { Utils } from '../../scripts/framework/common/Utils';
import { TelegramWebApp } from './TelegramWebApp';
const { ccclass, property } = _decorator;

export interface GameResultInitParams {
    score: number;
    coin: number;
    restartCb: Function;
    homeCb?: Function;
    isShowButtons: boolean;
}

@ccclass('GameResult')
export class GameResult extends Component {
    @property(Node)
    center: Node;
    @property(Label)
    scoreLbl: Label;
    @property(Label)
    coinLbl: Label;
    @property(Node)
    buttons: Node;

    private _restartCb: Function;
    private _homeCb: Function;

    public init(data: GameResultInitParams) {
        if (this.scoreLbl) {
            this.scoreLbl.string = Math.floor(+data.score).toString();
        }
        if (this.coinLbl) {
            this.coinLbl.string = Math.floor(+data.coin).toString();
        }
        this._restartCb = data.restartCb;
        this._homeCb = data.homeCb;
        if (this.buttons) {
            this.buttons.active = data.isShowButtons;
        }
    }

    public show() {
        this.node.active = true;
        this.center.active = true;
    }

    public hide() {
        this.node.active = false;
    }

    public onRestart() {
        this._restartCb && this._restartCb();
    }

    public onShare() {
        TelegramWebApp.Instace.share("https://t.me/cocos_demo_bot/game", "Invite you to play a very interesting game");
    }


    public gotoHomePage() {
        
        this._homeCb && this._homeCb();   
    }
}


