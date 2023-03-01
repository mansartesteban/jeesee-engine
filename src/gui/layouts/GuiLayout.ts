import { _BlocLayoutOptions, _GridLayoutOptions } from "@types"
import MathUtils from "@utils/MathUtils"
import BlocLayout from "./BlocLayout"

class GuiLayout {

    blocs: BlocLayout[] = []
    gridOptions: _GridLayoutOptions = {
        rows: 10,
        columns: 10
    }
    node: HTMLElement | null

    constructor(gridOptions: _GridLayoutOptions) {
        this.gridOptions = {...this.gridOptions, ...gridOptions}
        this.node = document.getElementById("jeesee-engine")
        
        this.createLayout()
    }

    createLayout() {
        if (this.node) {
            this.node.style.gridTemplateColumns = `repeat(${this.gridOptions.columns}, 1fr)`
            this.node.style.gridTemplateRows = `repeat(${this.gridOptions.rows}, 1fr)`
        }
    }

    //TODO: actionBar: boolean (reduce, close)
    //TODO: resizable
    addBloc(options: _BlocLayoutOptions) {
        
        if (this.node) {
            let bloc = new BlocLayout(options, this.gridOptions)
            this.blocs.push(bloc)
            if (bloc.node) {
                this.node.appendChild(bloc.node)
            }
        }
    }

    static getGridPosition(x: number, y: number, gridOptions: _GridLayoutOptions) {
        return {
            x: Math.floor(MathUtils.mapRange(x, 0, window.innerWidth, 0, gridOptions.columns || 1)),
            y: Math.floor(MathUtils.mapRange(y, 0, window.innerHeight, 0, gridOptions.rows || 1))
        }
    }


}

export default GuiLayout
