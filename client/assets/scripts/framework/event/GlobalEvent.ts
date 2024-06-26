import { LogManager } from "../common/LogManager";

class GlobalEvent {
    private handles_: { [key: string]: { target: any; callback: (data: any) => void }[] } = {};

    constructor() {
        //LogManager.log("=GlobalEvent==")
    }

    emit(eventName: string, data?: any): void {
        data = data || {};
        data.eventName = eventName; 
        let event_list = this.handles_[eventName];
        if (event_list) {
            for (var i = 0; i < event_list.length; i++) {
                let item = event_list[i];
                if (item && item.callback) {
                    item.callback(data);
                }
            }
        }
    }

    on(eventName: string, callback: (data: any) => void, target: any): void {
        let event_list = this.handles_[eventName];
        if (event_list) {
            for (let i = 0; i < event_list.length; i++) {
                let item = event_list[i];
                if (item.target == target) {
                    LogManager.log("===alread exist target");
                    return;
                }
            }
        }

        let item = {} as { target: any; callback: (data: any) => void };
        item.target = target;
        item.callback = callback.bind(target);
        this.handles_[eventName] = this.handles_[eventName] || [];

        this.handles_[eventName].push(item);
    }

    off(eventName: string, target: any): void {
        let event_list = this.handles_[eventName];
        let length = event_list.length;
        for (var i = length - 1; i >= 0; i--) {
            let item = event_list[i];
            if (item) {
                if (item.target == target) {
                    event_list.splice(i, 1);
                }
            }
        }
    }

    offAll(eventName: string): void {
        this.handles_[eventName] = null;
    }

    offAllByTarget(target: any): void {
        let self = this;
        Object.keys(this.handles_).forEach(function (key) {
            let event_list = self.handles_[key];
            for (var i = event_list.length - 1; i >= 0; i--) {
                let item = event_list[i];
                if (item) {
                    if (item.target == target) {
                        //LogManager.log("this.handles_==!!!!=")
                        event_list.splice(i, 1);
                    }
                }
            }
        });

        //LogManager.log("this.handles_===",this.handles_)
    }
}

var globalEvent = new GlobalEvent();
export default globalEvent;