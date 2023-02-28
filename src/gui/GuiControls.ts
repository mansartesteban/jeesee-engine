import SceneManager from "@/SceneManager";
import { _Entity } from "@types";


//TODO: Trouver un autre nom

class GuiControls {

  sceneManager: SceneManager

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager

    this.createTree(this.sceneManager, "name", "children")
    this.sceneManager.observer.$on(this.sceneManager.EVENTS.ENTITY_ADDED, this.createTree)
  }

  cleanTree(domElement: HTMLElement) {
    while (domElement.firstChild) {
      domElement.removeChild(domElement.firstChild);
    }
  }

  createTree(object: any, nameProperty: string, childrenProperty: string) {
    let controls = document.getElementById("controls")
    if (controls) {

      this.cleanTree(controls)

      let tree = document.createElement("div")
      tree.id = "entity-tree"

      this.sceneManager.entities.forEach(entity => {
        tree.appendChild(this.createEntityTree(entity))
      })

      controls.appendChild(tree)
    }
  }

  createEntityTree(entity: _Entity) :HTMLElement {
    let entityNode = document.createElement("div")
    entityNode.innerText = entity.name
    return entityNode
  }

}

export default GuiControls;