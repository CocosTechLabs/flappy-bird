import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Address, CocosGameFi, toNano, AssetsSDK } from '@cocos-labs/game-sdk';
import { TelegramWebApp } from './TelegramWebApp';
import { TonTransferRequest } from '@cocos-labs/game-sdk/lib/common/game-fi';
import { assetManager, SpriteFrame, Texture2D } from 'cc';
import { ImageAsset } from 'cc';
import { TonAddressConfig } from './FlappyBirdLite';
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

    private _gameFi: CocosGameFi;
    private _tonAddressConfig: TonAddressConfig;

    start() {
        this.searchLab.string = window.location.search;
    }

    public setGameFi(gamefi: CocosGameFi) {
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
    
        const userData = TelegramWebApp.Instace.getTelegramUser();
        console.log("userData : ", userData);
        if (userData && userData.user) {
            const user = userData.user;
            // load username
            if (user.username) {
                this.nameLab.string = user.username;
            } else {
                this.nameLab.string = user.first_name + ' ' + user.lastname ? user.lastname : '';
            }

            // load profile photo
            if (user.photo_url) {
                const fileExtension = user.photo_url.split('.').pop().toLowerCase();
                if (fileExtension == 'jpeg' || fileExtension == 'jpg' || fileExtension == 'png') {
                    assetManager.loadRemote<ImageAsset>(user.photo_url, function(err, imageAsset) {
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
        const show = async function (_gameFi: CocosGameFi, jettonMasterAddress: Address) {
            const openJetton = _gameFi.assetsSdk.openJetton(jettonMasterAddress)
            const jettonContent = await openJetton.getContent()
            const message = "jetton name: " + jettonContent.name +"\njetton decimals: " + jettonContent.decimals
            TelegramWebApp.Instace.alert(message)
        }
        show(this._gameFi, jettonMasterAddress)
    }


    public onGetTelegramUserData() {
        this.updateTelegramInfo();
    }

    public onShare() {
        let userId = '';
        const userData = TelegramWebApp.Instace.getTelegramUser();
        console.log("userData : ", userData);
        if (userData && userData.user) {
            const user = userData.user;
            userId = user.id;
        }
        TelegramWebApp.Instace.share("https://t.me/cocos_demo_bot/game?startapp=ref_code_" + userId, "Invite you to play a very interesting game");
    }

    public onBuyWithStars() {
        fetch("http://127.0.0.1:3000/create-stars-invoice", {method: 'POST'}).then(response => {
            return response.json();
        }).then(value => {
            console.log("starts invoice : ", value);
            if (value.ok) {
                TelegramWebApp.Instace.openInvoice(value.invoiceLink, (result) => {
                    console.log("buy stars : ", result);
                });
            } else {
                console.error('request config failed!');
            }
        });
    }
}


