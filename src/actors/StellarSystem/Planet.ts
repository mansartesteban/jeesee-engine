import GeometryUtils from "@utils/GeometryUtils"
import { Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Vector3 } from "three"
import Actor from "../Actor"

class Planet extends Actor {
	// Todo : "extends Corpse"

	spread: number
	speed: number

	constructor() {
		super()

		this.spread = Math.random()
		this.speed = Math.random()
	}

	create() {
		this.geometry = new SphereGeometry(1, 20, 10)
		this.material = new MeshPhongMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)

		this.object.position.x = 20 * Math.random() + 20
		this.object.position.z = 20 * Math.random() + 20
	}

	update() {
		if (this.object) {
			GeometryUtils.rotateAroundAxis(this.object, new Vector3(1, 1, 0), this.speed / 10)
		}
	}
}

export default Planet
