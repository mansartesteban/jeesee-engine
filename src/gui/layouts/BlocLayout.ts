import MiniVector2 from "@/core/geometry/MiniVector2";
import Observer from "@/Observer";
import {
	_BlocLayoutOptions,
	_BlocLayoutPosition,
	_GridLayoutOptions,
} from "@types";
import MathUtils from "@utils/MathUtils";
import { Vector2 } from "three";
import ActionBar from "./ActionBar";
import GuiLayout from "./GuiLayout";
import Interfacor from "./Interfacor";


class BlocLayout extends Interfacor {
	static EVENTS = Object.freeze({
		BLOC_RESIZE: "BLOC_RESIZE",
		BLOC_MOVE: "BLOC_MOVE",
		BLOC_CLOSE: "BLOC_CLOSE",
		BLOC_OPEN: "BLOC_OPEN",
		BLOC_MINIMIZE: "BLOC_MINIMIZE",
		BLOC_UNMINIMIZE: "BLOC_UNMINIMIZE",
	});

	options: _BlocLayoutOptions = {
		zIndex: 1,
		resizableX: true,
		resizableY: true,
		actionBar: false,
		snapStrength: 1.5,
		resizerSize: 12,
		animationSpeed: .11
	};

	layout: GuiLayout | null = null;

	targetPosition: _BlocLayoutPosition = {
		from: new Vector2(),
		to: new Vector2(),
		size: new Vector2(),
	};

	currentPosition = JSON.parse(JSON.stringify(this.targetPosition));
	savedPosition = this.currentPosition;

	isClosed: boolean = false;
	isMinimized: boolean = false;

	observer: Observer = new Observer(BlocLayout.EVENTS);

	constructor(options?: _BlocLayoutOptions) {
		super();

		if (options) {
			this.options = { ...this.options, ...options };
		}

		if (this.options.x !== undefined) {
			this.targetPosition.from.x = this.options.x;
			if (this.options.width !== undefined) {
				this.targetPosition.size.x = this.options.width;
				this.targetPosition.to.x = this.options.x + this.options.width;
			}
		}

		if (this.options.y !== undefined) {
			this.targetPosition.from.y = this.options.y;
			if (this.options.height !== undefined) {
				this.targetPosition.size.y = this.options.height;
				this.targetPosition.to.y = this.options.y + this.options.height;
			}
		}


		if (this.options.resizerSize) {
			document.documentElement.style.setProperty("--a13y-resizer-size", this.options.resizerSize + "px");
		}

		this.createElement();

		window.requestAnimationFrame(this.reposition.bind(this, false));
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

		this.makeResizable();
		this.makeMovable();

		if (this.options.actionBar) {
			this.createActionBar();
		}
		if (this.options.isClosed) {
			this.close();
		}

		this.reposition(true);

	}

	createActionBar() {
		let actionBar = new ActionBar();
		this.addNode(actionBar);

		actionBar.addAction({
			icon: "chevron-down",
			callback: () => {
				this.isMinimized ? this.unminimize() : this.minimize();
			}
		});

		actionBar.addAction({
			icon: "close",
			callback: () => {
				this.isClosed ? this.open() : this.close();
			}
		});

	}

	minimize() {
		this.isMinimized = true;

		this.savedPosition = JSON.parse(JSON.stringify(this.currentPosition));

		this.targetPosition.from.x = 2;
		this.targetPosition.size.x = 10;
		this.targetPosition.to.x = this.targetPosition.from.x + this.targetPosition.size.x;

		this.targetPosition.from.y = 96;
		this.targetPosition.size.y = 4;
		this.targetPosition.to.y = this.targetPosition.from.y + this.targetPosition.size.y;

		// this.observer.$emit(BlocLayout.EVENTS.BLOC_MINIMIZE);
		// this.observer.$emit(BlocLayout.EVENTS.BLOC_MOVE);
	}

	unminimize() {
		this.isMinimized = false;
		this.targetPosition = this.savedPosition;
		// this.observer.$emit(BlocLayout.EVENTS.BLOC_UNMINIMIZE);
		// this.observer.$emit(BlocLayout.EVENTS.BLOC_MOVE);
	}

