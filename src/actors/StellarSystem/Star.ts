import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";
import Actor from "@actors/Actor";
import Noise from "@utils/Noise/Noise";
import MyNoise from "@utils/Noise/MyNoise";


class Star extends Actor {

    tmp: number

    constructor() {
        super()

        this.tmp = 0
    }

    create() {
        // this.geometry = new SphereGeometry(20, 200, 100)
        this.geometry = new BoxGeometry(5, 5, 5)
		this.material = new MeshPhongMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)

        this.object.rotation.x = .5
        MyNoise.regenerate()
        
    }

    update () {

        let t = MyNoise.noise(this.tmp)

        console.log(this.tmp,t)
        this.tmp += .001

        if (this.object) {
            this.object.rotation.y += t / 20
            // this.object.rotation.x += t / 100
        }
    }

}

export default Star