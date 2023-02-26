import Scene from "@/Scene"
import PhysicsEngineScene from "@/scenes/PhysicsEngine/PhysicsEngineScene"

class Game {
	scene: Scene | null

	constructor() {
		this.scene = null
	}

	start() {
		this.scene = new PhysicsEngineScene()
	}
}

export default Game
