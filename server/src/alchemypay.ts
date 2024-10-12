import crypto from 'crypto';
import { URL } from 'url';
import { config } from './config';
import axios from 'axios';

function apiSign(timestamp: string, method: string, requestUrl: string, body: string, secretkey: string): string {
    const content = timestamp + method.toUpperCase() + getPath(requestUrl) + getJsonBody(body);
    const signVal = crypto.createHmac('sha256', secretkey)
        .update(content, 'utf8')
        .digest('base64');

    return signVal;
}


function getPath(requestUrl: string): string {
    const uri = new URL(requestUrl);
    const path = uri.pathname;
    const params = Array.from(uri.searchParams.entries());

    if (params.length === 0) {
        return path;
    } else {
        const sortedParams = [...params].sort(([aKey], [bKey]) => aKey.localeCompare(bKey));
        const queryString = sortedParams.map(([key, value]) => `${key}=${value}`).join('&');
        return `${path}?${queryString}`;
    }
}

function getJsonBody(body: string): string {
    let map;

    try {
        map = JSON.parse(body);
    } catch (error) {
        map = {};
    }

    if (Object.keys(map).length === 0) {
        return '';
    }

    map = removeEmptyKeys(map);
    map = sortObject(map);

    return JSON.stringify(map);
}

function parsePath(requestUrl: string) {
    const uri = new URL(requestUrl);
    const path = uri.pathname;
    const params = Object.fromEntries(uri.searchParams.entries());

    return { path, params };
}

function isJson(jsonString: string): boolean {
    if (!jsonString || jsonString === '') {
        return false;
    }

    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}

function removeEmptyKeys(map: Record<string, any>): Record<string, any> {
    const retMap: Record<string, any> = {};

    for (const [key, value] of Object.entries(map)) {
        if (value !== null && value !== '') {
            retMap[key] = value;
        }
    }

    return retMap;
}

function sortObject(obj: Record<string, any>): Record<string, any> {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return sortList(obj);
        } else {
            return sortMap(obj);
        }
    }

    return obj;
}

function sortMap(map: Record<string, any>): Record<string, any> {
    const sortedMap = new Map(Object.entries(removeEmptyKeys(map)).sort(([aKey], [bKey]) => aKey.localeCompare(bKey)));

    for (const [key, value] of sortedMap.entries()) {
        if (typeof value === 'object') {
            sortedMap.set(key, sortObject(value));
        }
    }

    return Object.fromEntries(sortedMap.entries());
}

function sortList(list: any[]): any[] {
    const objectList = [];
    const intList = [];
    const floatList = [];
    const stringList = [];
    const jsonArray = [];

    for (const item of list) {
        if (typeof item === 'object') {
            jsonArray.push(item);
        } else if (Number.isInteger(item)) {
            intList.push(item);
        } else if (typeof item === 'number') {
            floatList.push(item);
        } else if (typeof item === 'string') {
            stringList.push(item);
        } else {
            intList.push(item);
        }
    }

    intList.sort((a, b) => a - b);
    floatList.sort((a, b) => a - b);
    stringList.sort();

    objectList.push(...intList, ...floatList, ...stringList, ...jsonArray);
    list.length = 0;
    list.push(...objectList);

    const retList = [];

    for (const item of list) {
        if (typeof item === 'object') {
            retList.push(sortObject(item));
        } else {
            retList.push(item);
        }
    }

    return retList;
}

interface GetTokenParams {
    email?: string;
    uid?: string;
}

interface GetTokenResponse {
    success: boolean;
    returnCode: string;
    returnMsg: string;
    extend: string;
    data: {
        id: string;
        accessToken: string;
        email: string;
    };
    traceId: string;
}

export async function getAlchemyPayToken(params: GetTokenParams): Promise<GetTokenResponse> {
    const timestamp = String(Date.now());
    const method = 'POST';
    const requestUrl = `${config.ALCHEMYPAY_DOMAIN}/open/api/v4/merchant/getToken`;
    const body = JSON.stringify(params);

    const sign = apiSign(timestamp, method, requestUrl, body, config.ALCHEMYPAY_SECRETKEY);

    try {
        const response = await axios.post<GetTokenResponse>(requestUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                'appid': config.ALCHEMYPAY_APPID,
                'timestamp': timestamp,
                'sign': sign
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error getting AlchemyPay token:', error);
        throw error;
    }
}


export async function createAlchemyPayOrder(params: CreateOrderParams, accessToken: string): Promise<CreateOrderResponse> {
    const timestamp = String(Date.now());
    const method = 'POST';
    const requestUrl = `${config.ALCHEMYPAY_DOMAIN}/open/api/v4/merchant/trade/create`;
    const body = JSON.stringify(params);
    console.log(body);
    const sign = apiSign(timestamp, method, requestUrl, body, config.ALCHEMYPAY_SECRETKEY);
    try {
        const response = await axios.post<CreateOrderResponse>(requestUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                'appid': config.ALCHEMYPAY_APPID,
                'timestamp': timestamp,
                'access-token': accessToken,
                'sign': sign
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating AlchemyPay order:', error);
        throw error;
    }
}

// Define interfaces for request and response
export interface CreateOrderParams {
    side: string;
    cryptoCurrency: string;
    merchantOrderNo: string;
    address: string;
    network: string;
    fiatCurrency: string;
    amount: string;
    depositType: number;
    payWayCode: string;
    redirectUrl: string;
    callbackUrl: string;
}

export interface CreateOrderResponse {
    success: boolean;
    returnCode: string;
    returnMsg: string;
    extend: string;
    data: {
        orderNo: string;
        payUrl: string;
    };
    traceId?: string;
}
