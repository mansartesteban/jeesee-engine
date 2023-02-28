import Observer from "@/Observer";
import SceneManager from "@/SceneManager";
import { _Entity } from "@types";


//TODO: Trouver un autre nom
//TODO: Implémenter la copie d'ID
//TODO: Pouvoir recherche dans la liste par nom ou ID
//TODO: Pouvoir renger les entités dans des dossiers et sauvegarder l'état de l'arbre
//TODO: Trouver comment pallier au problèmes des éléments enfants en doublon (qui se situent dans sceneManager mais aussi au sein de ball)
//TODO: Renommer le projet auralux (et toutes les variables) en Jeez Engine

class GuiControls {

  static EVENTS = Object.freeze({
    NODE_SELECTED: "NODE_SELECTED"
  })

  sceneManager: SceneManager
  observer: Observer = new Observer(GuiControls.EVENTS)

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager

    // this.createTree(this.sceneManager, "name", "children")
    this.sceneManager.observer.$on(SceneManager.EVENTS.ENTITY_ADDED, this.refreshTree.bind(this))
    this.sceneManager.observer.$on(SceneManager.EVENTS.ENTITY_DELETED, this.refreshTree.bind(this))
    
  }

  cleanTree(domElement: HTMLElement) {
    while (domElement.firstChild) {
      domElement.removeChild(domElement.firstChild);
    }
  }

  refreshTree() {

    let controls = document.getElementById("controls")
    if (controls) {

      // TODO: Plutôt que de tout clean, je pourrais peut-être utiliser les observer pour rajouter ou supprimer automatiquement les éléments
      this.cleanTree(controls)
      let transformedDatas = this.transformEntities(this.sceneManager.entities)
      let tree = this.createTree(transformedDatas)
      controls.appendChild(tree)

    }

  }

  transformEntities(entities: any[]) :any[] {
    return entities.map(entity => {

      let children: any[] = []
      if (entity.children) {
        children = this.transformEntities(entity.children)
      }

      let tmp = {
        name: entity.constructor.name,
        label: entity.name,
        key: entity.object?.uuid || 0,
        children
      }
      return tmp
    })
  }

  createTree(nodes: any[]) :HTMLElement {
    
      let tree = document.createElement("div")
      tree.id = "entity-tree"

      nodes.forEach(node => {
        tree.appendChild(this.createTreeNode(node))
      })

      return tree

  }

  createTreeNode(node: any, lvl: number = 0) :HTMLElement {
    let domNode = document.createElement("div")
    domNode.classList.add("tree-node")

    if (node.children.length > 0) {
      let nodeToggleIcon = document.createElement("div")
          nodeToggleIcon.classList.add("toggle-icon")
          nodeToggleIcon.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 32 32'><path d='M16.682 19.674c.01-.012.014-.028.024-.04l6.982-7.714c.39-.434.39-1.138 0-1.572-.004-.004-.008-.006-.012-.008a.936.936 0 0 0-.712-.34H8.998a.948.948 0 0 0-.722.352l-.004-.004a1.202 1.202 0 0 0 0 1.572l6.998 7.754a.928.928 0 0 0 1.412 0z'/></svg>"
          domNode.appendChild(nodeToggleIcon)
          domNode.addEventListener("click", () => {
            domNode.classList.toggle("expanded")
          })
    }
    

    let nodeLabel = document.createElement("div")
        nodeLabel.classList.add("node-label")
        nodeLabel.innerText = node.name
        domNode.appendChild(nodeLabel)


    let nodeSublabel = document.createElement("div")
        nodeSublabel.classList.add("node-sublabel")
        nodeSublabel.innerText = `(ID: ${node.key})`
        nodeSublabel.title = `ID: ${node.key}`
        domNode.appendChild(nodeSublabel)
        

    if (node.children) {
      domNode.appendChild(this.createTree(node.children))
    }

    domNode.addEventListener("click", () => {
      this.observer.$emit(GuiControls.EVENTS.NODE_SELECTED, node)
    })

    return domNode
  }
}

export default GuiControls;