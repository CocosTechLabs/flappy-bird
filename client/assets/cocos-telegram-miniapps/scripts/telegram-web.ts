import { _decorator, sys } from 'cc';
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
        script.onerror = () => reject(new Error("Unable to load TelegramWebApp SDK, please check logs."));
        document.head.appendChild(script);
    }
});

export interface WebAppUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
}
export interface WebAppChat {
    id: number;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
}
export interface WebAppInitData {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    chat?: WebAppChat;
    chat_type?: 'private' | 'group' | 'supergroup' | 'channel';
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_data: number;
    hash: string;
}

@ccclass('TelegramWebApp')
export class TelegramWebApp {
    private static _instance: TelegramWebApp;
    private constructor() {

    }
    public static get Instance(): TelegramWebApp {
        if (!TelegramWebApp._instance) {
            TelegramWebApp._instance = new TelegramWebApp();
        }
        return TelegramWebApp._instance;
    }

    private _tgWebAppJS: any = null;
    public async init(): Promise<{ success: boolean }> {
        this._tgWebAppJS = await tgLoadPromise;

        if (this._tgWebAppJS) {
            return Promise.resolve({ success: true });
        } else {
            return Promise.resolve({ success: false });
        }
    }

    public openTelegramLink(url: string) {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return;
        }
        this._tgWebAppJS.openTelegramLink(url);
    }

    public share(url: string, text?: string) {
        const shareUrl = 'https://t.me/share/url?url=' + url + '&' + new URLSearchParams({ text: text || '' }).toString();
        this.openTelegramLink(shareUrl);
    }

    public shareToStory(media_url: string, shareText?: string, widget_link_url?: string, widget_link_name?: string) {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return;
        }
        const widget_link = {
            text: shareText,
            widget_link: {
                url: widget_link_url,
                name: widget_link_name,
            },
        };
        this._tgWebAppJS.shareToStory(media_url, widget_link);
    }

    public getTelegramWebApp() {
        return this._tgWebAppJS;
    }

    public getTelegramWebAppInitData(): WebAppInitData {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        }
        return this._tgWebAppJS.initDataUnsafe;
    }


    public getTelegramUser(): WebAppUser {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        }
        return this._tgWebAppJS.initDataUnsafe.user;
    }

    public getTelegramInitData(): string {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        }
        return this._tgWebAppJS.initData;
    }

    public openInvoice(url: string, callback: any) {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        }
        this._tgWebAppJS.openInvoice(url, callback);
    }

    public alert(message: string) {
        this._tgWebAppJS.showAlert(message);
    }
}


