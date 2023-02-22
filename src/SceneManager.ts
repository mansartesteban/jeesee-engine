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
        this.entities.push(entity)
        console.log("entity mesh", entity.object)
        this.threeScene.add(entity.object as Object3D)
    }

    update() {
        this.entities.forEach(entity => entity.update())
    }

}


export default SceneManager