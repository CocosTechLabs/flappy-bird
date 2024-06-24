import { sys } from "cc";


export class Utils {
    public static rollBoolArray(arr: boolean[], rollCnt1: number, rollCnt2: number) {
        let len = arr.length;
        for (let i = 0; i < rollCnt1 && i < len; ++i) {
            let r = Math.floor(Math.random() * len);
            let a = arr[i];
            arr[i] = arr[r];
            arr[r] = a;
        }
        for (let i = 0; i < rollCnt2; ++i) {
            let r1 = Math.floor(Math.random() * len);
            let r2 = Math.floor(Math.random() * len);
            let a = arr[r1];
            arr[r1] = arr[r2];
            arr[r2] = a;
        }
    }

    public static OpenURLByNewTab(url: string) {
        sys.openURL(url);
    }
    public static OpenURLByCurTab(url: string) {
        window.location.href = url;
    }

    public static getTimeStamp() {
        // var timestamp = Date.parse(new Date().toString());
        let timestamp = Date.now();
        return timestamp;
    }

    public static getTimeStampSecond() {
        return Math.floor(this.getTimeStamp() / 1000);
    }

    public static getLocationUrlParam(urlKey: string): string {
        const paramsStr = window.location.search;
        const params = new URLSearchParams(paramsStr);
        return params.get(urlKey);
    }

    public static getUrlParam1(urlStr: string | URL, urlKey: string): string {
        const url = new URL(urlStr)
        const paramsStr = url.search.slice(1);
        const params = new URLSearchParams(paramsStr);
        return params.get(urlKey); // list
    }

    public static getUrlParam2(urlStr: string, urlKey: string): string {
        const url = new URL(urlStr); // 字符串转换成url格式
        const paramsStr = url.search.slice(1); // 获取'?'后面的参数字符串
        const paramsArr = paramsStr.split('&'); // 分割'&'字符 获得参数数组
        for (let i = 0; i < paramsArr.length; i++) {
            const tempArr = paramsArr[i].split('=');
            if (tempArr[0] === urlKey) {
                return tempArr[1];
            }
        }
        return '';
    }

    public static getUrlParam3(urlStr: string, urlKey: string): string {
        const url = new URL(urlStr);
        var reg = new RegExp('[\?\&]' + urlKey + '=([^\&]*)(\&?)', 'i');
        var r = url.search.match(reg);
        return r ? r[1] : '';
    }

}