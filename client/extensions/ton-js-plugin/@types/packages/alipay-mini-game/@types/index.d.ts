/// <reference path='../../../@types/index'/>

export * from '@editor/library-type/packages/builder/@types/protected';
import { IInternalBuildOptions, IPolyFills, ISettings } from '@editor/library-type/packages/builder/@types/protected';

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'alipay-mini-game': {
            deviceOrientation: IOrientation;
            separateEngine: boolean;
            subpackages?: { name: string, root: string }[];
            wasmSubpackage: boolean;
        };
    };
}
