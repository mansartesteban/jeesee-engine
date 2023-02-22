import { _Entity } from "@types";
import { Mesh, Object3D, Scene as ThreeScene } from "three";


class SceneManager {

    entities: _Entity[];
    threeScene: ThreeScene;

    constructor(threeScene: ThreeScene) {
        this.entities = []
        this.threeScene = threeScene
    }

    add(entity: _Entity) {
        let $this = this
        if (entity.children) {
            console.log("entity has children", entity.children)
            entity.children.forEach(child => $this.add(child))
        }
        this.entities.push(entity)
        this.threeScene.add(entity.object as Object3D)
    }

    update() {
        this.entities.forEach(entity => {
            entity.update()
        })
    }

}


export default SceneManager