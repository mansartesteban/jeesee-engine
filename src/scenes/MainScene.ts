import Planet from "@/actors/StellarSystem/Planet"
import PointLight from "@/actors/StellarSystem/PointLight"
import Star from "@/actors/StellarSystem/Star"
import Scene from "@/Scene"
import StellarSystem from "@actors/StellarSystem/StellarSystem"

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
			let sterllarSystem = new StellarSystem();
			this.sceneManager.add(sterllarSystem)

			let pointLight = new PointLight();
    	this.sceneManager.add(pointLight)
	}

	update(): void {
	}
}

export default MainScene
