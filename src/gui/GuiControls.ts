import Observer from "@/Observer";
import SceneManager from "@/SceneManager";
import { IEntity } from "@types";


//TODO: Trouver un autre nom
//TODO: ImplÃ©menter la copie d'ID
//TODO: Pouvoir recherche dans la liste par nom ou ID
//TODO: Pouvoir ranger les entitÃ©s dans des dossiers et sauvegarder l'Ã©tat de l'arbre
//TODO: Renommer le projet jeesee (et toutes les variables) en jeesee Engine



//TODO: Ne pas oublier que j'ai retiré la div "#controls" du index.html

class GuiControls {

  static EVENTS = Object.freeze({
    NODE_SELECTED: "NODE_SELECTED"
  })

  sceneManager: SceneManager
  observer: Observer = new Observer(GuiControls.EVENTS)

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager

    this.sceneManager.observer.$on([
      SceneManager.EVENTS.ENTITY_ADDED,
      SceneManager.EVENTS.ENTITY_DELETED
    ], this.refreshTree.bind(this))
    
  }

  cleanTree(domElement: HTMLElement) {
    while (domElement.firstChild) {
      domElement.removeChild(domElement.firstChild);
    }
  }

  refreshTree() {

    let controls = document.getElementById("controls")
    if (controls) {

      // TODO: PlutÃ´t que de tout clean, je pourrais peut-Ãªtre utiliser les observer pour rajouter ou supprimer automatiquement les Ã©lÃ©ments
      this.cleanTree(controls)
      let transformedDatas = this.transformEntities(this.sceneManager.entities, null)
      let tree = this.createTree(transformedDatas)
      controls.appendChild(tree)

    }

  }

  transformEntities(entities: IEntity[], parent: IEntity | null) :any[] {
    return entities
      .filter(entity => (entity.parent && parent && entity.parent === parent.name) || !entity.parent)
      .map((entity) => {
        let children: any[] = [];
        if (entity.children) {
          children = this.transformEntities(entity.children, entity);
        }

        let tmp = {
          name: entity.constructor.name,
          label: entity.name,
          key: entity.object?.uuid || 0,
          children,
        };
        return tmp;
      });
  }

  createTree(nodes: any[], lvl: number = 0) :HTMLElement {
    
      let tree = document.createElement("div")
      tree.id = "entity-tree"

      nodes.forEach(node => {
        tree.appendChild(this.createTreeNode(node, lvl))
      })

      return tree

  }

  createTreeNode(node: any, lvl: number = 0) :HTMLElement {
    let domNode = document.createElement("div")
    domNode.classList.add("tree-node")

    let domNodeContent = document.createElement("div")
      domNodeContent.classList.add("node-content")
      domNodeContent.addEventListener("mouseenter", (e) => {
        e.stopPropagation();
        domNodeContent.classList.toggle("hovered", true);
      });
      domNodeContent.addEventListener("mouseleave", (e) => {
        e.stopPropagation();
        domNodeContent.classList.toggle("hovered", false);
      });

    if (node.children.length > 0) {
      let nodeToggleIcon = document.createElement("div")
          nodeToggleIcon.classList.add("toggle-icon")
          nodeToggleIcon.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 32 32'><path d='M16.682 19.674c.01-.012.014-.028.024-.04l6.982-7.714c.39-.434.39-1.138 0-1.572-.004-.004-.008-.006-.012-.008a.936.936 0 0 0-.712-.34H8.998a.948.948 0 0 0-.722.352l-.004-.004a1.202 1.202 0 0 0 0 1.572l6.998 7.754a.928.928 0 0 0 1.412 0z'/></svg>"
          domNodeContent.appendChild(nodeToggleIcon);
          domNode.addEventListener("click", () => {
            domNode.classList.toggle("expanded")
          })
    }
    

    let nodeLabel = document.createElement("div")
        nodeLabel.classList.add("node-label")
        nodeLabel.innerText = "\xa0".repeat(lvl * 4) + node.name;
        domNodeContent.appendChild(nodeLabel);


    let nodeSublabel = document.createElement("div")
        nodeSublabel.classList.add("node-sublabel")
        nodeSublabel.innerText = `(ID: ${node.key})`
        nodeSublabel.title = `ID: ${node.key}`
        domNodeContent.appendChild(nodeSublabel);
    
    domNode.appendChild(domNodeContent)

    if (node.children.length > 0) {
      let childrenTree = this.createTree(node.children, lvl + 1);
      domNode.appendChild(childrenTree)
    }

    domNode.addEventListener("click", (e) => {
      e.stopPropagation()
      this.observer.$emit(GuiControls.EVENTS.NODE_SELECTED, node)
    })

    return domNode
  }
}

export default GuiControls;