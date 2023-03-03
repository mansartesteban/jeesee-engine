import MiniVector2 from "@/core/geometry/MiniVector2"
import Observer from "@/Observer"
import {
	IInterfacor,
	_BlocLayoutOptions,
	_BlocLayoutPosition,
	_GridLayoutOptions,
} from "@types"
import { Vector2 } from "three"
import GuiLayout from "./GuiLayout"

// TODO: Ne pas pouvoir resize plus loin qu'un autre élément déjà existant (exemple: le bandeau de gauche doit limiter sont redimmensionnement au début du bandeau de droite)
// TODO: Pouvoir déplacer les blocs
// TODO: Enregirster la position des blocs
// TODO: Lorsque l'on redimensionne d'un côté pûis de l'autre, le bloc revient à sa position de départ (rendre les données réactives)

// TODO: Voir s'il ne serait pas mieux de passer tous les élements en position absolute et gérer moi même la grid (tout n'est pas totalement à refaire comme les fonctions de calcul des grilles par exemple)
// TODO: Du coup je pourrais plus facilement gérer les transitions, utiliser un lerp > .5

// TODO: Plutôt que de calculer les positions des blocs à chaque repostionnement ou chaque resize, avoir une gestion de "constraints"
// TODO: Vérifier la distance entre les blocs sur les autres axes, ne pas snapper sur les blocs qui ne sont pas proches
// TODO: Créer les resizer sur les coins

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
		snapStrength: 1.5,
		resizerSize: 12
	}

	node: HTMLElement | null = null
	layout: GuiLayout

	position: _BlocLayoutPosition = {
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

		// TODO: Globaliser les variables d'accessibilité + Fichier de préférence utilisateur + Enregistrement
		if (this.options.resizerSize) {
			document.documentElement.style.setProperty("--a13y-resizer-size", this.options.resizerSize + "px")
		}

		this.layout = layout

		this.createElement()
	}

	createElement(): void {
		this.node = document.createElement("div")
		this.node.classList.add("layout-bloc", "resizable")

		if (this.options.zIndex) {
			this.node.style.zIndex = this.options.zIndex.toString()
		}

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

			let snapStrength = this.options.snapStrength || 0

			this.node.addEventListener("mousedown", (e) => {
				e.preventDefault()
				e.stopPropagation()

				if (this.node) {
					this.node.classList.toggle("moving", true)
				}

				let originalClick = GuiLayout.getScreenPosition(e.clientX, e.clientY)
				let deltaClick = new Vector2(
					originalClick.x - this.position.from.x,
					originalClick.y - this.position.from.y
				)

				const mouseMoveHandler = (e: MouseEvent) => {

					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let xTo = mousePosition.x - deltaClick.x + this.position.size.x
					let yTo = mousePosition.y - deltaClick.y + this.position.size.y
					let xFrom = mousePosition.x - deltaClick.x
					let yFrom = mousePosition.y - deltaClick.y

					let isLeftSnapped = false
					let isRightSnapped = false
					let isTopSnapped = false
					let isBottomSnapped = false

					let nearBloc

					// Current bloc right side on other blocs left sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xTo - bl.position.from.x) < snapStrength
						&&
						bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
					)
					if (nearBloc) {
						xTo = nearBloc.position.from.x
						xFrom = xTo - this.position.size.x
						isRightSnapped = true
					}

					// Current bloc bottom side on other blocs top sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(yTo - bl.position.from.y) < snapStrength
						&&
						bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
					)
					if (nearBloc) {
						yTo = nearBloc.position.from.y
						yFrom = yTo - this.position.size.y
						isBottomSnapped = true
					}

					// Current bloc left side on other blocs right sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xFrom - bl.position.to.x) < snapStrength
						&&
						bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
					)
					if (nearBloc) {
						xFrom = nearBloc.position.to.x
						xTo = xFrom + this.position.size.x
						isLeftSnapped = true
					}

					// Current bloc top side on other blocs bottom sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(yFrom - bl.position.to.y) < snapStrength
						&&
						bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
					)
					if (nearBloc) {
						yFrom = nearBloc.position.to.y
						yTo = yFrom + this.position.size.y
						isTopSnapped = true
					}

					// Current bloc right side on other blocs right sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xTo - bl.position.to.x) < snapStrength
						&&
						bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
					)
					if (nearBloc) {
						xTo = nearBloc.position.to.x
						xFrom = xTo - this.position.size.x
						isRightSnapped = true
					}

					// Current bloc bottom side on other blocs bottom sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(yTo - bl.position.to.y) < snapStrength
						&&
						bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
					)
					if (nearBloc) {
						yTo = nearBloc.position.to.y
						yFrom = yTo - this.position.size.y
						isBottomSnapped = true
					}

					// Current bloc left side on other blocs left sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(xFrom - bl.position.from.x) < snapStrength
						&&
						bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
					)
					if (nearBloc) {
						xFrom = nearBloc.position.from.x
						xTo = xFrom + this.position.size.x
						isLeftSnapped = true
					}

					// Current bloc top side on other blocs top sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(yFrom - bl.position.from.y) < snapStrength
						&&
						bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
					)
					if (nearBloc) {
						yFrom = nearBloc.position.from.y
						yTo = yFrom + this.position.size.y
						isTopSnapped = true
					}

					// Make bloc not movable outside of container by the left
					if (xFrom < snapStrength) {
						xFrom = 0
						xTo = this.position.size.x
						isLeftSnapped = true
					}

					// Make bloc not movable outside of container by the right
					if (xTo > 100 - snapStrength) {
						xFrom = 100 - this.position.size.x
						xTo = 100
						isRightSnapped = true
					}

					// Make bloc not movable outside of container by the top
					if (yFrom < snapStrength) {
						yFrom = 0
						yTo = this.position.size.y
						isTopSnapped = true
					}

					// Make bloc not movable outside of container by the bottom
					if (yTo > 100 - snapStrength) {
						yFrom = 100 - this.position.size.y
						yTo = 100
						isBottomSnapped = true
					}

					this.position.to.x = xTo
					this.position.to.y = yTo
					this.position.from.x = xFrom
					this.position.from.y = yFrom
					this.observer.$emit(BlocLayout.EVENTS.BLOC_MOVE)

					if (this.node) {
						this.node.classList.toggle("resizing-right", isRightSnapped)
						this.node.classList.toggle("resizing-left", isLeftSnapped)
						this.node.classList.toggle("resizing-top", isTopSnapped)
						this.node.classList.toggle("resizing-bottom", isBottomSnapped)
					}

				}

				const mouseUpHandler = () => {
					if (this.node) {
						this.node.classList.toggle("resizing-right", false)
						this.node.classList.toggle("resizing-left", false)
						this.node.classList.toggle("resizing-top", false)
						this.node.classList.toggle("resizing-bottom", false)
						this.node.classList.toggle("moving", false)
					}
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
			// this.createRightResizer()
			this.createGenericResizer("right")
		}
		if (this.options.resizableY) {
			this.createTopResizer()
			// this.createBottomResizer()
			this.createGenericResizer("bottom")
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

	createGenericResizer(side: string) {

		// Les variables à utiliser
		let axe = ["right", "left"].includes(side) ? "x" : "y"
		let crossAxe = axe === "x" ? "y" : "x"

		// La fonction commence ici
		if (this.node) {
			let snapStrength = this.options.snapStrength || 0
			let resizer = document.createElement("div")
			resizer.classList.add("resizer", "resizer-" + side)

			this.node.appendChild(resizer)

			resizer.addEventListener("mousedown", (e: MouseEvent) => {
				e.preventDefault()
				e.stopPropagation()
				document.body.classList.add("resize-" + axe)

				if (this.node) {
					this.node.classList.add("resizing-" + side)
					this.node.classList.toggle("moving", true)

					const mouseMoveHandler = (e: MouseEvent) => {
						e.preventDefault()
						e.stopPropagation()
						let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)
						// let mousePosition = new NanoVector2(GuiLayout.getScreenPosition(e.clientX, e.clientY))

						// Ici toute la logique de positionnement




						// =====================================================================================





						let pos = (mousePosition[axe as keyof MiniVector2])

						let nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs((mousePosition[axe as keyof MiniVector2] as number) - (bl.position.from[axe as keyof MiniVector2] as number)) < snapStrength
							&&
							bl.position.to[crossAxe as keyof MiniVector2] > ((this.position.from[crossAxe as keyof MiniVector2] as number) - snapStrength)
							&&
							bl.position.from[crossAxe as keyof MiniVector2] < ((this.position.to[crossAxe as keyof MiniVector2] as number) + snapStrength)
						)
						if (nearBloc) {
							pos = nearBloc.position.from[axe as keyof MiniVector2] as number
						}

						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs((mousePosition[axe as keyof MiniVector2] as number) - (bl.position.to[axe as keyof MiniVector2] as number)) < snapStrength
							&&
							bl.position.to[crossAxe as keyof MiniVector2] > ((this.position.from[crossAxe as keyof MiniVector2] as number) - snapStrength)
							&&
							bl.position.from[crossAxe as keyof MiniVector2] < ((this.position.to[crossAxe as keyof MiniVector2] as number) + snapStrength)
						)
						if (nearBloc) {
							pos = nearBloc.position.to[axe as keyof MiniVector2] as number
						}
						if (pos > 100 - snapStrength) {
							pos = 100
						}
						this.position.to[axe as keyof MiniVector2] = pos >= this.position.from[axe as keyof MiniVector2] + snapStrength ? pos : this.position.from[axe as keyof MiniVector2]
						this.position.size[axe as keyof MiniVector2] = this.position.to[axe as keyof MiniVector2] - this.position.from[axe as keyof MiniVector2]



						// =====================================================================================



						this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
					}

					const mouseUpHandler = (e: MouseEvent) => {
						e.preventDefault()
						e.stopPropagation()
						document.body.classList.toggle("resize-" + axe, false)
						if (this.node) {
							this.node.classList.toggle("resizing-" + side, false)
							this.node.classList.toggle("moving", false)
						}
						document.removeEventListener("mousemove", mouseMoveHandler)
						document.removeEventListener("mouseup", mouseUpHandler)
					}
					document.addEventListener("mousemove", mouseMoveHandler)
					document.addEventListener("mouseup", mouseUpHandler)
				}

			})
		}
	}

	createRightResizer() {
		if (this.node) {

			let snapStrength = this.options.snapStrength || 0

			let resizerRight = document.createElement("div")
			resizerRight.classList.add("resizer", "resizer-right")
			this.node.appendChild(resizerRight)

			resizerRight.addEventListener("mousedown", (e: MouseEvent) => {
				e.preventDefault()
				e.stopPropagation()
				document.body.classList.add("resize-x")

				if (this.node) {
					this.node.classList.add("resizing-right")
					this.node.classList.toggle("moving", true)
				}

				const mouseMoveHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let xPos = mousePosition.x
					// Current bloc right side on other blocs left sides
					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.x - bl.position.from.x) < snapStrength
						&&
						bl.position.to.y > (this.position.from.y - snapStrength) && bl.position.from.y < (this.position.to.y + snapStrength)
					)
					if (nearBloc) {
						xPos = nearBloc.position.from.x
					}

					// Current bloc right side on other blocs right sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.x - bl.position.to.x) < snapStrength
						&&
						bl.position.to.y > (this.position.from.y - snapStrength) && bl.position.from.y < (this.position.to.y + snapStrength)
					)
					if (nearBloc) {
						xPos = nearBloc.position.to.x
					}

					if (xPos > 100 - snapStrength) {
						xPos = 100
					}

					this.position.to.x = xPos >= this.position.from.x + snapStrength ? xPos : this.position.from.x
					this.position.size.x = this.position.to.x - this.position.from.x
					this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
				}
				const mouseUpHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					document.body.classList.toggle("resize-x", false)
					if (this.node) {
						this.node.classList.toggle("resizing-right", false)
						this.node.classList.toggle("moving", false)

					}
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

			let snapStrength = this.options.snapStrength || 0

			let resizerLeft = document.createElement("div")
			resizerLeft.classList.add("resizer", "resizer-left")
			this.node.appendChild(resizerLeft)

			resizerLeft.addEventListener("mousedown", (e: MouseEvent) => {
				e.preventDefault()
				e.stopPropagation()
				document.body.classList.add("resize-x")

				if (this.node) {
					this.node.classList.add("resizing-left")
					this.node.classList.toggle("moving", true)
				}

				const mouseMoveHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let xFrom = mousePosition.x

					// Current bloc left side on other blocs right sides
					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.x - bl.position.to.x) < snapStrength
						&&
						bl.position.to.y > (this.position.from.y - snapStrength) && bl.position.from.y < (this.position.to.y + snapStrength)
					)
					if (nearBloc) {
						xFrom = nearBloc.position.to.x
					}

					// Current bloc left side on other blocs left sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.x - bl.position.from.x) < snapStrength
						&&
						bl.position.to.y > (this.position.from.y - snapStrength) && bl.position.from.y < (this.position.to.y + snapStrength)
					)
					if (nearBloc) {
						xFrom = nearBloc.position.from.x
					}


					if (xFrom < snapStrength) {
						xFrom = 0
					}

					this.position.from.x = xFrom <= this.position.to.x - snapStrength ? xFrom : this.position.to.x
					this.position.size.x = this.position.to.x - this.position.from.x
					this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)

				}

				const mouseUpHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					document.body.classList.toggle("resize-x", false)
					if (this.node) {
						this.node.classList.toggle("resizing-left", false)
						this.node.classList.toggle("moving", false)
					}
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

			let snapStrength = this.options.snapStrength || 0

			let resizerTop = document.createElement("div")
			resizerTop.classList.add("resizer", "resizer-top")
			this.node.appendChild(resizerTop)

			resizerTop.addEventListener("mousedown", (e: MouseEvent) => {
				e.preventDefault()
				e.stopPropagation()
				document.body.classList.add("resize-y")

				if (this.node) {
					this.node.classList.add("resizing-top")
					this.node.classList.toggle("moving", true)
				}

				const mouseMoveHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let yFrom = mousePosition.y

					// Current bloc top side on other blocs bottom sides
					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.y - bl.position.to.y) < snapStrength
						&&
						bl.position.to.x > (this.position.from.x - snapStrength) && bl.position.from.x < (this.position.to.x + snapStrength)
					)
					if (nearBloc) {
						yFrom = nearBloc.position.to.y
					}

					// Current bloc top side on other blocs top sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.y - bl.position.from.y) < snapStrength
						&&
						bl.position.to.x > (this.position.from.x - snapStrength) && bl.position.from.x < (this.position.to.x + snapStrength)
					)
					if (nearBloc) {
						yFrom = nearBloc.position.from.y
					}

					if (yFrom < snapStrength) {
						yFrom = 0
					}

					this.position.from.y = yFrom <= this.position.to.y - snapStrength ? yFrom : this.position.to.y
					this.position.size.y = this.position.to.y - this.position.from.y
					this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
				}
				const mouseUpHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					document.body.classList.toggle("resize-y", false)
					if (this.node) {
						this.node.classList.toggle("resizing-top", false)
						this.node.classList.toggle("moving", false)
					}
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

			let snapStrength = this.options.snapStrength || 0

			let resizerBottom = document.createElement("div")
			resizerBottom.classList.add("resizer", "resizer-bottom")
			this.node.appendChild(resizerBottom)

			resizerBottom.addEventListener("mousedown", (e: MouseEvent) => {
				e.preventDefault()
				e.stopPropagation()
				document.body.classList.add("resize-y")

				if (this.node) {
					this.node.classList.add("resizing-bottom")
					this.node.classList.toggle("moving", true)
				}

				const mouseMoveHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY)

					let yTo = mousePosition.y

					// Current bloc bottom side on other blocs top sides
					let nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.y - bl.position.to.y) < snapStrength
						&&
						bl.position.to.x > (this.position.from.x - snapStrength) && bl.position.from.x < (this.position.to.x + snapStrength)
					)
					if (nearBloc) {
						yTo = nearBloc.position.to.y
					}

					// Current bloc bottom side on other blocs bottom sides
					nearBloc = this.layout.blocs.find(bl =>
						bl !== this
						&&
						Math.abs(mousePosition.y - bl.position.from.y) < snapStrength
						&&
						bl.position.to.x > (this.position.from.x - snapStrength) && bl.position.from.x < (this.position.to.x + snapStrength)
					)
					if (nearBloc) {
						yTo = nearBloc.position.from.y
					}


					if (yTo < snapStrength) {
						yTo = 0
					}

					this.position.to.y = yTo >= this.position.from.y + snapStrength ? yTo : this.position.from.y

					this.position.size.y = this.position.to.y - this.position.from.y
					this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE)
				}
				const mouseUpHandler = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					document.body.classList.toggle("resize-y", false)
					if (this.node) {
						this.node.classList.toggle("resizing-bottom", false)
						this.node.classList.toggle("moving", false)

					}
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
