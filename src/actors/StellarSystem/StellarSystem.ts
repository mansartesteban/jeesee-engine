import Actor from "@actors/Actor";
import Group from "@actors/Group";
import GeometryUtils from "@utils/GeometryUtils";
import { Object3D, Vector3 } from "three";
import Planet from "./Planet";
import PointLight from "./PointLight";
import Star from "./Star";

class StellarSystem extends Actor {

  constructor() {
    super();
  }

  create() {

    let grp = new Group();
    let star = new Star();

    this.add(star);

    for (let i = 0; i < 100; i++) {
      let planet = new Planet();
      this.add(planet);
    }

    this.object = grp.object;

  }

  update() {
    // this.children.forEach(child => {
    //   if (child) {

    //   }
    // })
  }

}

export default StellarSystem;
