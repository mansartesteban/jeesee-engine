import Observer from "@/Observer"
import {
	IInterfacor,
	_BlocLayoutOptions,
	_GridLayoutOptions,
} from "@types"
import MathUtils from "@utils/MathUtils"
import { Vector2 } from "three"
import GuiLayout from "./GuiLayout"
const randomColor = () => Math.floor(Math.random() * 16777215).toString(16)

// TODO: Ne pas pouvoir resize plus loin qu'un autre élément déjà existant (exemple: le bandeau de gauche doit limiter sont redimmensionnement au début du bandeau de droite)
// TODO: Pouvoir déplacer les blocs
// TODO: Enregirster la position des blocs
// TODO: Lorsque l'on redimensionne d'un côté pûis de l'autre, le bloc revient à sa position de départ (rendre les données réactives)

// TODO: Voir s'il ne serait pas mieux de passer tous les élements en position absolute et gérer moi même la grid (tout n'est pas totalement à refaire comme les fonctions de calcul des grilles par exemple)
// TODO: Du coup je pourrais plus facilement gérer les transitions, utiliser un lerp > .5

// TODO: Plutôt que de calculer les positions des blocs à chaque repostionnement ou chaque resize, avoir une gestion de "constraints"

/* 
	TODO:
	Plutôt que de m'embêter à calculer tout les snappings comme je fait il faudrait :
	- Récupérer les coordonnées des 4 coins de chaque bloc
	- Rechercher tous les autres blocs qui ont soit :
		- Un coin proche
		- Un ligne proche
	- Recherche le plus proche et s'il est dans la zome d'aimantage, affecter ses coordonnées


	REGARDER DU COTE DES BOXCOLLIDER
*/

class BlocLayout implements IInterfacor {
	static EVENTS = Object.freeze({
		BLOC_RESIZE: "BLOC_RESIZE",
		BLOC_MOVE: "BLOC_MOVE",
	})

	options: _BlocLayoutOptions = {
		zIndex: 1,
		resizableX: true,
		resizableY: true,
		actionBar: true,
		snapStrength: 5,
	}

	node: HTMLElement | null = null
	layout: GuiLayout

	position: {
		from: Vector2
		to: Vector2
		size: Vector2
	} = {
			from: new Vector2(),
			to: new Vector2(),
			size: new Vector2(),
		}

	observer: Observer = new Observer(BlocLayout.EVENTS)

	constructor(options: _BlocLayoutOptions, layout: GuiLayout) {
		if (options) {
			this.options = { ...this.options, ...options }
		}

		if (options.x !== undefined) {
			this.position.from.x = options.x
			if (options.width !== undefined) {
				this.position.size.x = options.width
				this.position.to.x = options.x + options.width
			}
		}

		if (options.y !== undefined) {
			this.position.from.y = options.y
			if (options.height !== undefined) {
				this.position.size.y = options.height
				this.position.to.y = options.y + options.height
			}
		}

		this.layout = layout

		this.createElement()
	}

	createElement(): void {
		this.node = document.createElement("div")
		this.node.classList.add("layout-bloc", "resizable", this.options.class || "")

		if (this.options.zIndex) {
			this.node.style.zIndex = this.options.zIndex.toString()
		}

		//TODO: Only for debug
		this.node.style.background = "#" + randomColor()

		this.observer.$on(
			[
				BlocLayout.EVENTS.BLOC_RESIZE,
				BlocLayout.EVENTS.BLOC_MOVE
			],
			this.reposition.bind(this)
		)


		this.createResizers()
		this.makeMovable()

		this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
	}

