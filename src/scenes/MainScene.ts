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
	}

	update(): void {
	}
}

export default MainScene
