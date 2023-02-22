import { WebGLRenderer, Scene as ThreeScene, PerspectiveCamera } from "three"
import SceneManager from "@/SceneManager"

class Scene {
	tick: number
	renderer: WebGLRenderer | null
	camera: PerspectiveCamera | null
	scene: ThreeScene | null

	sceneManager: SceneManager

	constructor() {
		this.tick = 0
		this.renderer = null
		this.camera = null
		this.scene = null

		if (window.requestAnimationFrame === undefined) {
			throw new Error(
				"L'API 'requestAnimationFrame' ne fonctionne pas sur ce navigateur"
			)
		}

		this.scene = new ThreeScene()
		this.camera = new PerspectiveCamera(
			30,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)

		this.renderer = new WebGLRenderer({antialias: true})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		window.addEventListener("resize", () => {
			if (this.renderer !== null) {
				this.renderer.setSize(window.innerWidth, window.innerHeight)
			}
			if (this.camera !== null) {
				this.camera.aspect = window.innerWidth / window.innerHeight
				this.camera.updateProjectionMatrix()
			}			
		})

		if (this.camera) {
			this.camera.position.z = 5
		}

		document.body.appendChild(this.renderer.domElement)

		this.sceneManager = new SceneManager(this.scene)

		this.init()
		this.loop()
	}

	loop(tick?: number): void {
		if (tick) {
			this.tick = tick
		}

		this.update()
		this.sceneManager.update();

		if (this.renderer && this.scene && this.camera) {
			
			this.renderer.render(this.scene, this.camera)
		}

		setTimeout(() => {
			window.requestAnimationFrame(this.loop.bind(this))
		}, 0);
	}

	update(): void {}
	init(): void {}
}

export default Scene
