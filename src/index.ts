import "@assets/styles/_reset.scss";
import "@assets/styles/_jeesee.scss";

import Game from "@/Game";
import GuiLayout from "./gui/layouts/GuiLayout";
import { _BlocLayoutOptions, _BlocLayoutPosition } from "@types";





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
  x: 20,
  y: 30,
  width: 30,
  height: 20,
  class: "Bloc",
});

document.getElementById("clear-layout")?.addEventListener("click", () => {
  layout.clear()
})


let saveBtn = document.getElementById("save-layout")?.addEventListener("click", () => {
  let layouts = layout.exportLayout()

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(layouts, null, 2)], {
    type: "application/json"
  }));
  a.setAttribute("download", "layout.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
})

// function onChange(event: Event) {
//   let file = ; (<HTMLInputElement>event.target).files[0];
// }

let importInput = document.getElementById('import-file')
if (importInput) {
  importInput.onchange = function (e?: Event) {
    let file = (e?.target as any).files[0]
    let fr = new FileReader()
    fr.onload = () => {
      if (fr.result) {
        layout.clear()
        let newLayout = JSON.parse(fr.result.toString())
        newLayout.forEach((bloc: _BlocLayoutPosition) => {
          layout.addBloc(transformBlocData(bloc))
        })
      }
    }
    fr.readAsText(file)
  }
}



function transformBlocData(datas: _BlocLayoutPosition): _BlocLayoutOptions {
  let transformed = {
    x: datas.from.x,
    y: datas.from.y,
    width: datas.size.x,
    height: datas.size.y
  }
  return transformed
}

// const game = new Game()

// window.__jeesee__ = {
//     game: game,
//     helpers: {
//     }
// }

// game.start()
// TODO: Par l'avenir il faudra changer en engine.start(), ce n'est plus le jeu que je veux démarrer mais le moteur de jeu


