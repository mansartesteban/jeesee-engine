import Planet from "@/actors/Planet"
import PointLight from "@/actors/PointLight"
import Star from "@/actors/Star"
import Scene from "@/Scene"

import {
	BoxGeometry,
	Camera,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PointLight as ThreePointLight,
	Scene as ThreeScene,
	WebGLRenderer,
} from "three"

class MainScene extends Scene {
	cube?: Mesh

	constructor() {
		super()
	}

	init(): void {
		let star = new Star()
		let pointLight = new PointLight();
		
		this.sceneManager.add(star)
		this.sceneManager.add(pointLight)

		let planets = []
		for (let i = 0; i < 100 ; i++) {
			let planet = new Planet();
			this.sceneManager.add(planet)
		}
		
		
		
	}

	update(): void {
	}
}

export default MainScene
