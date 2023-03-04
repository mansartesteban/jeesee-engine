import GeometryUtils from "@/utils/GeometryUtils";
import { PointLight as ThreePointLight, Vector3 } from "three";
import Actor from "@actors/Actor";

import { IActorOptionsInterface } from "@types";
import MathUtils from "@utils/MathUtils";

class PointLight extends Actor {

    constructor(options?: IActorOptionsInterface) {
        super(options);
    }

    create() {
        this.object = new ThreePointLight(0xFFFFFF, MathUtils.random(1, 10) / 10, 1000);
        if (this.options?.position) {
            this.object.position.x = this.options.position.x;
            this.object.position.y = this.options.position.y;
            this.object.position.z = this.options.position.z;
        }


    }

    update() {
    }

}

export default PointLight;