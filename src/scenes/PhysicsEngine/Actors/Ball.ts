import Actor from "@actors/Actor"
import { _ActorOptionsInterface } from "@types"
import MathUtils from "@utils/MathUtils"
import {
	BufferGeometry,
	Line,
	LineBasicMaterial,
	LineSegments,
	Material,
	Mesh,
	MeshPhongMaterial,
	SphereGeometry,
	Vector3,
	WireframeGeometry,
} from "three"
import Cube from "./Cube"
import RigidBody from "./RigidBody"

class Ball extends Actor {

	constructor(options: _ActorOptionsInterface) {
		super(options)

		// this.velocity = new Vector3(0, 100, 0)
	}

	create() {
		// let radius = 20
		
		// this.mass = (4/3) * Math.PI * Math.pow(radius / 2, 3) // MathUtils
		
		// this.geometry = new SphereGeometry(radius, 20, 10)
		// // const wireframe = new WireframeGeometry(this.geometry)

		// // const lines = new LineSegments(wireframe)
		// // ;(lines.material as Material).depthTest = false
		// // ;(lines.material as Material).opacity = 0.25
		// // ;(lines.material as Material).transparent = true

		// // this.object = lines
		// // this.object = new Mesh(this.geometry, lines.material)

		// this.material = new MeshPhongMaterial({ color: 0xff5225 })
		this.geometry = this.options?.geometry || null
		this.material = this.options?.material || null

		this.object = new Mesh(this.geometry || undefined, this.material || undefined)

		this.object.position.y = 100
		this.object.position.x = 100
		this.object.position.z = 100


		for (let i = 0; i < 25 ; i++) {
			this.add(new Cube())
		}


		// this.velocity = new Vector3(1, 0, 0)
		// this.object.position.x = 10
		// this.object.position.z = 0

		// const material = new LineBasicMaterial({ color: 0x0000ff })

		// const points = []
		// points.push(new Vector3(0, 0, 0))
		// points.push(new Vector3(0, -radius, 0))

		// const geometry = new BufferGeometry().setFromPoints(points)

		// const line = new Line(geometry, material)
		// this.object.add(line)

		window.addEventListener("keypress", (e) => {
			if (e.key == " ") {
				// this.options.enableCollision = !this.options.enableCollision
			}
		})

		
		let elem = document.getElementById("position")
		if (elem) {
			elem.addEventListener("input", (e: any) => {
				console.log("e", e)
				if (this.object && e.target) {
					this.object.position.x = e.target.value
				}
			})
		}
	}

	update() {
		if (this.object) {
			this.object.rotation.x+=.01
		}
		// console.log(this.velocity)
	}

}

export default Ball
