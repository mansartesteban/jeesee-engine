import "@assets/styles/_reset.scss";
import "@assets/styles/_jeesee.scss";

import Game from "@/Game";
import GuiLayout from "./gui/layouts/GuiLayout";





let layout = new GuiLayout()

// TopBar
layout.addBloc({
    x: 0, 
    y: 0, 
    width: 100,
    height: 4,
    zIndex: 100,
    class: "TopBar"
})

// Left bar
layout.addBloc({
  x: 0,
  y: 4,
  width: 10,
  height: 96,
  class: "LeftBar",
});


// Right bar
layout.addBloc({
  x: 85,
  y: 4,
  width: 15,
  height: 96,
  class: "RightBar",
});

// 2nd Right bar
layout.addBloc({
  x: 75,
  y: 4,
  width: 4,
  height: 96,
  class: "RightBar",
});

// Bottom bar
layout.addBloc({
  x: 10,
  y: 92,
  width: 75,
  height: 8,
  class: "BottomBar",
});

// Other
layout.addBloc({
  x: 30,
  y: 30,
  width: 20,
  height: 20,
  class: "Bloc",
});

// const game = new Game()

// window.__jeesee__ = {
//     game: game,
//     helpers: {
//     }
// }

// game.start() 
// TODO: Par l'avenir il faudra changer en engine.start(), ce n'est plus le jeu que je veux démarrer mais le moteur de jeu