import Scene from "@/Scene"
import { LineSegments, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, PointLight, SphereGeometry, WireframeGeometry } from "three"
import Ball from "./Actors/Ball"
import Ground from "./Actors/Ground"
import Controls from "@/Controls"

const geometry = new SphereGeometry(10, 20, 10)
const material = new MeshPhongMaterial({ color: 0xff5225 })

class PhysicsEngineScene extends Scene {

    controls: Controls

	constructor() {
		super()

        this.controls = new Controls(this.camera, this.renderer)
	}

    init() {

        let ground = new Ground({ gravity: true, enableCollisionResponse: false})
        this.sceneManager.add(ground, "ground")

        let ball = new Ball({ material, geometry})
        this.sceneManager.add(ball)

        // console.log(ground.mass, ball.mass)


        let light = new PointLight(0xFFFFFF, 1, 10000)
        light.position.x = 200
        light.position.y = 500
        light.position.z = -200
        this.scene?.add(light)

        light = new PointLight(0xFFFFFF, 1, 10000)
        light.position.x = -1000
        light.position.y = -1000
        this.scene?.add(light)

        // document.addEventListener("click", () => {
        //     for (let i = 0 ; i < 10 ; i++) {
        //         let ball = new Ball({ material, geometry, mass: .1, gravityOrigin: ground.object?.position })
        //         this.sceneManager.add(ball)
        //     }
        // })

    }

    update(tick: number) {
        if (this.controls) {
            this.controls.update(tick)
        }

        // this.sceneManager.entities.forEach((entity, key) => {
        //     if (entity.object && entity.object.position.y < -2000) {
        //         this.scene.remove(entity.object)
        //         entity.object.remove()
        //         entity.object.clear()
        //         delete this.sceneManager.entities[key]
        //         this.sceneManager.entities.splice(key, 1)
        //     }
        // })

        // for (let i = 0 ; i < 3 ; i ++) {
        // if (tick%10==0) {
        //     let ball = new Ball({ material, geometry })
        //     this.sceneManager.add(ball)
        // }
    }
}

export default PhysicsEngineScene
