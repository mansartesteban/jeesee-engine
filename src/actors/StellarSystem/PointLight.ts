import GeometryUtils from "@/utils/GeometryUtils";
import { PointLight as ThreePointLight, Vector3 } from "three";
import Actor from "../Actor";

class PointLight extends Actor {

    direction: number

    constructor() {
        super()

        this.direction = 1
    }

    create() {
        this.object = new ThreePointLight(0xFFFFFF, 1, 1000);
		this.object.position.x = 100
		this.object.position.y = 200
		this.object.position.z = 100

        
    }

    update() {
        if (this.object) {
            
            if (this.object.position.x > 100) {
                this.direction = -1
            }
            if (this.object.position.x <= -100) {
                this.direction = 1
            }

            GeometryUtils.rotateAroundAxis(this.object, new Vector3(0, 1, 0), .01)
            
        }
    }

}

export default PointLight