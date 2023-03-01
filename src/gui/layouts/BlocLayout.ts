import { IInterfacor, _BlocLayoutOptions, _GridLayoutOptions } from "@types"
import MathUtils from "@utils/MathUtils"
import GuiLayout from "./GuiLayout";
const randomColor = () => Math.floor(Math.random()*16777215).toString(16);
// TODO: Extends ResizableGridBloc



// TODO: Ne pas pouvoir resizer quand on est sur les bord
// TODO: Ne pas pouvoir resize plus loin qu'un autre élément déjà existant (exemple: le bandeau de gauche doit limiter sont redimmensionnement au début du bandeau de droite)
// TODO: Pouvoir déplacer les blocs
// TODO: Enregirster la position des blocs
// TODO: Lorsque l'on redimensionne d'un côté pûis de l'autre, le bloc revient à sa position de départ (rendre les données réactives)




class BlocLayout implements IInterfacor {
	options: _BlocLayoutOptions = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
        zIndex: 1,
		resizableX: true,
		resizableY: true,
		actionBar: true,
	}
	node: Node | null = null
    gridOptions: _GridLayoutOptions

	constructor(options: _BlocLayoutOptions, gridOptions: _GridLayoutOptions) {
		if (options) {
            this.options = { ...this.options, ...options }
		}
        this.gridOptions = gridOptions

		this.createElement()
	}

	createElement(): void {
		let bloc = document.createElement("div")
		bloc.classList.add("layout-bloc", "resizable")

		if (this.options.x || this.options.x === 0) {
			bloc.style.gridColumn = `${this.options.x + 1} / span ${this.options.width}`
		}
		if (this.options.y || this.options.y === 0) {
			bloc.style.gridRow = `${this.options.y + 1} / span ${this.options.height}`
		}
        if (this.options.zIndex) {
            bloc.style.zIndex = this.options.zIndex.toString()
        }

        bloc.style.background = "#" + randomColor()
		this.createResizers(bloc, this.gridOptions)

		this.node = bloc
	}

	createResizers(bloc: Node, gridOptions: _GridLayoutOptions) {
        if (this.options.resizableX) {
            this.createLeftResizer(bloc, gridOptions)   
            this.createRightResizer(bloc, gridOptions)   
        }
        if (this.options.resizableY) {
            this.createBottomResizer(bloc, gridOptions)   
            this.createTopResizer(bloc, gridOptions)   
        }
	}

    createRightResizer(bloc: Node, gridOptions: _GridLayoutOptions) {
		let resizerRight = document.createElement("div")
		resizerRight.classList.add("resizer", "resizer-right")
		bloc.appendChild(resizerRight)

		
        resizerRight.addEventListener("mousedown", () => {
            document.body.classList.add("resize-x")

            const mouseMoveHandler = (e: MouseEvent) => {
                let position = GuiLayout.getGridPosition(e.clientX, e.clientY, gridOptions) 
                ;(bloc as HTMLElement).style.gridColumn = `${this.options?.x || 0 + 1} / span ${position.x + 1}`

            }
            const mouseUpHandler = () => {
                document.body.classList.remove("resize-x")
                document.removeEventListener("mousemove", mouseMoveHandler)
                document.removeEventListener("mouseup", mouseUpHandler)
            }

            document.addEventListener("mousemove", mouseMoveHandler)
            document.addEventListener("mouseup", mouseUpHandler)
		})
    }

    createLeftResizer(bloc: Node, gridOptions: _GridLayoutOptions) {
		let resizerLeft = document.createElement("div")
		resizerLeft.classList.add("resizer", "resizer-left")
		bloc.appendChild(resizerLeft)

        resizerLeft.addEventListener("mousedown", () => {
            document.body.classList.add("resize-x")

            const mouseMoveHandler = (e: MouseEvent) => {
                let position = GuiLayout.getGridPosition(e.clientX, e.clientY, gridOptions) 
                let originalAnchor =  (this.options.x || 0) + 1 + (this.options.width || 0)
                ;(bloc as HTMLElement).style.gridColumn = `${position.x + 1} / span ${originalAnchor - position.x}`

            }
            const mouseUpHandler = () => {
                document.body.classList.remove("resize-x")
                document.removeEventListener("mousemove", mouseMoveHandler)
                document.removeEventListener("mouseup", mouseUpHandler)
            }

            document.addEventListener("mousemove", mouseMoveHandler)
            document.addEventListener("mouseup", mouseUpHandler)
		})
    }

    createTopResizer(bloc: Node, gridOptions: _GridLayoutOptions) {
        let resizerTop = document.createElement("div")
		resizerTop.classList.add("resizer", "resizer-top")
		bloc.appendChild(resizerTop)

		resizerTop.addEventListener("mousedown", () => {
            document.body.classList.add("resize-y")

            const mouseMoveHandler = (e: MouseEvent) => {
                let position = GuiLayout.getGridPosition(e.clientX, e.clientY, gridOptions) 
                let originalAnchor =  (this.options.y || 0) + 1 + (this.options.height || 0)
                ;(bloc as HTMLElement).style.gridRow = `${position.y + 1} / span ${originalAnchor - position.y}`

            }
            const mouseUpHandler = () => {
                document.body.classList.remove("resize-y")
                document.removeEventListener("mousemove", mouseMoveHandler)
                document.removeEventListener("mouseup", mouseUpHandler)
            }

            document.addEventListener("mousemove", mouseMoveHandler)
            document.addEventListener("mouseup", mouseUpHandler)
		})
    }

    createBottomResizer(bloc: Node, gridOptions: _GridLayoutOptions) {
        let resizerBottom = document.createElement("div")
		resizerBottom.classList.add("resizer", "resizer-bottom")
		bloc.appendChild(resizerBottom)
        
		resizerBottom.addEventListener("mousedown", () => {
            document.body.classList.add("resize-y")

            const mouseMoveHandler = (e: MouseEvent) => {
                let position = GuiLayout.getGridPosition(e.clientX, e.clientY, gridOptions) 
                ;(bloc as HTMLElement).style.gridRow = `${this.options?.y || 0 + 1} / span ${position.y + 1}`

            }
            const mouseUpHandler = () => {
                document.body.classList.remove("resize-y")
                document.removeEventListener("mousemove", mouseMoveHandler)
                document.removeEventListener("mouseup", mouseUpHandler)
            }

            document.addEventListener("mousemove", mouseMoveHandler)
            document.addEventListener("mouseup", mouseUpHandler)
		})
    }
}

export default BlocLayout
