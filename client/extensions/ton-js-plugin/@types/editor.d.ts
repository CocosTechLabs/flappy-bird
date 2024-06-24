/// <reference types='node' />
/// <reference path='./extension.d.ts'/>

import * as NodeJSPath from 'path';
import type { FileFilter, BrowserWindow, OpenDialogReturnValue, SaveDialogReturnValue, MessageBoxReturnValue, MenuItemConstructorOptions } from 'electron';

type BaseType = string | number | boolean | undefined | null;

declare global {
    export namespace Editor {
        export namespace App {
            export const userAgent: string;
            /**
             * 是否是开发模式
             * Development mode
             */
            export const dev: boolean;
            /**
             * 编辑器启动参数
             * Editor startup parameters
             */
            export const args: {[key: string]: string | number};
            /**
             * 编辑器版本号
             * Editor version
             */
            export const version: string;
            /**
             * 主目录
             * Home directory
             */
            export const home: string;
            /**
             * 编辑器程序文件夹
             * Program folder
             */
            export const path: string;
            /**
             * 获取当前编辑器的临时缓存目录
             * Temporary cache directory
             */
            export const temp: string;
            /**
             * 获取当前编辑器 icon 地址
             * Gets the icon address of the current editor
             */
            export const icon: string;
            /**
             * 获取当前编辑器使用的 url 地址
             * Gets the URL used by the current editor
             */
            export const urls: {
                manual: string;
                api: string;
                forum: string;
            };
            /**
             * 退出程序
             * Exit the program
             */
            export function quit(): void;
        }
        export namespace Clipboard {
            export type ICopyType = 'image' | 'text' | 'files' | string;
            /**
             * 获取剪贴板内容
             * @param type
             */
            export function read(type: ICopyType): string | number | {[key: string]: string | number | boolean | null};
            /**
             * 写入剪贴板内容
             * @param type
             * @param value
             */
            export function write(type: 'image', value: string): boolean;
            export function write(type: 'text', value: string): boolean;
            export function write(type: 'files', value: FileList): boolean;
            export function write(type: string, value: any): boolean;

            /**
             * 判断当前剪贴板内是否是指定类型
             * @param type
             */
            export function has(type: ICopyType): boolean;
            /**
             * 清空剪贴板
             */
            export function clear(): void;
        }
        export namespace Dialog {
            
            export interface SaveDialogOptions {
                title?: string;
                path?: string;
                button?: string;
                filters?: FileFilter[];
            }
            export interface SelectDialogOptions {
                title?: string;
                path?: string;
                type?: 'directory' | 'file';
                button?: string;
                multi?: boolean;
                filters?: FileFilter[];
                extensions?: string;
            }
            export interface MessageDialogOptions {
                title?: string;
                detail?: string;
                default?: number;
                cancel?: number;
                checkboxLabel?: string;
                checkboxChecked?: boolean;
                buttons?: string[];
            }

            /**
             * 选择文件弹窗
             * Select the file popover
             *
             * @param options 选择弹窗参数 Select popover parameters
             * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
             */
            export function select(options?: SelectDialogOptions, window?: BrowserWindow): Promise<OpenDialogReturnValue>;
            /**
             * 保存文件弹窗
             * Save the file popup
             *
             * @param options 保存文件窗口参数 Save the file window parameters
             * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
             */
            export function save(options?: SaveDialogOptions, window?: BrowserWindow): Promise<SaveDialogReturnValue>;
            /**
             * 信息弹窗
             * Information popup window
             *
             * @param message 显示的消息 Displayed message
             * @param options 信息弹窗可选参数 Information popup optional parameter
             * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
             */
            export function info(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<MessageBoxReturnValue>;
            /**
             * 警告弹窗
             * Warning popup
             *
             * @param message 警告信息 Warning message
             * @param options 警告弹窗可选参数 Warning popover optional parameter
             * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
             */
            export function warn(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<MessageBoxReturnValue>;
            /**
             * 错误弹窗
             * Error popup window
             *
             * @param message 错误信息 The error message
             * @param options 错误弹窗可选参数 Error popover optional parameter
             * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
             */
            export function error(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<MessageBoxReturnValue>;
        }
        export namespace EditMode {
            /**
             * 标记编辑器进入了一种编辑模式
             * The tag editor goes into an edit mode
             *
             * @param mode 编辑模式的名字 The name of the edit mode
             */
            export function enter(mode: string);
            /**
             * 当前所处的编辑模式
             * The current editing mode
             *
             */
            export function getMode(): string;
        }
        export namespace I18n {
            export type I18nMap = {
                [key: string]: string | number;
            };
            /**
             * 获取当前的语言 zh | en
             * Get the current language
             */
            export function getLanguage(): string;
            /**
             * 传入 key，翻译成当前语言
             * Passing in the key translates into the current language
             * 允许翻译变量 {a}，传入的第二个参数 obj 内定义 a
             * The translation variable {a} is allowed, and a is defined in the second argument passed in obj
             *
             * @param key 用于翻译的 key 值 The key value for translation
             * @param obj 翻译字段内如果有 {key} 等可以在这里传入替换字段 If you have {key} in the translation field, you can pass in the replacement field here
             */
            export function t(key: string, obj?: I18nMap): string;
            /**
             * 选择一种翻译语言
             * Choose a translation language
             *
             * @param language 选择当前使用的语言 Select the language currently in use
             */
            export function select(language: string): void;
        }
        export namespace Layout {
            interface ILayoutItem {
                'min-width': number;
                'min-height': number;
                direction: 'row' | 'column' | 'none';
                percent: number;
                minimize: boolean;
                children?: ILayoutItem[];
                active?: string;
                panels?: string[];
            }
            
            export interface ILayout {
                version: 1;
                layout: ILayoutItem;
            }
            /**
             * 应用布局信息
             * Application layout information
             *
             * @param json 布局文件内容 Layout file content
             */
            export function apply(json: ILayout);
            /**
             * 查询当前的布局信息，返回一个布局 json 对象
             * Query the current layout information and return a layout json object
             * 
             * @param name 
             */
            export function query(name?: string): Promise<ILayout>;
        }
        export namespace Logger {
            interface ILogInfo {
                process?: 'browser' | 'renderer',
                type: 'log' | 'info' | 'warn' | 'error',
                message: string,
                stack: string,
                time:  number,
            }
            /**
             * 清空所有的日志
             * Clear all logs
             */
            export function clear(regexp?: RegExp): void;
            /**
             * 查询所有日志
             * Query all logs
             */
            export function query(): ILogInfo[];
        }
        export namespace Menu {
            export interface BaseMenuItem {
                // 菜单类型
                type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
                // 菜单项的名字
                label?: string;
                // 菜单附加说明
                sublabel?: string;
                // 是否显示
                visible?: boolean;
                // checkbox 或 radio 类型菜单项指定是否选中
                checked?: boolean;
                // 如果为 false，该菜单项将会置灰且不可点击
                enabled?: boolean;
                // 一个图标的绝对路径
                icon?: string;
                // 显示在按钮上的快捷键，只负责显示
                accelerator?: string;

                // 排序，数字越小越靠前
                order?: number;
                // 菜单属于哪一个分组
                group?: string;

                // 菜单点击后发送哪一个消息
                message?: string;
                // 发送消息指定发送到某个插件
                target?: string;
                // 消息附带的参数
                params?: (string | number | boolean | { [key: string]: string | number | boolean })[];
                // 按钮点击后的事件，定义后 message 将失效
                click?: Function | null;
                // 菜单项的行为，定义 click 属性后此属性将被忽略
                role?: MenuItemConstructorOptions['role'];
                // 子菜单
                submenu?: MenuTemplateItem[];
            }
            export interface MainMenuItem extends BaseMenuItem {
                path: string;
            }
            export interface ContextMenuItem extends BaseMenuItem {
                accelerator?: string;
            }
            export type MenuTemplateItem = BaseMenuItem;
            export interface PopupOptions {
                x?: number;
                y?: number;
                menu: ContextMenuItem[];
            }
            /**
             * 右键弹窗
             * Right-click pop-up
             * 只有面板进程可以使用
             * Only panel processes can be used
             *
             * @param json
             */
            export function popup(json: PopupOptions): void;
        }
        export namespace Message {
            export interface MessageInfo {
                methods: string[];
                public?: boolean;
                description?: string;
                doc?: string;
                sync?: boolean;
            }
            export interface TableBase {
                [x: string]: any;
                params: (string | number | boolean | { [key: string]: string | number | boolean })[];
            }
            /**
             * 发送一个消息，并等待返回
             * Send a message and wait for it to return
             *
             * @param name 目标插件的名字 The name of the target plug-in
             * @param message 触发消息的名字 The name of the trigger message
             * @param args 消息需要的参数 The parameters required for the message
             */
            export function request<J extends string, K extends keyof EditorMessageMaps[J]>(
                name: J,
                message: K,
                ...args: EditorMessageMaps[J][K]['params']
            ): Promise<EditorMessageMaps[J][K]['result']>;
            /**
             * 发送一个消息，没有返回
             * Send a message, no return
             *
             * @param name 目标插件的名字 The name of the target plug-in
             * @param message 触发消息的名字 The name of the trigger message
             * @param args 消息需要的参数 The parameters required for the message
             */
            export function send<M extends string, N extends keyof EditorMessageMaps[M]>(
                name: M,
                message: N,
                ...args: EditorMessageMaps[M][N]['params']
            ): void;
            /**
             * 广播一个消息
             * Broadcast a message
             *
             * @param message 消息的名字 Name of message
             * @param args 消息附加的参数 Parameter attached to the message
             */
            export function broadcast(message: string, ...args: (string | number | boolean | undefined | null | { [key: string]: any } | (string | number | boolean)[])[]): void;
        }
        export namespace Network {
            export type RequestData = string | number | {
                [index: string]: string | number | (string | number)[];
            }
            /**
             * 查询当前电脑的 ip 列表
             * Query the IP list of the current computer
             */
            export function queryIPList(): string[];
            /**
             * 检查一个端口是否被占用
             * Checks if a port is used
             *
             * @param port
             */
            export function portIsOccupied(port: number): Promise<boolean>;
            /**
             * 测试是否可以联通某一台主机
             * Test whether a host can be connected
             *
             * @param ip
             */
            export function testHost(ip: string): Promise<boolean>;
            /**
             * Get 方式请求某个服务器数据
             * GET requests data from a server
             *
             * @param url
             * @param data
             */
            export function get(
                url: string,
                data?: RequestData,
            ): Promise<Buffer>;
            /**
             * Post 方式请求某个服务器数据
             * POST requests data from a server
             *
             * @param url
             * @param data
             */
            export function post(
                url: string,
                data?: RequestData,
            ): Promise<Buffer>;
            /**
             * 获取某个可用的端口号
             * get the port that is free
             *
             * @param port
             */
            export function getFreePort(port: number): Promise<number>;
        }
        export namespace Package {
            // export module VERSION: string;
            export interface IGetPackageOptions {
                name?: string;
                debug?: boolean;
                path?: string;
                enable?: boolean;
                invalid?: boolean;
            }
            export interface PackageJson {
                name: string;
                version: string;
                author?: string;
                description?: string;
                main?: string;
                windows?: string;
                debug?: boolean;
                panel?: any;
                editor?: string;
            }
            export type PathType = 'home' | 'data' | 'temp';
            /**
             * 查询插件列表
             * Query Plug-in List
             *
             * @param options
             */
            export function getPackages(options?: IGetPackageOptions): Editor.Interface.PackageInfo[];
            /**
             * 注册一个插件
             * Register a plug-in
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             *
             * @param path
             */
            export function register(path: string): void;
            /**
             * 反注册一个插件
             * Unregister a plug-in
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             *
             * @param path
             */
            export function unregister(path: string): void;
            /**
             * 启动一个插件
             * Enable a plug-in
             *
             * @param path
             */
            export function enable(path: string): void;
            /**
             * 关闭一个插件
             * Disable a plug-in
             *
             * @param path
             */
            export function disable(path: string, options?: { replacement?: boolean }): void;
            /**
             * 获取一个插件的几个预制目录地址
             * Gets several prefab directory addresses for a plug-in
             *
             * @param extensionName 扩展的名字 Name of the extension
             * @param type 地址类型（temp 临时目录，data 需要同步的数据目录,不传则返回现在打开的插件路径） Address type (temp temporary directory, data need to synchronize data directory, do not pass to return the current open plug-in path)
             */
            export function getPath(extensionName: string): string | undefined;
        }
        export namespace Panel {
            export type Selector<$> = { $: Record<keyof $, HTMLElement | null> };
            export type Options<S, M, U extends (...args: any[]) => void> = {
                /**
                 * @en Listening to panel events
                 * @zh 监听面板事件
                 */
                listeners?: {
                    /**
                     * @en Hooks triggered when the panel is displayed
                     * @zh 面板显示的时候触发的钩子
                     */
                    show?: () => void;
                    /**
                     * @en Hooks triggered when the panel is hidden
                     * @zh 面板隐藏的时候触发的钩子
                     */
                    hide?: () => void;
                };

                /**
                 * @en Template of the panel
                 * @zh 面板的内容
                 */
                template: string;
                /**
                 * @en Style of the panel
                 * @zh 面板上的样式
                 * */
                style?: string;
                /**
                 * @en Selector of the panel
                 * @zh 快捷选择器
                 */
                $?: S;
                /**
                 * @en Panel built-in function methods that can be called in Messages, Listeners, lifecycle functions
                 * @zh panel 内置的函数方法，可以在 messages、listeners、生命周期函数内调用
                 */
                methods?: M;
                /**
                 * @en Hooks triggered when the panel is update
                 * @zh 面板数据更新后触发的钩子函数
                 */
                update?: (...args: Parameters<U>) => void;
                /**
                 * @en Hooks triggered when the panel is ready
                 * @zh 面板启动后触发的钩子函数
                 */
                ready?: () => void;
                /**
                 * @en The function that will be triggered when the panel is ready to close, and will terminate the closing of the panel if it
                 * returns false
                 * @zh 面板准备关闭的时候会触发的函数，return false 的话，会终止关闭面板
                 * 生命周期函数，在 panel 准备关闭的时候触发
                 * 如果 return false，则会中断关闭流程,请谨慎使用，错误的判断会导致编辑器无法关闭。
                 */
                beforeClose?: () => Promise<boolean | void> | boolean | void;
                /**
                 * @en Hook functions after panel closure
                 * @zh 面板关闭后的钩子函数
                 */
                close?: () => void;
            } & ThisType<Selector<S> & M>; // merge them together
            /**
             * 打开一个面板
             * Open up a panel
             *
             * @param name
             * @param args
             */
            export function open(name: string, ...args: (BaseType | { [key: string]: any })[]): Promise<boolean>;
            /**
             * 打开一个面板
             * Open up a panel
             *
             * @param besidePanel
             * @param name
             * @param args
             */
            export function openBeside(besidePanel: string, name: string, ...args: (BaseType | { [key: string]: any })[]): Promise<boolean>;
            /**
             * 关闭一个面板
             * Close a panel
             *
             * @param name
             */
            export function close(name: string): Promise<boolean>;
            /**
             * 将焦点传递给一个面板
             * Pass focus to a panel
             *
             * @param name
             */
            export function focus(name: string): Promise<boolean>;
            /**
             * 检查面板是否已经打开
             * Check that the panel is open
             *
             * @param name
             */
            export function has(name: string): Promise<boolean>;
            /**
             * 查询当前窗口里某个面板里的元素列表
             * @param name
             * @param selector
             */
            export function querySelector(name: string, selector: string): Promise<HTMLElement[][] | void>;
            export function define<U extends (...args: any[]) => void, Selector = Record<string, string>, M = Record<string, Function>>(
                options: Options<Selector, M, U>,
            ): void;
        }
        export namespace Profile {
            export type PreferencesProtocol = 'default' | 'global' | 'local';
            export type ProjectProtocol = 'default' | 'project';
            export type TempProtocol = 'temp';
            export type ProfileValueType = string | boolean | number | { [key: string]: any } | (string | boolean | number)[];
            export interface ProfileGetOptions {
                type: 'deep' | 'current' | 'inherit';
            }
            export interface ProfileObj {
                get: (key?: string, options?: ProfileGetOptions) => void;
                set: (key?: string, value?: any) => void;
                remove: (key: string) => void;
                save: () => void;
                clear: () => void;
                reset: () => void;
            }
            /**
             * 读取插件配置
             * Read the plug-in configuration
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param type 配置的类型，选填 Type of configuration, optional(global,local,default)
             */
            export function getConfig(name: string, key?: string, type?: PreferencesProtocol): Promise<any>;
            /**
             * 设置插件配置
             * Set the plug-in configuration
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param value 配置的值 The value of the configuration
             * @param type 配置的类型，选填 Type of configuration, optional(global,local,default)
             */
            export function setConfig(name: string, key: string, value: Editor.Profile.ProfileValueType, type?: PreferencesProtocol): Promise<void>;
            /**
             * 删除某个插件配置
             * Delete a plug-in configuration
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param type 配置的类型，选填 Type of configuration, optional(global,local,default)
             */
            export function removeConfig(name: string, key: string, type?: PreferencesProtocol): Promise<void>;
            /**
             * 读取插件内的项目配置
             * Read the project configuration within the plug-in
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param type 配置的类型，选填 Type of configuration, optional(project,default)
             */
            export function getProject(name: string, key?: string, type?: ProjectProtocol): Promise<any>;
            /**
             * 设置插件内的项目配置
             * Set the project configuration within the plug-in
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param value 配置的值 The value of the configuration
             * @param type 配置的类型，选填 Type of configuration, optional(project,default)
             */
            export function setProject(name: string, key: string, value: Editor.Profile.ProfileValueType, type?: ProjectProtocol): Promise<void>;
            /**
             * 删除插件内的项目配置
             * Delete the project configuration within the plug-in
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param type 配置的类型，选填 Type of configuration, optional(project,default)
             */
            export function removeProject(name: string, key: string, type?: ProjectProtocol): Promise<void>;
            /**
             * 读取插件配置
             * Read the plug-in configuration
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             */
            export function getTemp(name: string, key?: string): Promise<any>;
            /**
             * 设置插件配置
             * Set the plug-in configuration
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             * @param value 配置的值 The value of the configuration
             */
            export function setTemp(name: string, key: string, value: Editor.Profile.ProfileValueType): Promise<void>;
            /**
             * 删除某个插件配置
             * Delete a plug-in configuration
             *
             * @param name 插件名 The plugin name
             * @param key 配置路径 Configure path
             */
            export function removeTemp(name: string, key: string): Promise<void>;
        }
        export namespace Project {
            /**
             * 当前项目路径
             * Current project path
             */
            export const path: string;
            /**
             * 当前项目 uuid
             * The current project UUID
             */
            export const uuid: string;
            /**
             * 当前项目名称(取自 package.json)
             * The current project name
             */
            export const name: string;
            /**
             * 当前项目临时文件夹
             * Temporary folder for current project
             */
            export const tmpDir: string;
        }
        export namespace Selection {
            /**
             * 选中一个或者一组元素
             * Select one or a group of elements
             *
             * @param type
             * @param uuid
             */
            export function select(type: string, uuid: string | string[]): void;
            /**
             * 取消一个或者一组元素的选中状态
             * To deselect one or a group of elements
             *
             * @param type
             * @param uuid
             */
            export function unselect(type: string, uuid: string | string[]): void;
            /**
             * 清空一个类型的所有选中元素
             * Clears all selected elements of a type
             *
             * @param type
             */
            export function clear(type: string): void;
            /**
             * 更新当前选中的类型数据
             * Updates the currently selected type data
             *
             * @param type
             * @param uuids
             */
            export function update(type: string, uuids: string[]): void;
            /**
             * 悬停触碰了某个元素
             * Hover touches an element
             * 会发出 selection:hover 的广播消息
             * A broadcast message for selection:hover is issued
             *
             * @param type
             * @param uuid
             */
            export function hover(type: string, uuid?: string): void;
            /**
             * 获取最后选中的元素的类型
             * Gets the type of the last selected element
             */
            export function getLastSelectedType(): string;
            /**
             * 获取某个类型内，最后选中的元素
             * Gets the last selected element of a type
             *
             * @param type
             */
            export function getLastSelected(type: string): string;
            /**
             * 获取一个类型选中的所有元素数组
             * Gets an array of all elements selected for a type
             *
             * @param type
             */
            export function getSelected(type: string): string[];
        }
        export namespace Task {
            export interface NoticeButtonOptions {
                label: string;
                target: string;
                message: string;
                params?: (string | number | boolean | (string | number | boolean)[] | {[key: string]: string | number | boolean})[];
            }
            export interface NoticeOptions {
                // 通知标题
                // Notice title
                title: string;
                // 通知内容
                // Notice content
                message?: string;
                // 消息类型
                // Notice type
                type?: 'error' | 'warn' | 'log' | 'success';
                // 来源插件
                // Notice source
                source?: string;
                // 提示上的按钮，能够触发一个插件上的消息
                // The button on the prompt can trigger a message on the plugin
                buttons?: NoticeButtonOptions[];
                // 显示时间，默认不自动消失
                // Show time, default does not disappear automatically
                timeout?: number;
            }
            /**
             * 添加一个通知
             * Add a notification
             *
             * @param options 消息配置 Message configuration
             * @return id 当前 notice ID，可用于查找移除
             */
            export function addNotice(options: NoticeOptions): number;
            /**
             * 删除一个通知
             * Delete a notification
             *
             * @param id 通知 id Notification ID
             */
            export function removeNotice(id: number): void;
            /**
             * 修改 notice 自动移除的时间
             * Modify notice automatic removal time
             *
             * @param id 通知 id Notification ID
             * @param time 超时时间 timeout
             */
            export function changeNoticeTimeout(id: number, time: number): void;
            /**
             * 查询所有通知
             * Query all notifications
             */
            export function queryNotices(): NoticeOptions[];
        }
        export namespace Theme {
            /**
             * 获取所有主题的名字
             * Gets the names of all topics
             */
            export function getList(): string[];
            /**
             * 使用某个皮肤
             * Use a certain skin
             *
             * @param name
             */
            export function use(name?: string): void;
        }
        export namespace UI {
            /**
             * 在当前页面上注册一个自定义节点
             * Registers a custom node on the current page
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             *
             * @param tagName 元素名字
             * @param element 元素的定义函数
             */
            export function register(tagName: string, element: CustomElementConstructor): void;
        }
        export namespace User {
            export interface UserData {
                session_id: string;
                session_key: string;
                cocos_uid: string;
                email: string;
                nickname: string;
            }
            export interface UserTokenData {
                access_token: string;
                cocos_uid: number;
                expires_in: number;
            }
            /**
             * 跳过 User
             * Skip the User
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             */
            export function skip(): void;
            /**
             * 获取 user 数据
             * Get user data
             */
            export function getData(): Promise<UserData>;
            /**
             * 检查用户是否登陆
             * Check if the user is logged in
             */
            export function isLoggedIn(): Promise<boolean>;
            /**
             * 用户登陆
             * The user login
             * 失败会抛出异常
             * Failure throws an exception
             *
             * @param username
             * @param password
             */
            export function login(username: string, password: string): Promise<UserData>;
            /**
             * 退出登陆
             * Logged out
             * 失败会抛出异常
             * Failure throws an exception
             */
            export function logout(): void;
            /**
             * 获取用户 token
             * Get user token
             * 失败会抛出异常
             * Failure throws an exception
             */
            export function getUserToken(): Promise<UserTokenData>;
            /**
             * 根据插件 id 返回 session code
             * Returns the session code based on the plug-in ID
             *
             * @param extensionId
             */
            export function getSessionCode(extensionId: number): Promise<string>;
            /**
             * 显示用户登陆遮罩层
             * Shows user login mask layer
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             */
            export function showMask(): void;
            /**
             * 隐藏用户登陆遮罩层
             * Hide user login mask layer
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             */
            export function hideMask(): void;
            /**
             * 监听事件
             * Listen for an event
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             * @param action
             * @param handle
             */
            export function on(action: string, handle: Function): void;
            /**
             * 监听一次事件
             * Listening for one event
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             * @param action
             * @param handle
             */
            export function once(action: string, handle: Function): void;
            /**
             * 取消已经监听的事件
             * Cancels the event you are listening for
             * 谨慎使用，之后会被移除
             * Use with caution and it will be removed later
             * @param action
             * @param handle
             */
            export function removeListener(action: string, handle: Function): void;
        }
        export namespace Utils {
            // export namespace File {
            //     /**
            //      * 初始化一个可用的文件名
            //      * Initializes a available filename
            //      * 返回可用名称的文件路径
            //      * Returns the file path with the available name
            //      *
            //      * @param file 初始文件路径 Initial file path
            //      */
            //     export function getName(file: string): string;
            //     interface UnzipOptions {
            //         peel?: boolean;
            //     }
            //     /**
            //      * 解压文件夹
            //      * Unzip folder
            //      *
            //      * @param zip
            //      * @param target
            //      * @param options
            //      */
            //     export function unzip(zip: string, target: string, options?: UnzipOptions): Promise<void>;
            //     /**
            //      * 复制一个文件到另一个位置
            //      * Copy a file to another location
            //      *
            //      * @param source
            //      * @param target
            //      */
            //     export function copy(source: string, target: string): void;

            //     export function trashItem(path: string): Promise<void>;
            // }
            // export namespace Path {
            //     /**
            //      * 返回一个不含扩展名的文件名
            //      * @param path
            //      */
            //     export function basenameNoExt(path: string): string;
            //     /**
            //      * 将 \ 统一换成 /
            //      * @param path
            //      */
            //     export function slash(path: string): string;
            //     /**
            //      * 去除路径最后的斜杆，返回一个不带斜杆的路径
            //      * @param path
            //      */
            //     export function stripSep(path: string): string;
            //     /**
            //      * 删除一个路径的扩展名
            //      * @param path
            //      */
            //     export function stripExt(path: string): string;
            //     /**
            //      * 判断路径 pathA 是否包含 pathB
            //      * pathA = foo/bar,         pathB = foo/bar/foobar, return true
            //      * pathA = foo/bar,         pathB = foo/bar,        return true
            //      * pathA = foo/bar/foobar,  pathB = foo/bar,        return false
            //      * pathA = foo/bar/foobar,  pathB = foobar/bar/foo, return false
            //      * @param pathA
            //      * @param pathB
            //      */
            //     export function contains(pathA: string, pathB: string): boolean;
            //     /**
            //      * 格式化路径
            //      * 如果是 Windows 平台，需要将盘符转成小写进行判断
            //      * @param path
            //      */
            //     export function normalize(path: string): string;
            //     export const join: typeof NodeJSPath.join;
            //     export const resolve: typeof NodeJSPath.resolve;
            //     export const isAbsolute: typeof NodeJSPath.isAbsolute;
            //     export const relative: typeof NodeJSPath.relative;
            //     export const dirname: typeof NodeJSPath.dirname;
            //     export const basename: typeof NodeJSPath.basename;
            //     export const extname: typeof NodeJSPath.extname;
            //     export const sep: '\\' | '/';
            //     export const delimiter: ';' | ':';
            //     export const parse: typeof NodeJSPath.parse;
            //     export const format: typeof NodeJSPath.format;
            // }
            // export namespace Math {
            //     /**
            //      * 取给定边界范围的值
            //      * Take the value of the given boundary range
            //      * @param {number} val
            //      * @param {number} min
            //      * @param {number} max
            //      */
            //     export function clamp(val: number, min: number, max: number): number;
            //     /**
            //      * @function clamp01
            //      * @param {number} val
            //      * @returns {number}
            //      *
            //      * Clamps a value between 0 and 1.
            //      */
            //     export function clamp01(val: number): number;
            //     /**
            //      * 加法函数
            //      * 入参：函数内部转化时会先转字符串再转数值，因而传入字符串或 number 均可
            //      * 返回值：arg1 加上 arg2 的精确结果
            //      * @param {number|string} arg1
            //      * @param {number|string} arg2
            //      */
            //     export function add(arg1: number | string, arg2: number | string): number;
            //     /**
            //      * 减法函数
            //      * 入参：函数内部转化时会先转字符串再转数值，因而传入字符串或number均可
            //      * 返回值：arg1 减 arg2的精确结果
            //      * @param {number|string} arg1
            //      * @param {number|string} arg2
            //      */
            //     export function sub(arg1: number | string, arg2: number | string): number;
            //     /**
            //      * 乘法函数
            //      * 入参：函数内部转化时会先转字符串再转数值，因而传入字符串或 number 均可
            //      * 返回值：arg1 乘 arg2 的精确结果
            //      * @param {number} arg1
            //      * @param {number} arg2
            //      */
            //     export function multi(arg1: number, arg2: number): number;
            //     /**
            //      * 除法函数
            //      * 入参：函数内部转化时会先转字符串再转数值，因而传入字符串或 number 均可
            //      * 返回值：arg1 除 arg2 的精确结果
            //      * @param {number} arg1
            //      * @param {number} arg2
            //      */
            //     export function divide(arg1: number, arg2: number): number;
            //     /**
            //      * 保留小数点
            //      * @param val
            //      * @param num
            //      */
            //     export function toFixed(val: number, num: number): number;
            // }
            // export namespace Parse {
            //     interface WhenParam {
            //         PanelName?: string;
            //         EditMode?: string;
            //         ProjectType?: string;
            //     }
            //     /**
            //      * 解析 when 参数
            //      * when 的格式：
            //      *     PanelName === '' && EditMode === ''
            //      * 整理后的数据格式：
            //      *     {
            //      *         PanelName: '',
            //      *         EditMode: '',
            //      *     }
            //      */
            //     export function when(when: string): WhenParam;
            //     /**
            //      * 判断一个 when 数据是否符合当前条件
            //      * @param when
            //      */
            //     export function checkWhen(when: string): boolean;
            // }
            // export namespace Url {
            //     /**
            //      * 快捷获取文档路径
            //      * @param relativeUrl
            //      * @param type
            //      */
            //     export function getDocUrl(relativeUrl: string, type?: 'manual' | 'api'): string;
            // }

            // export namespace UUID {
            //     /**
            //      * 压缩 UUID
            //      * compress UUID
            //      * @param uuid
            //      * @param min
            //      */
            //     export function compressUUID(uuid: string, min: boolean): string;
            //     /**
            //      * 解压 UUID
            //      * decompress the UUID
            //      * @param str
            //      */
            //     export function decompressUUID(str: string): string;
            //     /**
            //      * 检查输入字符串是否是 UUID
            //      * Check whether the input string is a UUID
            //      * @param str
            //      */
            //     export function isUUID(str: string): string;
            //     /**
            //      * 生成一个新的 uuid
            //      * compress 是否压缩，默认 true
            //      */
            //     export function generate(compress?: boolean): string;
            //     /**
            //      * 从路径中提取 UUID
            //      * ".../5b/5b9cbc23-76b3-41ff-9953-4219fdbea72c/Fontin-SmallCaps.ttf" -> "5b9cbc23-76b3-41ff-9953-4219fdbea72c"
            //      */
            //     export function getUuidFromLibPath(path: string): string;
            //     /**
            //      * 获取子资源的短 uuid
            //      * @param name 
            //      */
            //     export function nameToSubId(name: string): string;
            // }

            // export namespace Process {
            //     export enum LogLevel {
            //         LOG,
            //         WARN,
            //         ERROR,
            //         NULL,
            //     }
            //     export interface IQuickSpawnOption {
            //         cwd?: string;
            //         env?: any;
            //         // 输出等级，默认 = 0，即 log 级别以上都打印
            //         logLevel?: LogLevel;
                
            //         downGradeWaring?: boolean; // 警告将会转为 log 打印，默认为 false
            //         downGradeLog?: boolean; // log 将会转为 debug 打印，默认为 true
            //         downGradeError?: boolean; // 错误将会转为警告打印，默认为 false

            //         onlyPrintWhenError?: boolean; // 默认为 true, 日志都正常收集，但仅在发生错误时打印信息，其他时候静默处理

            //         prefix?: string; // 日志输出前缀
            //     }
            //     /**
            //      * 快速开启子进程，无需再自行监听输出，将会返回一个标记完成的 promise 对象
            //      * @param command 命令
            //      * @param cmdParams 参数数组
            //      * @param options 可选，开启的一些参数配置
            //      */
            //     export function quickSpawn(command: string, cmdParams: string[], options?: IQuickSpawnOption):Promise<boolean>;
            // }
        }
        export namespace Module {
            /**
             * 导入一个项目模块。
             * @param url 项目模块的 Database URL。
             * @experimental 实验性质。
             */
            export function importProjectModule(url: string): Promise<unknown>;
        }
        export namespace Windows {
            export function open(layout: Editor.Layout.ILayout, rect: { x: number, y: number, width: number, height: number}): void;
        }
    }
}
