import { _BlocLayoutOptions, _BlocLayoutPosition, _GridLayoutOptions } from "@types"
import MathUtils from "@utils/MathUtils"
import { Vector2 } from "three"
import BlocLayout from "./BlocLayout"


//TODO: actionBar: boolean (reduce, close)

class GuiLayout {

    blocs: BlocLayout[] = []
    node: HTMLElement | null

    constructor() {
        this.node = document.getElementById("jeesee-engine")
    }

    importLayout(blocs: _BlocLayoutPosition[]) {
        this.clear()
        blocs.forEach((bloc: _BlocLayoutPosition) => {
            this.addBloc(this.transformBlocData(bloc))
        })
    }
    exportLayout(): _BlocLayoutPosition[] {
        return this.blocs.map(bloc => bloc.position)
    }

    transformBlocData(datas: _BlocLayoutPosition): _BlocLayoutOptions {
        let transformed = {
            x: datas.from.x,
            y: datas.from.y,
            width: datas.size.x,
            height: datas.size.y
        }
        return transformed
    }

    clear() {
        this.blocs.forEach(bloc => {
            if (bloc.node) {
                this.node?.removeChild(bloc.node)
            }
        })
        this.blocs.splice(0, this.blocs.length)
    }

    addBloc(options: _BlocLayoutOptions) {

        if (this.node) {
            let bloc = new BlocLayout(options, this)
            this.blocs.push(bloc)
            if (bloc.node) {
                this.node.appendChild(bloc.node)
            }
        }

    }

    static getScreenPosition(x: number, y: number): Vector2 {
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
