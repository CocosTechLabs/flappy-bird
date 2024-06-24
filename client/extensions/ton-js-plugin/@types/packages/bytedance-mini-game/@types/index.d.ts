/// <reference path='../../../@types/index'/>

export * from '@editor/library-type/packages/builder/@types/protected';

import { IInternalBuildOptions } from '@editor/library-type/packages/builder/@types/protected';

export type IOrientation = 'auto' | 'landscape' | 'portrait';

export interface IOptions {
    appid: string;
    buildOpenDataContextTemplate: boolean;
    orientation: IOrientation;
    physX: {
        use: 'physX' | 'project';
        notPackPhysXLibs: boolean;
        mutiThread: boolean;
        subThreadCount: number;
        epsilon: number;
    };

    subpackages?: { name: string, root: string }[];
    wasmSubpackage: boolean;
}

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'bytedance-mini-game': IOptions;
    };
}
