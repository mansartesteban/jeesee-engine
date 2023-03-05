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

		let lerp = .01;
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
								if (bloc !== this) {

									// Check if the bloc is close enough to apply calculation (with snapStrength)
									if (
										bloc.targetPosition.from[crossAxe] < (this.targetPosition.to[crossAxe] + snapStrength)
										&&
										bloc.targetPosition.to[crossAxe] > (this.targetPosition.from[crossAxe] - snapStrength)
									) {

										// Check is current edge is close enough to snap on first edge of other bloc within the main axe
										if (Math.abs(mousePosition[mainAxe] - bloc.targetPosition[from][mainAxe]) < snapStrength) {
											pos = bloc.targetPosition[from][mainAxe];
											break;
										}

										// Check is current edge is close enough to snap on second edge of other bloc within the main axe
										if (Math.abs(mousePosition[mainAxe] - bloc.targetPosition[oppositeFrom][mainAxe]) < snapStrength) {
											pos = bloc.targetPosition[oppositeFrom][mainAxe];
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

					let xTo = mousePosition.x - deltaClick.x + this.targetPosition.size.x;
					let yTo = mousePosition.y - deltaClick.y + this.targetPosition.size.y;
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
							Math.abs(xTo - bl.targetPosition.from.x) < snapStrength
							&&
							bl.targetPosition.to.y > (yFrom - snapStrength) && bl.targetPosition.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xTo = nearBloc.targetPosition.from.x;
							xFrom = xTo - this.targetPosition.size.x;
							isRightSnapped = true;
						}

						// Current bloc bottom side on other blocs top sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yTo - bl.targetPosition.from.y) < snapStrength
							&&
							bl.targetPosition.to.x > (xFrom - snapStrength) && bl.targetPosition.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yTo = nearBloc.targetPosition.from.y;
							yFrom = yTo - this.targetPosition.size.y;
							isBottomSnapped = true;
						}

						// Current bloc left side on other blocs right sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xFrom - bl.targetPosition.to.x) < snapStrength
							&&
							bl.targetPosition.to.y > (yFrom - snapStrength) && bl.targetPosition.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xFrom = nearBloc.targetPosition.to.x;
							xTo = xFrom + this.targetPosition.size.x;
							isLeftSnapped = true;
						}

						// Current bloc top side on other blocs bottom sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yFrom - bl.targetPosition.to.y) < snapStrength
							&&
							bl.targetPosition.to.x > (xFrom - snapStrength) && bl.targetPosition.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yFrom = nearBloc.targetPosition.to.y;
							yTo = yFrom + this.targetPosition.size.y;
							isTopSnapped = true;
						}

						// Current bloc right side on other blocs right sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xTo - bl.targetPosition.to.x) < snapStrength
							&&
							bl.targetPosition.to.y > (yFrom - snapStrength) && bl.targetPosition.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xTo = nearBloc.targetPosition.to.x;
							xFrom = xTo - this.targetPosition.size.x;
							isRightSnapped = true;
						}

						// Current bloc bottom side on other blocs bottom sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yTo - bl.targetPosition.to.y) < snapStrength
							&&
							bl.targetPosition.to.x > (xFrom - snapStrength) && bl.targetPosition.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yTo = nearBloc.targetPosition.to.y;
							yFrom = yTo - this.targetPosition.size.y;
							isBottomSnapped = true;
						}

						// Current bloc left side on other blocs left sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(xFrom - bl.targetPosition.from.x) < snapStrength
							&&
							bl.targetPosition.to.y > (yFrom - snapStrength) && bl.targetPosition.from.y < (yTo + snapStrength)
						);
						if (nearBloc) {
							xFrom = nearBloc.targetPosition.from.x;
							xTo = xFrom + this.targetPosition.size.x;
							isLeftSnapped = true;
						}

						// Current bloc top side on other blocs top sides
						nearBloc = this.layout.blocs.find(bl =>
							bl !== this
							&&
							Math.abs(yFrom - bl.targetPosition.from.y) < snapStrength
							&&
							bl.targetPosition.to.x > (xFrom - snapStrength) && bl.targetPosition.from.x < (xTo + snapStrength)
						);
						if (nearBloc) {
							yFrom = nearBloc.targetPosition.from.y;
							yTo = yFrom + this.targetPosition.size.y;
							isTopSnapped = true;
						}

						// Make bloc not movable outside of container by the left
						if (xFrom < snapStrength) {
							xFrom = 0;
							xTo = this.targetPosition.size.x;
							isLeftSnapped = true;
						}

						// Make bloc not movable outside of container by the right
						if (xTo > 100 - snapStrength) {
							xFrom = 100 - this.targetPosition.size.x;
							xTo = 100;
							isRightSnapped = true;
						}

						// Make bloc not movable outside of container by the top
						if (yFrom < snapStrength) {
							yFrom = 0;
							yTo = this.targetPosition.size.y;
							isTopSnapped = true;
						}

						// Make bloc not movable outside of container by the bottom
						if (yTo > 100 - snapStrength) {
							yFrom = 100 - this.targetPosition.size.y;
							yTo = 100;
							isBottomSnapped = true;
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
