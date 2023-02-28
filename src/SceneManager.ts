import Actor from "@actors/Actor";
import { _Entity } from "@types";
import { Mesh, Object3D, Scene as ThreeScene } from "three";
import Observer from "./Observer";


class SceneManager {
  entities: Actor[];
  threeScene: ThreeScene;

  EVENTS = Object.freeze({
    ENTITY_ADDED: "ENTITY_ADDED",
    ENTITY_DELETED: "ENTITY_DELETED",
  });
  observer: Observer = new Observer(this.EVENTS)

  constructor(threeScene: ThreeScene) {
    this.entities = [];
    this.threeScene = threeScene;
  }

  // TODO: fonction delete (avec observer et $emit)

  add(entity: Actor, name?: string) {
    let $this = this;

    if (name) entity.name = name;

    if (entity.children) {
      entity.children.forEach((child) => $this.add(child));
    }
    this.entities.push(entity);
    this.threeScene.add(entity.object as Object3D);
    this.observer.$emit(this.EVENTS.ENTITY_ADDED)
  }

  get(name: string) {
    return this.entities.find((entity) => entity.name === name);
  }

  update(tick: number) {
    this.entities.forEach((entity) => {
      entity.updateLoop(tick);
    });
  }
}


export default SceneManager