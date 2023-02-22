import "@assets/styles/_reset.scss"

// import "@types/window"

import Game from "@/Game"



const game = new Game()


window.__auralux__ = {
    game: game,
    helpers: {
    }
}

 
game.start()

