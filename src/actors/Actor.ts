import { _Entity } from "@types"
import { BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, Object3D } from "three"

/*
    Todo : Créer les écouteurs "onSpawn", "onCreate", "onUpdate"
*/

class Actor implements _Entity {

    geometry: BufferGeometry | null
    material: MeshBasicMaterial | null
    object: Object3D | null

    children: _Entity[]

	constructor() {
        this.geometry = null
        this.material = null
        this.object = null
        this.children = []

        this.create()
    }

    add(entity: _Entity) :this {
        console.log("this", this)
        this.children.push(entity)
        return this
    }
	
    create() :void {}
	spawn() :void {}
	update(): void {}
}

export default Actor