	close() {

		this.isClosed = true;

		if (this.layout && this.layout.node && this.node) {
			this.layout.node.removeChild(this.node);
		}

		// this.observer.$emit(BlocLayout.EVENTS.BLOC_CLOSE);
	}
	open() {
		this.isClosed = false;
		// this.observer.$emit(BlocLayout.EVENTS.BLOC_OPEN);
	}

	lerp(v: number, a: number, b: number) {
		return a + (b - a) * v;
	}

	reposition(instant = false) {

		if (this.node) {

			if (instant === true) {
				this.currentPosition = JSON.parse(JSON.stringify(this.targetPosition));
			}

			this.node.style.left = `${this.currentPosition.from.x}vw`;
			this.node.style.right = `${100 - this.currentPosition.to.x}vw`;
			this.node.style.top = `${this.currentPosition.from.y}vh`;
			this.node.style.bottom = `${100 - this.currentPosition.to.y}vh`;

			if (
				Math.abs(this.currentPosition.from.x - this.targetPosition.from.x) > 0
				||
				Math.abs(this.currentPosition.from.y - this.targetPosition.from.y) > 0
				||
				Math.abs(this.currentPosition.to.x - this.targetPosition.to.x) > 0
				||
				Math.abs(this.currentPosition.to.y - this.targetPosition.to.y) > 0

			) {
				this.currentPosition.from.x = this.lerp(this.options.animationSpeed || 1, this.currentPosition.from.x, this.targetPosition.from.x);
				this.currentPosition.from.y = this.lerp(this.options.animationSpeed || 1, this.currentPosition.from.y, this.targetPosition.from.y);
				this.currentPosition.to.x = this.lerp(this.options.animationSpeed || 1, this.currentPosition.to.x, this.targetPosition.to.x);
				this.currentPosition.to.y = this.lerp(this.options.animationSpeed || 1, this.currentPosition.to.y, this.targetPosition.to.y);
				this.currentPosition.size.x = this.currentPosition.to.x - this.currentPosition.from.x;
				this.currentPosition.size.y = this.currentPosition.to.y - this.currentPosition.from.y;
			}

			if (!instant) {
				window.requestAnimationFrame(this.reposition.bind(this, false));
			}
		}
	}

