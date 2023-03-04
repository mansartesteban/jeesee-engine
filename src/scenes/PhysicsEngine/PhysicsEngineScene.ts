import Scene from "@/Scene";
import { AmbientLight, LineSegments, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, PointLight, SphereGeometry, Vector3, WireframeGeometry } from "three";
import Ball from "./Actors/Ball";
import Ground from "./Actors/Ground";
import Controls from "@/Controls";
import Cube from "./Actors/Cube";
import MathUtils from "@utils/MathUtils";

const geometry = new SphereGeometry(10, 8, 4);
const material = new MeshPhongMaterial({ color: 0xff5225 });

class PhysicsEngineScene extends Scene {

    controls: Controls;

    constructor() {
        super();

        this.controls = new Controls(this.camera, this.renderer);
    }

    init() {

        let ground = new Ground({ gravity: true, enableCollisionResponse: false });
        if (ground.object) {
            ground.object.position.copy(new Vector3(100, 10, -60));
        }
        this.sceneManager.add(ground, "ground");

        let ball = new Ball({ material, geometry });
        this.sceneManager.add(ball);

        // console.log(ground.mass, ball.mass)


        let light = new PointLight(0xFFFFFF, 1, 10000);
        light.position.x = 200;
        light.position.y = 500;
        light.position.z = -200;
        this.scene?.add(light);

        let ambiantLight = new AmbientLight(0xDDFFFF, .75);
        this.scene.add(ambiantLight);

        light = new PointLight(0xFFFFFF, 1, 10000);
        light.position.x = -1000;
        light.position.y = -1000;
        this.scene?.add(light);

        // document.addEventListener("click", () => {
        //     let del = Math.random() > .5
        //     if (del) {
        //         let randomName = this.sceneManager.entities[MathUtils.random(0, this.sceneManager.entities.length)].name
        //         console.log("deleting", this.sceneManager.entities, randomName)
        //         this.sceneManager.delete(randomName)
        //     } else {
        //         let c = new Cube()
        //         this.sceneManager.add(c)
        //     }
        // })
        //     for (let i = 0 ; i < 10 ; i++) {
        //         let ball = new Ball({ material, geometry, mass: .1, gravityOrigin: ground.object?.position })
        //         this.sceneManager.add(ball)
        //     }
        // })

    }

    update(tick: number) {
        if (this.controls) {
            this.controls.update(tick);
        }

        // let del = Math.random() > .5
        // if (del && this.sceneManager.entities.length > 0) {
        //     for (let i = 0 ; i < MathUtils.random(1, 100) ; i++) {
        //         let r = MathUtils.random(0, this.sceneManager.entities.length)
        //         console.log("r", r)
        //         let randomEntity = this.sceneManager.entities[r]
        //         if (randomEntity) {
        //             // console.log("deleting", this.sceneManager.entities, randomEntity.name)
        //             this.sceneManager.delete(randomEntity.name)
        //         }
        //     }
        // } else {
        //     for (let i = 0 ; i < MathUtils.random(1, 100) ; i++) {

        //         let c = new Cube()
        //         this.sceneManager.add(c)
        //     }
        // }

        // this.sceneManager.entities.forEach((entity, key) => {
        //     if (entity.object && entity.object.position.y < -2000) {
        //         this.scene.remove(entity.object)
        //         entity.object.remove()
        //         entity.object.clear()
        //         delete this.sceneManager.entities[key]
        //         this.sceneManager.entities.splice(key, 1)
        //     }
        // })

        // for (let i = 0 ; i < 3 ; i ++) {
        // if (tick%10==0) {
        //     let ball = new Ball({ material, geometry })
        //     this.sceneManager.add(ball)
        // }
    }
}

export default PhysicsEngineScene;
