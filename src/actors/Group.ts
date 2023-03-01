import Actor from "@actors/Actor"
import { IEntity } from "@types"
import { Object3D, Group as ThreeGroup } from "three"

class Group extends Actor {
  
  constructor() {
    super()
  }

  create() {
    this.object = new ThreeGroup()
  }

}

export default Group