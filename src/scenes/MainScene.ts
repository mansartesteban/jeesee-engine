import Planet from "@/actors/StellarSystem/Planet";
import PointLight from "@/actors/StellarSystem/PointLight";
import Star from "@/actors/StellarSystem/Star";
import Scene from "@/Scene";
import StellarSystem from "@actors/StellarSystem/StellarSystem";

import {
	BoxGeometry,
	Camera,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PointLight as ThreePointLight,
	Scene as ThreeScene,
	Vector3,
	WebGLRenderer,
} from "three";

class MainScene extends Scene {
	cube?: Mesh;

	constructor() {
		super();
	}

	init(): void {
		let sterllarSystem = new StellarSystem();
		this.sceneManager.add(sterllarSystem);

		let pointLight;

		pointLight = new PointLight({
			position: new Vector3(100, 100, 100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(-100, -100, -100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(100, 100, -100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(100, -100, 100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(100, -100, -100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(-100, 100, 100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(-100, 100, -100)
		});
		this.sceneManager.add(pointLight);

		pointLight = new PointLight({
			position: new Vector3(-100, -100, 100)
		});
		this.sceneManager.add(pointLight);



	}

	update(): void {
	}
}

export default MainScene;
