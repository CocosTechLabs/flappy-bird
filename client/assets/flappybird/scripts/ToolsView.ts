import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Address, GameFi, toNano, TonTransferRequest } from '@ton/cocos-sdk';
import { TelegramWebApp } from '../../cocos-telegram-miniapps/scripts/telegram-web';
import { game } from 'cc';
import { assetManager, SpriteFrame, Texture2D } from 'cc';
import { ImageAsset } from 'cc';
import { TonAddressConfig } from './FlappyBirdLite';
import { Config } from './Config';
const { ccclass, property } = _decorator;

@ccclass('ToolsView')
export class ToolsView extends Component {
    @property(Sprite)
    headSp: Sprite;
    @property(Label)
    nameLab: Label;
    @property(Label)
    addressLab: Label;
    @property(Label)
    searchLab: Label;

    private _gameFi: GameFi;
    private _tonAddressConfig: TonAddressConfig;
    private serverHost: string = Config.serverHost;

    start() {
        this.searchLab.string = window.location.search;
    }

    public setGameFi(gamefi: GameFi) {
        this._gameFi = gamefi;

        if (this._gameFi && this._gameFi.walletConnector.connected) {
            const address = this._gameFi.walletConnector.account.address;
            this.addressLab.string = Address.parseRaw(address).toString({ testOnly: true, bounceable: false }).substring(0, 6) + '...';
        } else {
            this.addressLab.string = 'Unconnected';
        }

        this.updateTelegramInfo();
    }


    public setTonAddressConfig(config: TonAddressConfig) {
        this._tonAddressConfig = config;
    }

    private updateTelegramInfo() {

        const userData = TelegramWebApp.Instance.getTelegramUser();
        console.log("userData : ", userData);
        if (userData) {
            // load username
            if (userData.username) {
                this.nameLab.string = userData.username;
            } else {
                this.nameLab.string = userData.first_name + ' ' + userData.last_name ? userData.last_name : '';
            }

            // load profile photo
            if (userData.photo_url) {
                const fileExtension = userData.photo_url.split('.').pop().toLowerCase();
                if (fileExtension == 'jpeg' || fileExtension == 'jpg' || fileExtension == 'png') {
                    assetManager.loadRemote<ImageAsset>(userData.photo_url, function (err, imageAsset) {
                        const spriteFrame = new SpriteFrame();
                        const texture = new Texture2D();
                        texture.image = imageAsset;
                        spriteFrame.texture = texture;
                        this.headSp.spriteFrame = spriteFrame;
                    });
                }
            }
        }

    }

    public onClose() {
        this.node.active = false;
    }

    public onTransferTon() {
        if (this._gameFi && this._gameFi.walletConnector?.connected) {
            const tonTransferReq = {
                to: Address.parse(this._tonAddressConfig.tonAddress),
                amount: toNano(0.01)
            } as TonTransferRequest;
            this._gameFi.transferTon(tonTransferReq);
        }
    }

    public onBuyWithTon() {
        const tonTransferReq = {
            amount: toNano(0.01)
        } as Omit<TonTransferRequest, "to">;
        this._gameFi.buyWithTon(tonTransferReq);
    }

    public onShowJetton() {
        const jettonMasterAddress = Address.parse(this._tonAddressConfig.jettonAddress)
        const show = async function (_gameFi: GameFi, jettonMasterAddress: Address) {
            const openJetton = _gameFi.assetsSdk.openJetton(jettonMasterAddress)
            const jettonContent = await openJetton.getContent()
            const message = "jetton name: " + jettonContent.name + "\njetton decimals: " + jettonContent.decimals
            TelegramWebApp.Instance.alert(message)
        }
        show(this._gameFi, jettonMasterAddress)
    }


    public onGetTelegramUserData() {
        this.updateTelegramInfo();
    }

    public onShare() {
        let userId = '';
        const userData = TelegramWebApp.Instance.getTelegramUser();
        console.log("userData : ", userData);
        if (userData) {
            userId = userData.id + '';
        }
        TelegramWebApp.Instance.share("https://t.me/cocos_demo_bot/game?startapp=ref_code_" + userId, "Invite you to play a very interesting game");
    }

    public onShareStory() {
        TelegramWebApp.Instance.shareToStory(`${this.serverHost}/story.mp4`, "Invite you to play a crazy game", "https://t.me/cocos_demo_bot/game", "click join")
    }

    public onBuyWithStars() {
        fetch(`${this.serverHost}/create-stars-invoice`, { method: 'POST' }).then(response => {
            return response.json();
        }).then(value => {
            console.log("starts invoice : ", value);
            if (value.ok) {
                TelegramWebApp.Instance.openInvoice(value.invoiceLink, (result) => {
                    console.log("buy stars : ", result);
                });
            } else {
                console.error('request config failed!');
            }
        });
    }

    public onCryptoBuy() {
        fetch(`${this.serverHost}/create-alchemypay-link`, { method: 'POST' }).then(response => {
            return response.json();
        }).then(value => {
            if (value.ok) {
                TelegramWebApp.Instance.openLink(value.link, { "try_instant_view": true })
            } else {
                console.error('request config failed!');
            }
        });

    }

}


