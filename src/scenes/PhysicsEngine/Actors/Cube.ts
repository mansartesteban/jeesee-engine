import MathUtils from "@utils/MathUtils";
import { BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from "three";
import RigidBody from "./RigidBody";

class Cube extends RigidBody {

    create() {
        this.geometry = new BoxGeometry(10, 10, 10);
        this.material = new MeshPhongMaterial({ color: 0X4488DA });
        this.object = new Mesh(this.geometry, this.material);

        this.object.position.copy(
            new Vector3(
                MathUtils.random(-100, 100),
                MathUtils.random(-100, 100),
                MathUtils.random(-100, 100)
            )
        );
    }
}

export default Cube;