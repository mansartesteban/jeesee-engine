import { IActorOptionsInterface, IEntity } from "@types"
import { BoxGeometry, BufferGeometry, Material, Mesh, MeshBasicMaterial, Object3D } from "three"
import { generateUUID } from "three/src/math/MathUtils"

/*
    Todo : Créer les écouteurs "onSpawn", "onCreate", "onUpdate"
*/

class Actor implements IEntity {

    geometry: BufferGeometry | null
    material: Material | null
    object: Object3D | null

    children: Actor[]
    options?: IActorOptionsInterface
    
    name: string
    parent: string | null

    isRigidBody: boolean = false

	constructor(options?: IActorOptionsInterface) {
        this.geometry = this.options?.geometry || null
        this.material = this.options?.material || null
        this.object = null
        this.children = []

        this.name = generateUUID()
        this.parent = null

        if (options) {
            this.options = options
        }

        this.create()
    }

    add(entity: Actor) :this {
        entity.parent = this.name
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
