import { Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry } from "three";
import Actor from "./Actor";


class Star extends Actor {

    constructor() {
        super()
    }

    create() {
        this.geometry = new SphereGeometry(1, 200, 100)
		this.material = new MeshPhongMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)
    }

    update() :void {

        
        // if (this.object) {
        //     this.object.rotation.y += .001
        //     this.object.rotation.z += .003
        // }
    }

}

export default Star