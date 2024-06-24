/// <reference path='../../../@types/index'/>

export * from '@editor/library-type/packages/builder/@types/protected';
import { IInternalBuildOptions, IPolyFills, ISettings } from '@editor/library-type/packages/builder/@types/protected';

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'taobao-creative-app': {
            // TODO: Taobao doesn't support landscape
            // deviceOrientation: IOrientation;
            globalVariable: string;
        };
    };
}
