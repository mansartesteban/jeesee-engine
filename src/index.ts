import "@assets/styles/_reset.scss";
import "@assets/styles/_auralux.scss";

import Game from "@/Game";


const game = new Game()

window.__auralux__ = {
    game: game,
    helpers: {
    }
}

game.start() 
// TODO: Par l'avenir il faudra changer en engine.start(), ce n'est plus le jeu que je veux démarrer mais le moteur de jeu