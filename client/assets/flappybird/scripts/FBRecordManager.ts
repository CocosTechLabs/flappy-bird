import { Singleton } from "../../scripts/framework/common/Singleton";
import { Utils } from "../../scripts/framework/common/Utils";
import { FBGlobalData } from "./FBGlobalData";

export interface FBRecord {
    timestamp: number;
    action: FBAction;
    inputType: FBInputType;
}
export enum FBAction {
    TOUCH_DOWN,
    TOUCH_UP,
}
export enum FBInputType {
    KEYBOARD,
    TOUCH_OR_MOUSE,
}

export class FBRecordManager extends Singleton {

    private _record: FBRecord[] = [];
    private _startTime: number = 0;
    private _endTime: number = 0;

    public init() {
        this._record = [];
    }

    public recordStart() {
        this._startTime = Utils.getTimeStamp();
    }

    public recordEnd() {
        this._endTime = Utils.getTimeStamp();
    }

    public addRecord(act: FBAction, inputType: FBInputType) {
        let data: FBRecord = {
            timestamp: Utils.getTimeStamp(),
            action: act,
            inputType,
        }
        this._record.push(data);
    }

    public reset() {
        this._record = [];
        this._startTime = 0;
        this._endTime = 0;
    }

    public getData(): any {
        let data = {
            start: this._startTime,
            end: this._endTime,
            version: FBGlobalData.VERSION,
            record: this._record
        }
        return data;
    }
}


