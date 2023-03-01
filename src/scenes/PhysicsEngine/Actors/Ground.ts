import Actor from "@actors/Actor";
import { IActorOptionsInterface } from "@types";
import { Mesh, MeshPhongMaterial, PlaneGeometry, SphereGeometry } from "three";
import RigidBody from "./RigidBody";

class Ground extends Actor {

    constructor(options?: IActorOptionsInterface) {
        super(options)
    }

    create() {

        let radius = 10

        this.geometry = new SphereGeometry(radius, 50, 25)
        this.material = new MeshPhongMaterial({ color: "#00FF00" })
        this.object = new Mesh(this.geometry, this.material)

        console.log(this.object.position)
    
    }



}

export default Ground