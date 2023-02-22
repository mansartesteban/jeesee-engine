import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import Actor from "./Actor";

class Planet extends Actor { // Todo : "extends Corpse"

    constructor() {
        super()
    }

    create() {
        this.geometry = new BoxGeometry(1, 1, 1)
		this.material = new MeshBasicMaterial({ color: 0xc58e45 })
		this.object = new Mesh(this.geometry, this.material)
    }

}

export default Planet