import { _decorator, sys} from 'cc';
const { ccclass, property } = _decorator;


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

@ccclass('TelegramWebApp')
export class TelegramWebApp {
    private static _instance: TelegramWebApp;
    private constructor() {

    }
    public static get Instace(): TelegramWebApp {
        if (!TelegramWebApp._instance) {
            TelegramWebApp._instance = new TelegramWebApp();
        }
        return TelegramWebApp._instance;
    }

    private _tgWebAppJS: any = null;
    public async init() : Promise<{success: boolean}> {
        this._tgWebAppJS = await tgLoadPromise;

        if (this._tgWebAppJS) {
            return Promise.resolve({success: true});
        } else {
            return Promise.resolve({success: false});
        }
    }

    public openTelegramLink(url: string) {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return;
        }
        console.log(url);
        this._tgWebAppJS.openTelegramLink(url);
    }

    public share(url: string, text?: string) {
        const shareUrl = 'https://t.me/share/url?url=' + url + '&' + new URLSearchParams({ text: text || '' }).toString();
        this.openTelegramLink(shareUrl);
    }

    public getTelegramWebApp() {
        return this._tgWebAppJS;
    }

    public getTelegramUser() {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this._tgWebAppJS.initDataUnsafe;
    }

    public getTelegramUserInitData() {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this._tgWebAppJS.initData;
    }

    public alert(message: string) {
        this._tgWebAppJS.showAlert(message);
    }
}


