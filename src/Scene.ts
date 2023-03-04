import { WebGLRenderer, Scene as ThreeScene, PerspectiveCamera, LineSegments, WireframeGeometry, SphereGeometry } from "three";
import SceneManager from "@/SceneManager";
import GuiControls from "./gui/GuiControls";

class Scene {
	tick: number;
	renderer: WebGLRenderer;
	camera: PerspectiveCamera;
	scene: ThreeScene;

	sceneManager: SceneManager;
	guiControls: GuiControls;

	constructor() {
		this.tick = 0;


		if (window.requestAnimationFrame === undefined) {
			throw new Error("L'API 'requestAnimationFrame' ne fonctionne pas sur ce navigateur");
		}

		let controls = document.getElementById("controls");

		let controlsWidth = controls?.clientWidth || 0;

		this.scene = new ThreeScene();
		this.camera = new PerspectiveCamera(
			80,
			(window.innerWidth - controlsWidth) / window.innerHeight,
			0.1,
			5000
		);


		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth - controlsWidth, window.innerHeight);
		window.addEventListener("resize", () => {
			let controls = document.getElementById("controls");
			let controlsWidth = controls?.clientWidth || 0;

			if (this.renderer !== null) {
				this.renderer.setSize(window.innerWidth - controlsWidth, window.innerHeight);
			}
			if (this.camera !== null) {
				this.camera.aspect =
					(window.innerWidth - controlsWidth) / this.renderer.domElement.height;
				this.camera.updateProjectionMatrix();
			}
		});

		if (this.camera) {
			this.camera.position.y = 0;
			this.camera.position.z = 250;
			this.camera.rotation.x = 0;

		}



		document.body.appendChild(this.renderer.domElement);

		this.sceneManager = new SceneManager(this.scene);

		this.guiControls = new GuiControls(this.sceneManager);

		this.guiControls.observer.$on(GuiControls.EVENTS.NODE_SELECTED, (node: any) => {
			console.log("selected", node);
		});

		this.init();
		this.loop();
	}

	loop(): void {
		this.tick++;

		this.update(this.tick);
		this.sceneManager.update(this.tick);

		if (this.renderer && this.scene && this.camera) {
			this.renderer.render(this.scene, this.camera);
		}

		// setTimeout(() => {
		window.requestAnimationFrame(this.loop.bind(this));
		// }, 100)

	}

	update(tick: number): void { }
	init(): void { }
}

export default Scene;
