import { Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry } from "three"
import Actor from "./Actor"

class Planet extends Actor {
	// Todo : "extends Corpse"

	spread: number

	constructor() {
		super()

		this.spread = Math.random()
	}

	create() {
		this.geometry = new SphereGeometry(1, 20, 10)
		this.material = new MeshPhongMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)
	}

	update() {
		if (this.object) {
			this.object.position.x += this.spread / 10
		}
	}
}

export default Planet