	makeMovable() {
		if (this.node) {
			this.node.addEventListener("mousedown", (e) => {
				e.stopPropagation()
				console.log("clicked")

				let originalClick = GuiLayout.getScreenPosition(e.clientX, e.clientY)
				let deltaClick = new Vector2(
					originalClick.x - this.position.from.x,
					originalClick.y - this.position.from.y
				)


				console.log("delta", deltaClick)
				const mouseMoveHandler = (e: MouseEvent) => {

					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let xTo = mousePosition.x - deltaClick.x + this.position.size.x
					let yTo = mousePosition.y - deltaClick.y + this.position.size.y
					let xFrom = mousePosition.x - deltaClick.x
					let yFrom = mousePosition.y - deltaClick.y

					let nearBloc
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xTo - bl.position.from.x) < (this.options.snapStrength || 0)
					)
					if (nearBloc) {
						xTo = nearBloc.position.from.x
						xFrom = xTo - this.position.size.x
						console.log(xTo, xFrom)
					}

					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(yTo - bl.position.from.y) < (this.options.snapStrength || 0)
					)
					if (nearBloc) {
						yTo = nearBloc.position.from.y
						yFrom = yTo - this.position.size.y
					}

					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xFrom - bl.position.to.x) < (this.options.snapStrength || 0)
					)
					if (nearBloc) {
						xFrom = nearBloc.position.to.x
						xTo = xFrom + this.position.size.x
					}

					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xTo - bl.position.from.x) < (this.options.snapStrength || 0)
					)
					if (nearBloc) {
						yFrom = nearBloc.position.to.y
						yTo = xFrom + this.position.size.y
					}

					// let xFrom = mousePosition.x - this.position.to.x + this.position.size.x
					// let yFrom = mousePosition.x - this.position.to.y + this.position.size.y
					console.log(xTo)
					this.position.to.x = xTo
					this.position.to.y = yTo
					this.position.from.x = xFrom
					this.position.from.y = yFrom
					// this.position.from.x = xFrom
					// this.position.from.y = yFrom
					// let yTo = mousePosition.y - this.position.from.y + this.position.size.y

					// let xFrom = mousePosition.x - this.position.from.x + this.position.size.x
					// let yFrom = mousePosition.y - this.position.from.y
					// let nearBloc = this.layout.blocs.find(bl =>
					// 	bl !== this
					// 	&&
					// 	Math.abs(xTo - bl.position.from.x) < (this.options.snapStrength || 0)
					// )
					// if (nearBloc) {
					// 	console.log("snap")
					// } else {
					// 	this.position.from.x = xTo - this.position.size.x
					// }


					// this.position.from.x += MathUtils.mapRange(e.movementX, 0, window.innerWidth, 0, 100)
					// this.position.from.y += MathUtils.mapRange(e.movementY, 0, window.innerHeight, 0, 100)
					// this.position.to.x += MathUtils.mapRange(e.movementX, 0, window.innerWidth, 0, 100)
					// this.position.to.y += MathUtils.mapRange(e.movementY, 0, window.innerHeight, 0, 100)


					// let nearBloc = this.layout.blocs.find(bl =>
					// 	bl !== this
					// 	&&
					// 	Math.abs((this.position.from.x + this.position.size.x) - bl.position.from.x) < (this.options.snapStrength || 0)
					// )

					// if (nearBloc) {
					// 	this.position.to.x = nearBloc.position.from.x
					// 	this.position.from.x = nearBloc.position.from.x - this.position.size.x
					// }

					// if (this.position.to.x > 100 - (this.options.snapStrength || 0)) {
					// 	this.position.to.x = 100
					// 	this.position.from.x = 100 - this.position.size.x
					// }

					this.observer.$emit(BlocLayout.EVENTS.BLOC_MOVE)
				}
				const mouseUpHandler = () => {
					document.removeEventListener("mousemove", mouseMoveHandler)
					document.removeEventListener("mouseup", mouseUpHandler)
				}

				document.addEventListener("mousemove", mouseMoveHandler)
				document.addEventListener("mouseup", mouseUpHandler)
			})
		}
	}

	createResizers() {
		if (this.options.resizableX) {
			this.createLeftResizer()
			this.createRightResizer()
		}
		if (this.options.resizableY) {
			this.createBottomResizer()
			this.createTopResizer()
		}
	}

	reposition() {
		if (this.node) {
			this.node.style.left = `${this.position.from.x}vw`
			this.node.style.right = `${100 - this.position.to.x}vw`
			this.node.style.top = `${this.position.from.y}vh`
			this.node.style.bottom = `${100 - this.position.to.y}vh`
		}
	}

	createRightResizer() {
		if (this.node) {
			let resizerRight = document.createElement("div")
			resizerRight.classList.add("resizer", "resizer-right")
			this.node.appendChild(resizerRight)

			resizerRight.addEventListener("mousedown", (e: MouseEvent) => {
				e.stopPropagation()
				document.body.classList.add("resize-x")

				const mouseMoveHandler = (e: MouseEvent) => {
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.x - bl.position.from.x) < (this.options.snapStrength || 0)
					)

					this.position.to.x = nearBloc?.position.from.x || mousePosition.x
					if (this.position.to.x > 100 - (this.options.snapStrength || 0)) {
						this.position.to.x = 100
					}
					this.position.size.x = this.position.to.x - this.position.from.x
					this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
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
	}

	createLeftResizer() {
		if (this.node) {
			let resizerLeft = document.createElement("div")
			resizerLeft.classList.add("resizer", "resizer-left")
			this.node.appendChild(resizerLeft)

			resizerLeft.addEventListener("mousedown", () => {
				document.body.classList.add("resize-x")

				const mouseMoveHandler = (e: MouseEvent) => {
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.x - bl.position.to.x) < (this.options.snapStrength || 0)
					)

					if (mousePosition.x <= this.position.to.x) {
						this.position.from.x = nearBloc?.position.to.x || mousePosition.x

						if (this.position.from.x < (this.options.snapStrength || 0)) {
							this.position.from.x = 0
						}

						this.position.size.x = this.position.to.x - this.position.from.x
						this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
					}
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
	}

	createTopResizer() {
		if (this.node) {
			let resizerTop = document.createElement("div")
			resizerTop.classList.add("resizer", "resizer-top")
			this.node.appendChild(resizerTop)

			resizerTop.addEventListener("mousedown", () => {
				document.body.classList.add("resize-y")

				const mouseMoveHandler = (e: MouseEvent) => {
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.y - bl.position.to.y) < (this.options.snapStrength || 0)
					)
					if (mousePosition.y <= this.position.to.y) {
						this.position.from.y = nearBloc?.position.to.y || mousePosition.y
						if (this.position.from.y < (this.options.snapStrength || 0)) {
							this.position.from.y = 0
						}
						this.position.size.y = this.position.to.y - this.position.from.y
						this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
					}
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

	createBottomResizer() {
		if (this.node) {
			let resizerBottom = document.createElement("div")
			resizerBottom.classList.add("resizer", "resizer-bottom")
			this.node.appendChild(resizerBottom)

			resizerBottom.addEventListener("mousedown", () => {
				document.body.classList.add("resize-y")

				const mouseMoveHandler = (e: MouseEvent) => {
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.y - bl.position.from.y) < (this.options.snapStrength || 0)
					)
					this.position.to.y = nearBloc?.position.from.y || mousePosition.y
					if (this.position.to.y > 100 - (this.options.snapStrength || 0)) {
						this.position.to.y = 100
					}
					this.position.size.y = this.position.to.y - this.position.from.y
					this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
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
}

export default BlocLayout
