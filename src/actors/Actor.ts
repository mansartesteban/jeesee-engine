import { _Entity } from "@/@types"
import { BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, Object3D } from "three"

class Actor implements _Entity {

    geometry: BufferGeometry | null
    material: MeshBasicMaterial | null
    object: Object3D | null

	constructor() {
        this.geometry = null
        this.material = null
        this.object = null

        this.create()
    }
	
    create() :void {}
	spawn() :void {}
	update(): void {}
}

export default Actor
