import "@assets/styles/_reset.scss"

// import "@types/window"

import Game from "@/Game"



const game = new Game()

console.log("game", game)

window.__auralux__ = game

game.start()

