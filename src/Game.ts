import Scene from "@/Scene"
import MainScene from "@/scenes/MainScene"

class Game {
	scene: Scene | null

	constructor() {
		this.scene = null
	}

	start() {
		this.scene = new MainScene()
	}
}

export default Game
