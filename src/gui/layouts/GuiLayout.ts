import MiniVector2 from "@/core/geometry/MiniVector2";
import { _BlocLayoutOptions, _BlocLayoutPosition, _GridLayoutOptions } from "@types";
import MathUtils from "@utils/MathUtils";
import BlocLayout from "./BlocLayout";
import Interfacor from "./Interfacor";

class GuiLayout extends Interfacor {

    blocs: BlocLayout[] = [];

    constructor() {
        super();

        this.createElement();
    }

    createElement() {
        this.node = document.getElementById("jeesee-engine");
    }

    importLayout(blocs: _BlocLayoutPosition[]) {
        this.clear();
        blocs.forEach((bloc: any) => {
            let blocInstance = new BlocLayout({ actionBar: bloc.actionBar });
            blocInstance.isMinimized = bloc.isMinimized;
            blocInstance.currentPosition = bloc.currentPosition;
            blocInstance.savedPosition = bloc.savedPosition;
            blocInstance.targetPosition = bloc.targetPosition;
            blocInstance.setLayout(this);
            this.addBloc(blocInstance);
            if (bloc.isClosed) {
                blocInstance.close();
            }
        });
    }
    exportLayout(): any { //TODO: Attention au any
        return this.blocs.map(bloc => ({
            isMinimized: bloc.isMinimized,
            isClosed: bloc.isClosed,
            currentPosition: bloc.currentPosition,
            savedPosition: bloc.savedPosition,
            targetPosition: bloc.targetPosition,
            actionBar: bloc.options.actionBar
        }));
    }

    transformBlocData(datas: _BlocLayoutPosition): _BlocLayoutOptions {
        let transformed = {
            x: datas.from.x,
            y: datas.from.y,
            width: datas.size.x,
            height: datas.size.y
        };
        return transformed;
    }

    clear() {
        console.log(this.blocs);
        this.blocs.forEach(bloc => {
            if (bloc.node && !bloc.isClosed) {
                this.node?.removeChild(bloc.node);
            }
        });
        this.blocs.splice(0, this.blocs.length);
    }

    addBloc(bloc: BlocLayout): this {
        bloc.setLayout(this);
        this.blocs.push(bloc);
        if (this.node && bloc.node) {
            this.node.appendChild(bloc.node);
        }
        return this;
    }

    static getMouseLayoutPosition(x: number, y: number): MiniVector2 {
        let coordinate = new MiniVector2(
            x * (100 / window.innerWidth),
            y * (100 / window.innerHeight)
        );
        if (coordinate.x > 100) coordinate.x = 100;
        if (coordinate.x < 0) coordinate.x = 0;
        if (coordinate.y > 100) coordinate.y = 100;
        if (coordinate.y < 0) coordinate.y = 0;
        return coordinate;
    }

}

export default GuiLayout;
