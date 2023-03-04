import MiniVector2 from "@/core/geometry/MiniVector2";
import Observer from "@/Observer";
import {
	_BlocLayoutOptions,
	_BlocLayoutPosition,
	_GridLayoutOptions,
} from "@types";
import { Vector2 } from "three";
import ActionBar from "./ActionBar";
import GuiLayout from "./GuiLayout";
import Interfacor from "./Interfacor";

class BlocLayout extends Interfacor {
	static EVENTS = Object.freeze({
		BLOC_RESIZE: "BLOC_RESIZE",
		BLOC_MOVE: "BLOC_MOVE",
	});

	options: _BlocLayoutOptions = {
		zIndex: 1,
		resizableX: true,
		resizableY: true,
		actionBar: false,
		snapStrength: 1.5,
		resizerSize: 12,
	};

	layout: GuiLayout | null = null;

	position: _BlocLayoutPosition = {
		from: new Vector2(),
		to: new Vector2(),
		size: new Vector2(),
	};

	observer: Observer = new Observer(BlocLayout.EVENTS);

	constructor(options?: _BlocLayoutOptions) {
		super();

		if (options) {
			this.options = { ...this.options, ...options };
		}

		if (this.options.x !== undefined) {
			this.position.from.x = this.options.x;
			if (this.options.width !== undefined) {
				this.position.size.x = this.options.width;
				this.position.to.x = this.options.x + this.options.width;
			}
		}

		if (this.options.y !== undefined) {
			this.position.from.y = this.options.y;
			if (this.options.height !== undefined) {
				this.position.size.y = this.options.height;
				this.position.to.y = this.options.y + this.options.height;
			}
		}

		if (this.options.resizerSize) {
			document.documentElement.style.setProperty("--a13y-resizer-size", this.options.resizerSize + "px");
		}

		this.createElement();
	}

	setLayout(layout: GuiLayout) {
		this.layout = layout;
	}

