
import { NodePool, Prefab, _decorator, instantiate, Node } from 'cc';
import { Singleton } from './Singleton';
import { LogManager } from './LogManager';

export class PoolManager extends Singleton {
    public exclusion_dict: any;
    public dictPool: any;

    protected constructor() {
        super();
        this.dictPool = {};
        this.exclusion_dict = {};
    }

    start() {

    }

    public getNode(prefab: Prefab, parent: Node = null, is_exclusion: boolean = false): Node {
        let name = prefab.name;
        if (is_exclusion) {  
            if (this.exclusion_dict[name]) {
                return
            } else {
                for (var key in this.exclusion_dict) {
                    this.putNode(this.exclusion_dict[key]);
                    delete this.exclusion_dict[key];
                }
            }
        }
        let node = null;
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(prefab);
            }
        } else {
            let pool = new NodePool();
            this.dictPool[name] = pool;
            node = instantiate(prefab);
        }
        if (is_exclusion) {
            this.exclusion_dict[name] = node;
        }
        if (node == null) {
            LogManager.log('>>>>>name,', name);
            LogManager.log('>>>>>prefab,', prefab);
            LogManager.log('>>>>>this.dictPool[name],', this.dictPool[name]);
        }
        if (parent != null) {
            parent.addChild(node)
        }
        return node;
    }

    putNode(node: any) {
        let name = node.name;
        if (this.exclusion_dict[name]) {
            delete this.exclusion_dict[name];
        }
        let pool: NodePool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            pool = this.dictPool[name];
        } else {
            pool = new NodePool();
            this.dictPool[name] = pool;
        }
        pool.put(node);
    }

    clearPool(name: any) {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }

}




