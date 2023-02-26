import Actor from "@actors/Actor";
import { _Entity } from "@types";
import { Mesh, Object3D, Scene as ThreeScene } from "three";


class SceneManager {

    entities: Actor[];
    threeScene: ThreeScene;

    constructor(threeScene: ThreeScene) {
        this.entities = []
        this.threeScene = threeScene
    }

    add(entity: Actor, name?: string) {
        let $this = this

        if (name) entity.name = name

        if (entity.children) {
            entity.children.forEach(child => $this.add(child))
        }
        this.entities.push(entity)
        this.threeScene.add(entity.object as Object3D)
    }

    get(name: string) {
        return this.entities.find(entity => entity.name === name)
    }

    update(tick: number) {
        this.entities.forEach(entity => {
            entity.updateLoop(tick)
        })
    }

}


export default SceneManager