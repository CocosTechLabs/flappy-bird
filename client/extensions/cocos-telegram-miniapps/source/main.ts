const projectPath = Editor.Project.path;
const extensionImportPath = Editor.Utils.Path.join(projectPath, "extensions", "cocos-telegram-miniapps", "import");

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    import() {
        const filePath = Editor.Utils.Path.join(extensionImportPath, "scripts", "telegram-web.ts.import")
        Editor.Message.request("asset-db", "import-asset", filePath, 'db://assets/cocos-telegram-miniapps/scripts/telegram-web.ts');
    },
};

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export function load() { }

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() { }
