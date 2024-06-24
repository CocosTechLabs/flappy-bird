


export class Singleton {
    protected constructor() {
    }
    private static _instance: Singleton = null;
    static Instance<T extends {}>(this: (new () => T) | Singleton): T {
        const _class = this as typeof Singleton;
        if (!_class._instance) {
            _class._instance = new _class();
        }
        return _class._instance as T;
    }
    static getInstance<T extends {}>(this: (new () => T) | Singleton): T {
        const _class = this as typeof Singleton;
        if (!_class._instance) {
            _class._instance = new _class();
        }
        return _class._instance as T;
    }
}