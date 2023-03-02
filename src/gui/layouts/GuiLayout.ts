import { _BlocLayoutOptions, _GridLayoutOptions } from "@types"
import MathUtils from "@utils/MathUtils"
import { Vector2 } from "three"
import BlocLayout from "./BlocLayout"

class GuiLayout {

    blocs: BlocLayout[] = []
    gridOptions: _GridLayoutOptions = {
        rows: 10,
        columns: 10
    }
    node: HTMLElement | null

    constructor() {
        // this.gridOptions = {...this.gridOptions, ...gridOptions}
        this.node = document.getElementById("jeesee-engine")
        
        this.createLayout()
    }

    createLayout() {
        if (this.node) {
            // this.node.style.width = this.op
            // this.node.style.gridTemplateColumns = `repeat(${this.gridOptions.columns}, 1fr)`
            // this.node.style.gridTemplateRows = `repeat(${this.gridOptions.rows}, 1fr)`
        }
    }

    //TODO: actionBar: boolean (reduce, close)
    //TODO: resizable
    addBloc(options: _BlocLayoutOptions) {
        
        if (this.node) {
            let bloc = new BlocLayout(options, this)
            this.blocs.push(bloc)
            if (bloc.node) {
                this.node.appendChild(bloc.node)
            }
        }
    }

    static getScreenPosition(x: number, y: number) :Vector2 {
        let coordinate = new Vector2(
            MathUtils.mapRange(x, 0, window.innerWidth, 0, 100),
            MathUtils.mapRange(y, 0, window.innerHeight, 0, 100)
        )
        if (coordinate.x > 100) coordinate.x = 100
        if (coordinate.x < 0) coordinate.x = 0
        if (coordinate.y > 100) coordinate.y = 100
        if (coordinate.y < 0) coordinate.y = 0
        return coordinate
    }


}

export default GuiLayout
