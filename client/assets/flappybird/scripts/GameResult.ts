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
    // @property(Node)
    // claimTip: Node;
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
        // this.node.setPosition(pos);
        this._showClaimTip(false);
    }

    public hide() {
        this.node.active = false;
    }

    public onRestart() {
        this._restartCb && this._restartCb();
    }

    public onClaim() {
        this._showClaimTip(true);
    }

    public onShare() {
        TelegramWebApp.Instace.share("https://t.me/cocos_demo_bot/game", "Invite you to play an interesting game");
    }

    private _showClaimTip(isVisible: boolean) {
    }

    public gotoHomePage() {
        
        this._homeCb && this._homeCb();
        // let href = window.location.href;
        // let start = href.indexOf('://');
        // let tmp = href.substring(start + 3);
        // let tmpAry = tmp.split('?')[0].split('/');
        // let len = tmpAry.length;
        // if (len > 1) {
        //     let last = tmpAry[len - 1];
        //     if (last.length == 0 || last == 'index.html') {
        //         len--;
        //     }
        //     if (len > 1) {
        //         tmpAry.length = len - 1;
        //         let targetUrl = `${href.substring(0, start)}://${tmpAry.join('/')}`;
        //         Utils.OpenURLByCurTab(targetUrl);
        //     }
        // }
    }
}


