import GeometryUtils from "@utils/GeometryUtils"
import MathUtils from "@utils/MathUtils"
import {
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	SphereGeometry,
	Vector3,
} from "three"
import Actor from "@actors/Actor"
import Noise from "@utils/Noise/Noise"

class Planet extends Actor {
	// Todo : "extends Corpse"

	spread: number
	speed: number

	tmp: number

	constructor() {
		super()

		this.spread = MathUtils.random(1, 10) 
		this.speed = MathUtils.random(1, 100) / 1000

		this.tmp = 0
	}

	create() {
		this.geometry = new SphereGeometry(1, 20, 10)
		this.material = new MeshPhongMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)

		this.object.position.x = 20 * Math.random() + 20
		this.object.position.z = 20 * Math.random() + 20
	}

	update() {

		let t = Noise.perlinNoise(this.tmp, this.tmp, this.tmp)
        this.tmp += this.speed / 10

		if (this.object) {
			GeometryUtils.rotateAroundAxis(
				this.object,
				new Vector3(1, 1, 0),
				t / 5
			)
		}
	}
}

export default Planet
