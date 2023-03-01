import "@assets/styles/_reset.scss";
import "@assets/styles/_jeesee.scss";

import Game from "@/Game";
import GuiLayout from "./gui/layouts/GuiLayout";





let layout = new GuiLayout({
    columns: 150,
    rows: 150
})
layout.addBloc({
    x: 0, 
    y: 0, 
    width: 150,
    height: 4,
    zIndex: 100
})
layout.addBloc({
    x: 0, 
    y: 4,
    width: 15,
    height: 146
})
layout.addBloc({
    x: 130,
    y: 4,
    width: 20,
    height: 146
})
// layout.createBloc(4, 1, 20, 18)
layout.addBloc({
    x: 15,
    y: 120,
    width: 115,
    height: 30
})

// const game = new Game()

// window.__jeesee__ = {
//     game: game,
//     helpers: {
//     }
// }

// game.start() 
// TODO: Par l'avenir il faudra changer en engine.start(), ce n'est plus le jeu que je veux démarrer mais le moteur de jeu