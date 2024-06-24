import { _decorator, Canvas, CCBoolean, CCInteger, Component, Node, ResolutionPolicy, View } from 'cc';
import { LogManager } from '../../scripts/framework/common/LogManager';
const { ccclass, property } = _decorator;

@ccclass('ResolutionAdjuster')
export class ResolutionAdjuster extends Component {
    @property(CCInteger)
    fixedWidthDesignWidth: number = 1280;
    @property(CCInteger)
    fixedWidthDesignHeight: number = 720;

    @property(CCInteger)
    fixedHeightDesignWidth: number = 720;
    @property(CCInteger)
    fixedHeightDesignHeight: number = 1280;

    @property(CCBoolean)
    isAutoFit: boolean = true;

    protected onLoad(): void {
        if (this.isAutoFit)
        {
            this.autoFit();
            window.addEventListener('resize', this.autoFit.bind(this));
            // Screen.on('orientation-change', this.autoFit.bind(this));
        }
    }

    protected start(): void {
        if (this.isAutoFit)
        {
            this.autoFit();
        }
    }

    private autoFit(): void {

        let designSize = View.instance.getDesignResolutionSize();
        // console.log(`desginSize = ${designSize}`);

        // let visibleSize = View.instance.getVisibleSize();
        // console.log(`visibleSize = ${visibleSize}`);

        let viewPortRect = View.instance.getViewportRect();
        View.instance.setOrientation
        console.log(`viewPortRect = ${viewPortRect}`);
        
        let rateR = designSize.height / designSize.width;
        let rateV = Math.abs(viewPortRect.size.height) / Math.abs(viewPortRect.size.width);
        
        // let rp = ResolutionPolicy.FIXED_HEIGHT;
        // if (rateV < 1.0)
        // {
        //     rp = ResolutionPolicy.FIXED_WIDTH;
        // }

        console.log(`rateV = ${rateV}`)
        if (rateV < 1.0)
        {
            View.instance.setDesignResolutionSize(this.fixedWidthDesignWidth, this.fixedWidthDesignHeight, ResolutionPolicy.FIXED_WIDTH);
        }
        else
        {
            View.instance.setDesignResolutionSize(this.fixedHeightDesignWidth, this.fixedHeightDesignHeight, ResolutionPolicy.FIXED_HEIGHT);
        }
    }
}