	createElement(): void {
		this.node = document.createElement("div");
		this.node.classList.toggle("layout-bloc", true);
		this.node.classList.toggle("resizable", true);

		if (this.options.zIndex) {
			this.node.style.zIndex = this.options.zIndex.toString();
		}

		this.observer.$on(
			[
				BlocLayout.EVENTS.BLOC_RESIZE,
				BlocLayout.EVENTS.BLOC_MOVE
			],
			this.reposition.bind(this)
		);

		this.makeResizable();
		this.makeMovable();

		if (this.options.actionBar) {
			this.createActionBar();
		}

		this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE);
	}

	createActionBar() {
		let actionBar = new ActionBar();
		this.addNode(actionBar);

		actionBar.addAction({
			icon: "add-r",
			callback: () => {
				alert("toto");
			}
		});
	}

	makeMovable() {
		if (this.node) {

			let snapStrength = this.options.snapStrength || 0;

			this.node.addEventListener("mousedown", (e) => {
				e.preventDefault();
				e.stopPropagation();

				if (this.node) {
					this.node.classList.toggle("moving", true);
				}

				let originalClick = GuiLayout.getScreenPosition(e.clientX, e.clientY);
				let deltaClick = new Vector2(
					originalClick.x - this.position.from.x,
					originalClick.y - this.position.from.y
				);

				const mouseMoveHandler = (e: MouseEvent) => {

					let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY);

					let xTo = mousePosition.x - deltaClick.x + this.position.size.x;
					let yTo = mousePosition.y - deltaClick.y + this.position.size.y;
					let xFrom = mousePosition.x - deltaClick.x;
					let yFrom = mousePosition.y - deltaClick.y;

					let isLeftSnapped = false;
					let isRightSnapped = false;
					let isTopSnapped = false;
					let isBottomSnapped = false;

					let nearBloc;

					// Current bloc right side on other blocs left sides
					if (this.layout) {
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xTo - bl.position.from.x) < snapStrength
							&&
							bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xTo = nearBloc.position.from.x;
							xFrom = xTo - this.position.size.x;
							isRightSnapped = true;
						}

						// Current bloc bottom side on other blocs top sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yTo - bl.position.from.y) < snapStrength
							&&
							bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yTo = nearBloc.position.from.y;
							yFrom = yTo - this.position.size.y;
							isBottomSnapped = true;
						}

						// Current bloc left side on other blocs right sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xFrom - bl.position.to.x) < snapStrength
							&&
							bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xFrom = nearBloc.position.to.x;
							xTo = xFrom + this.position.size.x;
							isLeftSnapped = true;
						}

						// Current bloc top side on other blocs bottom sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yFrom - bl.position.to.y) < snapStrength
							&&
							bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yFrom = nearBloc.position.to.y;
							yTo = yFrom + this.position.size.y;
							isTopSnapped = true;
						}

						// Current bloc right side on other blocs right sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xTo - bl.position.to.x) < snapStrength
							&&
							bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xTo = nearBloc.position.to.x;
							xFrom = xTo - this.position.size.x;
							isRightSnapped = true;
						}

						// Current bloc bottom side on other blocs bottom sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yTo - bl.position.to.y) < snapStrength
							&&
							bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yTo = nearBloc.position.to.y;
							yFrom = yTo - this.position.size.y;
							isBottomSnapped = true;
						}

						// Current bloc left side on other blocs left sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xFrom - bl.position.from.x) < snapStrength
							&&
							bl.position.to.y > (yFrom - snapStrength) && bl.position.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xFrom = nearBloc.position.from.x;
							xTo = xFrom + this.position.size.x;
							isLeftSnapped = true;
						}

						// Current bloc top side on other blocs top sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yFrom - bl.position.from.y) < snapStrength
							&&
							bl.position.to.x > (xFrom - snapStrength) && bl.position.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yFrom = nearBloc.position.from.y;
							yTo = yFrom + this.position.size.y;
							isTopSnapped = true;
						}

						// Make bloc not movable outside of container by the left
						if (xFrom < snapStrength) {
							xFrom = 0;
							xTo = this.position.size.x;
							isLeftSnapped = true;
						}

						// Make bloc not movable outside of container by the right
						if (xTo > 100 - snapStrength) {
							xFrom = 100 - this.position.size.x;
							xTo = 100;
							isRightSnapped = true;
						}

						// Make bloc not movable outside of container by the top
						if (yFrom < snapStrength) {
							yFrom = 0;
							yTo = this.position.size.y;
							isTopSnapped = true;
						}

						// Make bloc not movable outside of container by the bottom
						if (yTo > 100 - snapStrength) {
							yFrom = 100 - this.position.size.y;
							yTo = 100;
							isBottomSnapped = true;
						}
					}


					this.position.to.x = xTo;
					this.position.to.y = yTo;
					this.position.from.x = xFrom;
					this.position.from.y = yFrom;
					this.observer.$emit(BlocLayout.EVENTS.BLOC_MOVE);

					if (this.node) {
						this.node.classList.toggle("resizing-right", isRightSnapped);
						this.node.classList.toggle("resizing-left", isLeftSnapped);
						this.node.classList.toggle("resizing-top", isTopSnapped);
						this.node.classList.toggle("resizing-bottom", isBottomSnapped);
					}

				};

				const mouseUpHandler = () => {
					if (this.node) {
						this.node.classList.toggle("resizing-right", false);
						this.node.classList.toggle("resizing-left", false);
						this.node.classList.toggle("resizing-top", false);
						this.node.classList.toggle("resizing-bottom", false);
						this.node.classList.toggle("moving", false);
					}
					document.removeEventListener("mousemove", mouseMoveHandler);
					document.removeEventListener("mouseup", mouseUpHandler);
				};

				document.addEventListener("mousemove", mouseMoveHandler);
				document.addEventListener("mouseup", mouseUpHandler);
			});
		}
	}

	reposition() {
		console.log("repositionning", this.node, this.position);
		if (this.node) {
			this.node.style.left = `${this.position.from.x}vw`;
			this.node.style.right = `${100 - this.position.to.x}vw`;
			this.node.style.top = `${this.position.from.y}vh`;
			this.node.style.bottom = `${100 - this.position.to.y}vh`;
		}
	}

	makeResizable() {
		if (this.options.resizableX) {
			this.createResizer("right");
			this.createResizer("left");
		}
		if (this.options.resizableY) {
			this.createResizer("bottom");
			this.createResizer("top");
		}
	}

	createResizer(side: string) {

		let origins: Record<string, { from: string, opposite: string, mainAxe: string, crossAxe: string; }> = {
			"right": {
				from: "to",
				opposite: "from",
				mainAxe: "x",
				crossAxe: "y"
			},
			"left": {
				from: "from",
				opposite: "to",
				mainAxe: "x",
				crossAxe: "y"
			},
			"bottom": {
				from: "to",
				opposite: "from",
				mainAxe: "y",
				crossAxe: "x"
			},
			"top": {
				from: "from",
				opposite: "to",
				mainAxe: "y",
				crossAxe: "x"
			},
		};

		// Les variables à utiliser
		let mainAxe = origins[side].mainAxe as keyof MiniVector2;
		let crossAxe = origins[side].crossAxe as keyof MiniVector2;
		let from = origins[side].from as keyof _BlocLayoutPosition;
		let oppositeFrom = origins[side].opposite as keyof _BlocLayoutPosition;

		// If node exists to the DOM
		if (this.node) {

			let snapStrength = this.options.snapStrength || 0;

			// Create and element to DOM
			let resizer = document.createElement("div");
			resizer.classList.toggle("resizer", true);
			resizer.classList.toggle("resizer-" + side, true);
			this.node.appendChild(resizer);

			// Handle the resizing when click is down
			resizer.addEventListener("mousedown", (e: MouseEvent) => {
				e.preventDefault();
				e.stopPropagation();
				document.body.classList.toggle("resize-" + mainAxe, true);

				// If node exists to the DOM
				if (this.node) {

					// Add classes to apply specific style
					this.node.classList.toggle("resizing-" + side, true);
					this.node.classList.toggle("moving", true);

					// Handle the resizing constraints while moving the mouse (snap to other blocs, border limits ...)
					const mouseMoveHandler = (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();

						// Get mouse position transform from 0 to 100
						let mousePosition = GuiLayout.getScreenPosition(e.clientX, e.clientY);

						// Get mopuse position on current main axe
						let pos = mousePosition[mainAxe];

						// Check collisions/snappings with other blocs
						if (this.layout) {
							for (let i = 0; i < this.layout.blocs.length; i++) {

								let bloc = this.layout.blocs[i];

								// Doesn't apply calculation on current bloc
								if (bloc !== this) {

									// Check if the bloc is close enough to apply calculation (with snapStrength)
									if (
										bloc.position.from[crossAxe] < (this.position.to[crossAxe] + snapStrength)
										&&
										bloc.position.to[crossAxe] > (this.position.from[crossAxe] - snapStrength)
									) {

										// Check is current edge is close enough to snap on first edge of other bloc within the main axe
										if (Math.abs(mousePosition[mainAxe] - bloc.position[from][mainAxe]) < snapStrength) {
											pos = bloc.position[from][mainAxe];
											break;
										}

										// Check is current edge is close enough to snap on second edge of other bloc within the main axe
										if (Math.abs(mousePosition[mainAxe] - bloc.position[oppositeFrom][mainAxe]) < snapStrength) {
											pos = bloc.position[oppositeFrom][mainAxe];
											break;
										}

									}

								}
							}
						}


						// Calculate if current edge is passing through layout border and reposition it to the limits with snapStrength
						pos = pos > 100 - snapStrength ? 100 : (pos < snapStrength ? 0 : pos);

						// Finally apply calculted new position of the edge et recalculate size of the bloc
						this.position[from][mainAxe] = Math.abs(this.position[oppositeFrom][mainAxe] - pos) >= snapStrength ? pos : this.position[oppositeFrom][mainAxe];
						this.position.size[mainAxe] = Math.abs(this.position[from][mainAxe] - this.position[oppositeFrom][mainAxe]);

						// Emit an event on observer to annouce the bloc has resized
						this.observer.$emit(BlocLayout.EVENTS.BLOC_RESIZE);
					};

					// Reinitialize classes and events to original after the mouse click is up
					const mouseUpHandler = (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						document.body.classList.toggle("resize-" + mainAxe, false);
						if (this.node) {
							this.node.classList.toggle("resizing-" + side, false);
							this.node.classList.toggle("moving", false);
						}
						document.removeEventListener("mousemove", mouseMoveHandler);
						document.removeEventListener("mouseup", mouseUpHandler);
					};
					document.addEventListener("mousemove", mouseMoveHandler);
					document.addEventListener("mouseup", mouseUpHandler);
				}

			});
		}
	}

}

export default BlocLayout;
