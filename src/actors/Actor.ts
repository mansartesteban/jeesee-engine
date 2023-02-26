import { _ActorOptionsInterface, _Entity } from "@types"
import { BoxGeometry, BufferGeometry, Material, Mesh, MeshBasicMaterial, Object3D } from "three"
import { generateUUID } from "three/src/math/MathUtils"

/*
    Todo : Créer les écouteurs "onSpawn", "onCreate", "onUpdate"
*/

class Actor implements _Entity {

    geometry: BufferGeometry | null
    material: Material | null
    object: Object3D | null

    children: Actor[]
    options?: _ActorOptionsInterface
    name: string

    isRigidBody: boolean = false

	constructor(options?: _ActorOptionsInterface) {
        this.geometry = this.options?.geometry || null
        this.material = this.options?.material || null
        this.object = null
        this.children = []

        this.name = generateUUID()

        if (options) {
            this.options = options
        }

        this.create()
    }

    add(entity: Actor) :this {
        this.children.push(entity)
        return this
    }
	
    create() :void {}
	spawn() :void {}
	
    updateLoop(tick: number): void {
        this.updateRigidBody(tick)
        this.update(tick)
    }

    updateRigidBody(tick: number) :void {}
    update(tick: number) :void {}
    
}

export default Actor
