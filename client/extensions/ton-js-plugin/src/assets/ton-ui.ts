import { sys } from 'cc';

const tonUIPromise = new Promise<any>((resolve, reject) => {
    if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.platform === sys.Platform.DESKTOP_BROWSER) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@tonconnect/ui@2.0.5/dist/tonconnect-ui.min.js";
        script.async = true;
        script.onload = () => {
            const intervalId = setInterval(() => {
                if ((window as any).TON_CONNECT_UI) {
                    resolve((window as any).TON_CONNECT_UI);
                    clearInterval(intervalId);
                }
            }, 100);
        };
        script.onerror = () => reject(new Error("Unable to load GamePix sdk, please check logs."));
        document.head.appendChild(script);
    }
});

const tgLoadPromise = new Promise<any>((resolve, reject) => {
    if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.platform === sys.Platform.DESKTOP_BROWSER) {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js";
        script.async = true;
        script.onload = () => {
            const intervalId = setInterval(() => {
                if ((window as any).Telegram && (window as any).Telegram.WebApp) {
                    resolve((window as any).Telegram.WebApp);
                    clearInterval(intervalId);
                }
            }, 100);
        };
        script.onerror = () => reject(new Error("Unable to load GamePix sdk, please check logs."));
        document.head.appendChild(script);
    }
});

export class TonUIMgr {
    private static instance: TonUIMgr;
    private constructor() {

    }
    public static getInstance(): TonUIMgr {
        if (!TonUIMgr.instance) {
            TonUIMgr.instance = new TonUIMgr();
        }
        
        return TonUIMgr.instance;
    }

    public tonConnectUI: any = null;
    public tgWebApp: any = null;
    public async init(tonParams: any, tgParams?:any) : Promise<{success: boolean}>{

        if (tgParams) {
            const tgwebapp = await tgLoadPromise;
            if (tgwebapp) {
                this.tgWebApp = tgwebapp;
            }
        }
        const ccui = await tonUIPromise;
        if (ccui) {
            this.tonConnectUI = new ccui.TonConnectUI(tonParams);
        }
        
        if (this.tonConnectUI && ((tgParams && this.tgWebApp) || (!tgParams && !this.tgWebApp))) {
            return Promise.resolve({success: true});
        } else {
            return Promise.resolve({success: false});
        }
    }

    private async openModalImp() {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return;
        }
        await this.tonConnectUI.modal.open();
        
    }
    public openModal() {
        this.openModalImp().catch(error => {
            console.error("error opening modal: ", error);
        });

        
    }
    public closeModal() {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return;
        }
        this.tonConnectUI.modal.close();
    }

    public getModal() : any | null {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return null;
        }
        // const { modal } = this.tonConnectUI;
        return this.tonConnectUI.modal;
    }

    public getWalletInfo() {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return null;
        }
        
        console.log("wallet : ", this.tonConnectUI.wallet);
        console.log("wallet info : ", this.tonConnectUI.walletInfo);
        console.log("account : ", this.tonConnectUI.account);
        console.log("connected : ", this.tonConnectUI.connected);
    }

    public isConnected(): boolean {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return false;
        }
        return this.tonConnectUI.connected;
    }

    public async disconnect() {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return;
        }
        await this.tonConnectUI.disconnect();
    }

    public getAccount(): any {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return {address: ''};
        }
        return this.tonConnectUI.account;
    }

    public async sendTransaction(transaction: any, notifications?: any): Promise<{result?: any, success: boolean}> {
        if (!this.tonConnectUI) {
            console.error("ton ui manager is not inited!");
            return Promise.resolve({success: false});
        }
        if (!this.isConnected()) {
            console.warn("ton wallect is not connected!");
            return Promise.resolve({success: false});
        }
        
        try {
            const result = await this.tonConnectUI.sendTransaction(transaction, notifications);
            // you can use signed boc to find the transaction 
            // const someTxData = await myAppExplorerService.getTransaction(result.boc);
            // alert('Transaction was sent successfully', someTxData);


            return Promise.resolve({success: true, result: result});
        } catch (e) {
            console.error(e);
            return Promise.resolve({success: false});
        }
    }

    public openTelegramLink(url: string) {
        if (!this.tgWebApp) {
            console.error("telegram web app is not inited!");
            return;
        }
        console.log(url);
        this.tgWebApp.openTelegramLink(url);
    }

    public share(url: string, text?: string) {
        const shareUrl = 'https://t.me/share/url?url=' + url + '&' + new URLSearchParams({ text: text || '' }).toString();
        this.openTelegramLink(shareUrl);
    }

    public getTelegramWebApp() {
        return this.tgWebApp;
    }

    public getTelegramUser() {
        if (!this.tgWebApp) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this.tgWebApp.initDataUnsafe;
    }

    public getTelegramUserInitData() {
        if (!this.tgWebApp) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this.tgWebApp.initData;
    }

    public alert(message: string) {
        this.tgWebApp.showAlert(message);
    }
}