	makeResizable() {
		if (this.options.resizableX) {
			this.createResizer("left");
			this.createResizer("right");
		}
		if (this.options.resizableY) {
			this.createResizer("top");
			this.createResizer("bottom");
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
						let mousePosition = GuiLayout.getMouseLayoutPosition(e.clientX, e.clientY);

						// Get mopuse position on current main axe
						let pos = mousePosition[mainAxe];

						// Check collisions/snappings with other blocs
						if (this.layout) {
							for (let i = 0; i < this.layout.blocs.length; i++) {

								let bloc = this.layout.blocs[i];

								// Doesn't apply calculation on current bloc
								if (bloc !== this && !bloc.isClosed) {

									// Check if the bloc is close enough to apply calculation (with snapStrength)
									if (
										bloc.currentPosition.from[crossAxe] < (this.targetPosition.to[crossAxe] + snapStrength)
										&&
										bloc.currentPosition.to[crossAxe] > (this.targetPosition.from[crossAxe] - snapStrength)
									) {

										// Check is current edge is close enough to snap on first edge of other bloc within the main axe
										if (Math.abs(mousePosition[mainAxe] - bloc.currentPosition[from][mainAxe]) < snapStrength) {
											pos = bloc.currentPosition[from][mainAxe];
											break;
										}

										// Check is current edge is close enough to snap on second edge of other bloc within the main axe
										if (Math.abs(mousePosition[mainAxe] - bloc.currentPosition[oppositeFrom][mainAxe]) < snapStrength) {
											pos = bloc.currentPosition[oppositeFrom][mainAxe];
											break;
										}

									}

								}
							}
						}


						// Calculate if current edge is passing through layout border and reposition it to the limits with snapStrength
						pos = pos > 100 - snapStrength ? 100 : (pos < snapStrength ? 0 : pos);

						// Finally apply calculted new position of the edge et recalculate size of the bloc
						this.targetPosition[from][mainAxe] = Math.abs(this.targetPosition[oppositeFrom][mainAxe] - pos) >= snapStrength ? pos : this.targetPosition[oppositeFrom][mainAxe];
						this.targetPosition.size[mainAxe] = Math.abs(this.targetPosition[from][mainAxe] - this.targetPosition[oppositeFrom][mainAxe]);

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

	makeMovable() {
		if (this.node) {

			let snapStrength = this.options.snapStrength || 0;

			this.node.addEventListener("mousedown", (e) => {
				e.preventDefault();
				e.stopPropagation();

				if (this.node) {
					this.node.classList.toggle("moving", true);
				}

				let originalClick = GuiLayout.getMouseLayoutPosition(e.clientX, e.clientY);
				let deltaClick = new Vector2(
					originalClick.x - this.targetPosition.from.x,
					originalClick.y - this.targetPosition.from.y
				);

				const mouseMoveHandler = (e: MouseEvent) => {

					let mousePosition = GuiLayout.getMouseLayoutPosition(e.clientX, e.clientY);

					// MathUtils.minMax(x, 0, 100) permits to not overtake the window
					let xTo = MathUtils.minMax(mousePosition.x - deltaClick.x + this.targetPosition.size.x, 0, 100);
					let yTo = MathUtils.minMax(mousePosition.y - deltaClick.y + this.targetPosition.size.y, 0, 100);
					let xFrom = MathUtils.minMax(mousePosition.x - deltaClick.x, 0, 100);
					let yFrom = MathUtils.minMax(mousePosition.y - deltaClick.y, 0, 100);

					let isLeftSnapped = false;
					let isRightSnapped = false;
					let isTopSnapped = false;
					let isBottomSnapped = false;

					if (this.layout) {

						// An array of magnetics points on axe X (by default, edges of window)
						let edgesOnX = [];
						edgesOnX.push(0);
						edgesOnX.push(100);

						// An array of magnetics points on axe Y (by default, edges of window)
						let edgesOnY = [];
						edgesOnY.push(0);
						edgesOnY.push(100);

						// For each bloc, push both X and Y edges to respectives arrays and create a kind of "constraints list"
						for (let i = 0; i < this.layout.blocs.length; i++) {
							let bloc = this.layout.blocs[i];

							// If bloc is not the current one and is not closed (closed means not attached to DOM)
							if (bloc == this || bloc.isClosed) continue;

							// If bloc is close enough on axe Y to be a constraint on axe X
							if (bloc.currentPosition.to.y > (yFrom - snapStrength) && bloc.currentPosition.from.y < (yTo + snapStrength)) {
								edgesOnX.push(bloc.currentPosition.from.x);
								edgesOnX.push(bloc.currentPosition.to.x);
							}

							// If bloc is close enough on axe X to be a constraint on axe Y
							if (bloc.currentPosition.to.x > (xFrom - snapStrength) && bloc.currentPosition.from.x < (xTo + snapStrength)) {
								edgesOnY.push(bloc.currentPosition.from.y);
								edgesOnY.push(bloc.currentPosition.to.y);
							}

						}

						// For each edge found on X axis, calculate and apply the magnetism if so
						for (let edgeOnX of edgesOnX) {
							if (Math.abs(xTo - edgeOnX) < snapStrength) {
								xTo = edgeOnX;
								xFrom = xTo - this.targetPosition.size.x;
								isRightSnapped = true;
							}
							if (Math.abs(xFrom - edgeOnX) < snapStrength) {
								xFrom = edgeOnX;
								xTo = xFrom + this.targetPosition.size.x;
								isLeftSnapped = true;
							}
						}

						// For each edge found on Y axis, calculate and apply the magnetism if so
						for (let edgeOnY of edgesOnY) {
							if (Math.abs(yTo - edgeOnY) < snapStrength) {
								yTo = edgeOnY;
								yFrom = yTo - this.targetPosition.size.y;
								isBottomSnapped = true;
							}
							if (Math.abs(yFrom - edgeOnY) < snapStrength) {
								yFrom = edgeOnY;
								yTo = yFrom + this.targetPosition.size.y;
								isTopSnapped = true;
							}
						}
					}

					this.targetPosition.to.x = xTo;
					this.targetPosition.to.y = yTo;
					this.targetPosition.from.x = xFrom;
					this.targetPosition.from.y = yFrom;

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

}

export default BlocLayout;
