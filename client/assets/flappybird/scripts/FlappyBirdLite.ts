import { _decorator, Component, EventTouch, Input, Node, Prefab, find, UITransform, EventKeyboard, KeyCode, input, CCInteger, PhysicsSystem2D, Label, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
import { FBird } from './FBird';
import { PoolManager } from '../../scripts/framework/common/PoolManager';
import { ScrollControl } from './ScrollControl';
import { FLevel, FLevelInitParams } from './FLevel';
import { GameBase } from '../../scripts/framework/base/GameBase';
import { FBGlobalData } from './FBGlobalData';
import { GameResult, GameResultInitParams } from './GameResult';
import { FBAction, FBInputType, FBRecordManager } from './FBRecordManager';
import { Countdown } from '../../scripts/framework/common/Countdown';
import { LogManager } from '../../scripts/framework/common/LogManager';
import { Button } from 'cc';

import { GameFi, TonConnectUI, Address, toNano } from '@ton/cocos-sdk';
import { TelegramWebApp } from '../../cocos-telegram-miniapps/scripts/telegram-web';
import { ToolsView } from './ToolsView';
import globalEvent from '../../scripts/framework/event/GlobalEvent';
import { GameEvents } from './Events';

import { createWeb3Modal, defaultConfig, AppKit } from '@cocos-labs/web3modal-ethers5';
import { createWalletClient, custom, WalletClient } from 'viem'
import { mainnet } from 'viem/chains'
import { Config } from './Config';
const { ccclass, property } = _decorator;

export interface TonAddressConfig {
    tonAddress: string,
    jettonAddress?: string;
}

@ccclass('FlappyBirdLite')
export class FlappyBirdLite extends GameBase {
    @property(Prefab)
    birdPrefab: Prefab = null;
    @property(Node)
    birdRoot: Node = null;
    @property(Node)
    touchLayer: Node = null;
    @property(Node)
    startLayer: Node = null;
    @property(Node)
    gameOverLayer: Node = null;
    @property(ScrollControl)
    bgScroll: ScrollControl = null;
    @property(ScrollControl)
    groundScroll: ScrollControl = null;
    @property(FLevel)
    levelMng: FLevel = null;
    @property(CCInteger)
    initMoveSpeed: number = 200;
    @property(CCInteger)
    skyY: number = 360;
    @property(CCInteger)
    groundY: number = -180;
    @property(Label)
    scoreLbl: Label = null;
    @property(Collider2D)
    skyCollider: Collider2D = null;
    @property(Collider2D)
    groundCollider: Collider2D = null;
    @property(GameResult)
    gameResult: GameResult;
    @property(Countdown)
    countdown: Countdown;



    private _bird: FBird = null;
    private _touchStarted: boolean = false;
    private _score: number = 0;
    private _nCoin: number = 0;

    @property(Button)
    startGameBtn: Button;
    @property(Label)
    connectLabel: Label;
    @property(Node)
    top: Node;
    @property(Node)
    logo: Node;

    @property(Label)
    evmConnectLabel: Label;

    @property(ToolsView)
    toolView: ToolsView;

    private _bTonInit: boolean = false;

    private _cocosGameFi: GameFi;
    private _connectUI;
    private _evmConnect: AppKit;
    private _evmWalletClient: WalletClient;
    private serverHost: string = Config.serverHost;
    protected onLoad() {
        LogManager.log(`Game:FlappyBird version:${FBGlobalData.VERSION}`);

        TelegramWebApp.Instance.init().then(res => {
            console.log("telegram web app init : ", res.success);
        });

        fetch(`${this.serverHost}/config`, { method: 'GET' }).then(response => {
            return response.json();
        }).then(value => {
            console.log("config : ", value);
            if (value.ok) {

                const addressConfig = {
                    tonAddress: value.tokenRecipient,
                    jettonAddress: value.jettonMaster
                } as TonAddressConfig;
                this.toolView.setTonAddressConfig(addressConfig);

            } else {
                console.error('request config failed!');
            }
        });

        this._rigesterEvent();
        this._initPhyEnv();
        // this._setPhy2DDebug(true);

        this._initEvmConnect();
        this._initTonConnect();
    }

    _initEvmConnect() {
        // 1. Get projectId from https://cloud.walletconnect.com
        const projectId = 'a3c5251fe077f63e2fe1931521283512'

        // 2. Set chains
        const mainnet = {
            chainId: 1,
            name: 'Ethereum',
            currency: 'ETH',
            explorerUrl: 'https://etherscan.io',
            rpcUrl: 'https://rpc.ankr.com/eth'
        }

        const bnbchain = {
            chainId: 56,
            name: 'BNB Smart Chain Mainnet',
            currency: 'BNB',
            explorerUrl: 'https://bscscan.com/',
            rpcUrl: 'https://bsc-dataseed4.ninicoin.io'
        }

        // 3. Create your application's metadata object
        const metadata = {
            name: 'My Website',
            description: 'My Website description',
            url: 'https://mywebsite.com', // url must match your domain & subdomain
            icons: ['https://avatars.mywebsite.com/']
        }

        // 4. Create Ethers config
        const ethersConfig = defaultConfig({
            /*Required*/
            metadata,

            /*Optional*/
            enableEIP6963: true, // true by default
            enableInjected: true, // true by default
            defaultChainId: 56
        })

        // 5. Create a AppKit instance
        this._evmConnect = createWeb3Modal({
            ethersConfig,
            chains: [mainnet, bnbchain],
            projectId,
            enableAnalytics: false, // Optional - defaults to your Cloud configuration
            auth: {
                email: false,
                showWallets: false,
                walletFeatures: false,
                socials: []
            }
        })


        this._evmConnect.subscribeEvents(event => {
            this.evmConnectEventHandle(event)
        });

    }

    async _initTonConnect() {

        this.toolView.node.active = false;

        let uiconnector = new TonConnectUI({
            manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json'
        });
        this._cocosGameFi = await GameFi.create({
            connector: uiconnector,
            network: "testnet"
        });
        this._connectUI = this._cocosGameFi.walletConnector;

        const unsubscribeModal = this._connectUI.onModalStateChange(state => {
            console.log("model state changed! : ", state);

            this.updateConnect();
        });

        const unsubscribeConnectUI = this._connectUI.onStatusChange(info => {
            console.log("wallet info status changed : ", info);

            this.updateConnect();
        });

        this._bTonInit = true;
        this.updateConnect();
    }

    public isConnected(): boolean {
        if (!this._connectUI) {
            console.error("ton ui not inited!");
            return false;
        }
        return this._connectUI.connected;
    }

    private updateConnect() {
        if (this.isConnected()) {
            const address = this._connectUI.account.address;
            this.connectLabel.string = Address.parseRaw(address).toString({ testOnly: true, bounceable: false }).substring(0, 6) + '...';
        } else {
            this.connectLabel.string = "Connect";
        }
    }

    private async evmConnectEventHandle(event: any) {
        if (event.data.event == "MODAL_CLOSE" || event.data.event == "CONNECT_SUCCESS") {
            await this.updateWalletAddress();
        }
    }

    private async updateWalletAddress() {
        let provider = window.ethereum! as any

        if (typeof window.okxwallet !== 'undefined') {
            provider = window.okxwallet!;
        }

        if (typeof window.bitkeep !== 'undefined' && window.bitkeep.ethereum !== 'undefined') {
            provider = window.bitkeep!.ethereum;
        }

        this._evmWalletClient = createWalletClient({
            chain: mainnet,
            transport: custom(provider as any)
        })
        const addresses = await this._evmWalletClient.requestAddresses()
        if (addresses.length > 0) {
            this.evmConnectLabel.string = addresses[0].slice(-6);
            await this._evmWalletClient.signMessage({
                message: "Hello, this is cocos game message.",
                account: addresses[0]
            })

        } else {
            this.evmConnectLabel.string = "Connect";
        }
    }

    public async openModal() {
        if (!this._bTonInit) return;

        if (this.isConnected()) {
            this._connectUI.disconnect();
        } else {
            this._connectUI.openModal();
        }
    }

    public evmConnect() {
        if (typeof window.ethereum === 'undefined' &&
            typeof window.okxwallet === 'undefined' &&
            typeof window.bitkeep === 'undefined'
        ) {
            if (isPC()) {
                this._evmConnect.open({ view: 'Connect' })
                return
            }
            globalEvent.emit(GameEvents.WALLET_SHOW);
            return;
        }

        this.updateWalletAddress()
    }

    start() {
        this.gameLoaded();
    }

    public gameStartBtnClicked() {
        this.countDownGame();
    }

    countDownGame() {
        this._loadLevel();
        this.startLayer && (this.startLayer.active = true);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        this.startGameBtn.node.active = false;
        this.logo.active = false;
        this.top.active = true;
        if (this.skyCollider) {
            this.skyCollider.on(Contact2DType.BEGIN_CONTACT, this._outofSky, this);
        }
        if (this.groundCollider) {
            this.groundCollider.on(Contact2DType.BEGIN_CONTACT, this._onGround, this);
        }
        if (this.gameResult) {
            this.gameResult.hide();
        }
        if (this.scoreLbl) {
            this.scoreLbl.node.active = false;
        }

        if (this.countdown) {
            this.countdown.run(3, () => {
                this.startGame();
            });
        }

        // if (this._isSingleGameMode()) {

        // }
    }

    update(deltaTime: number) {
        if (this._isGameRunning) {
            this._updateBird();
            this._updateLevel();
            this._updateScore();
        }
    }

    gameLoaded() {
        this.resetGame(false);
        if (this._bird) {
            this._bird.node.active = false;
        }
        this.startGameBtn.node.active = true;
        this.gameResult.hide();
        this.startLayer.active = false;
        this.gameOverLayer.active = false;
        this.top.active = false;
        this.logo.active = true;

    }

    protected onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this._onKeyUp, this);
    }
    protected onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _rigesterEvent() {
        if (this.touchLayer) {
            this.touchLayer.on(Input.EventType.TOUCH_START, this._onTouchStart, this);
            this.touchLayer.on(Input.EventType.TOUCH_END, this._onTouchEnd, this);
        }
        if (this.startLayer) {
            // this.startLayer.on(Input.EventType.TOUCH_END, this.startGame, this);
        }
        if (this.gameOverLayer) {
            this.gameOverLayer.on(Input.EventType.TOUCH_END, this.resetGame, this);
        }
    }

    private _loadLevel() {
        if (!this._bird) {
            this._bird = this._createBird();
            this._bird.init(this.skyY, this.groundY);
        } else {
            this._bird.node.active = true;
        }
        let canvas: Node = find('Canvas');
        let b = canvas.getComponent(UITransform);
        this.bgScroll.init(b.width, this.initMoveSpeed);
        this.groundScroll.init(b.width, this.initMoveSpeed);
        this.startLayer && (this.startLayer.active = true);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        let data: FLevelInitParams = {
            screenWidth: b.width,
            initMoveSpeed: this.initMoveSpeed,
            addScoreCb: () => this._addScore(),
            dieCb: () => this._onDead(),
            addCoinCb: () => this._addCoin(),
        }
        this.levelMng.init(data);
    }

    private _createBird(): FBird {
        let bird: FBird = null;
        if (this.birdPrefab) {
            let birdNode: Node = PoolManager.Instance().getNode(this.birdPrefab, this.birdRoot);
            if (birdNode) {
                bird = birdNode.getComponent(FBird);
            }
        }
        return bird;
    }

    private _onTouchStart(event: EventTouch) {
        this._touchStarted = true;
        FBRecordManager.Instance().addRecord(FBAction.TOUCH_DOWN, FBInputType.TOUCH_OR_MOUSE);
    }

    private _onTouchEnd(event: EventTouch) {
        this._touchStarted = false;
        FBRecordManager.Instance().addRecord(FBAction.TOUCH_UP, FBInputType.TOUCH_OR_MOUSE);
    }

    private _onKeyDown(event: EventKeyboard) {
        LogManager.log('onKeyDown', event.keyCode);
        switch (event.keyCode) {
            case KeyCode.SPACE:
                this._touchStarted = true;
                FBRecordManager.Instance().addRecord(FBAction.TOUCH_DOWN, FBInputType.KEYBOARD);
                break;
        }
    }

    private _onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.SPACE:
                this._touchStarted = false;
                FBRecordManager.Instance().addRecord(FBAction.TOUCH_UP, FBInputType.KEYBOARD);
                break;
        }
    }

    private _updateBird() {
        if (this._touchStarted) {
            this._bird.fly();
        } else {
            this._bird.fall();
        }
    }

    private _updateLevel() {
        this.levelMng.onUpdate();
    }

    public onShowTools() {
        this.toolView.node.active = true;
        this.toolView.setGameFi(this._cocosGameFi);
    }

    startGame() {
        this.startLayer && (this.startLayer.active = false);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        this._isGameRunning = true;
        this._score = 0;
        this._nCoin = 0;
        this.bgScroll.setRun(true);
        this.groundScroll.setRun(true);
        this._bird.startFly();
        this.levelMng.run();
        if (this.scoreLbl) {
            this.scoreLbl.node.active = true;
            this.scoreLbl.string = '0';
        }
        FBRecordManager.Instance().recordStart();
    }

    gameOver() {
        FBRecordManager.Instance().recordEnd();
        this.startLayer && (this.startLayer.active = false);
        // this.gameOverLayer && (this.gameOverLayer.active = true);
        this._isGameRunning = false;
        this.bgScroll.setRun(false);
        this.groundScroll.setRun(false);
        this._bird.die();
        this.levelMng.stop();
        if (this.gameResult) {
            let data: GameResultInitParams = {
                score: this._score,
                coin: this._nCoin,
                restartCb: () => this.resetGame(),
                homeCb: () => this.gameLoaded(),
                isShowButtons: true
            }
            this.gameResult.init(data);
            this.gameResult.show();
        }
    }

    protected _onGameResetCb(data: Record<string, never>): void {
        this.resetGame();
    }

    resetGame(needStart: boolean = true) {
        this.startLayer && (this.startLayer.active = true);
        this.gameOverLayer && (this.gameOverLayer.active = false);
        // this._isGameRunning = true;
        this._score = 0;
        this._nCoin = 0;
        // this.bgScroll.setRun(true);
        // this.groundScroll.setRun(true);
        this._bird?.reset();
        this.levelMng?.reset();
        if (this.gameResult) {
            this.gameResult.hide()
        }
        if (this.scoreLbl) {
            this.scoreLbl.node.active = false;
            this.scoreLbl.string = '0';
        }
        FBRecordManager.Instance().reset();
        if (needStart) {
            if (this.countdown) {
                this.countdown.run(3, () => {
                    this.startGame();
                });
            }
        }
    }

    private _onDead() {
        this.gameOver();
    }

    private _addScore() {
        if (this._isGameRunning) {
            this._score++;
        }
    }

    private _addCoin() {
        if (this._isGameRunning) {
            this._nCoin++;
        }
    }

    private _updateScore() {
        if (this.scoreLbl) {
            // this.scoreLbl.string = this._score.toString();
            this.scoreLbl.string = this._nCoin.toString();
        }
    }

    private _onGround(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._isGameRunning) {
            this._onDead();
        }
    }

    private _outofSky(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._isGameRunning) {
            this._onDead();
        }
    }
}


const isPC = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'
    ];
    return !mobileKeywords.some(keyword => userAgent.includes(keyword));
};