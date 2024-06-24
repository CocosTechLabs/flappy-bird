/// <reference path='../../../@types/index.d.ts'/>

import { IBuildTaskOption } from '@editor/library-type/packages/builder/@types/public';

export * from '@editor/library-type/packages/builder/@types/protected';

export interface ITaskOptions extends IBuildTaskOption {
    packages: { 'adsense-h5g-plugin': IOptions };
}

export interface IOptions {
    adsensePropertyCode: string;
    enableTestAd: boolean;
    AFPHostPropertyCode: string;
    otherAFPHostPropertyCode: boolean;
}