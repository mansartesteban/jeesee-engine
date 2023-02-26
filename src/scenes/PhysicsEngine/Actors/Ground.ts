import Actor from "@actors/Actor";
import { _ActorOptionsInterface } from "@types";
import { Mesh, MeshPhongMaterial, PlaneGeometry, SphereGeometry } from "three";
import RigidBody from "./RigidBody";

class Ground extends RigidBody {

    constructor(options?: _ActorOptionsInterface) {
        super(options)
    }

    create() {

        let radius = 10

        this.geometry = new SphereGeometry(radius, 50, 25)
        this.material = new MeshPhongMaterial({ color: "#00FF00" })
        this.object = new Mesh(this.geometry, this.material)
    
    }

}

export default Ground