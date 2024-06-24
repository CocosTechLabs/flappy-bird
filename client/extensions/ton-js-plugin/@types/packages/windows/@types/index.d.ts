/// <reference path='../../../@types/index'/>
export * from '@editor/library-type/packages/builder/@types/protected';

import { IInternalBuildOptions, InternalBuildResult } from '@editor/library-type/packages/builder/@types/protected';
import { IOptions as INativeOption } from '@editor/library-type/packages/native';

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'windows': IOptions;
        native: INativeOption;
    }
}

export interface IOptions {
    executableName: string;
    renderBackEnd: {
        vulkan: boolean;
        gles3: boolean;
        gles2: boolean;
    };
    targetPlatform: 'win32' | 'x64';
    serverMode: boolean;
    targetPlatform: 'x64';
    vsData: string;
}

export interface IBuildResult extends InternalBuildResult {
    userFrameWorks: boolean; // 是否使用用户的配置数据
}
