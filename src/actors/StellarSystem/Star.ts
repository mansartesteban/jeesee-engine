import { Mesh, MeshPhongMaterial, SphereGeometry } from "three";
import Actor from "@actors/Actor";


class Star extends Actor {

    constructor() {
        super()
    }

    create() {
        this.geometry = new SphereGeometry(20, 200, 100)
		this.material = new MeshPhongMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)
    }

}

export default Star