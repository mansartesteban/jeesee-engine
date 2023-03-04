import "@assets/styles/_reset.scss";
import "@assets/styles/css.gg.css";
import "@assets/styles/_jeesee.scss";

import Game from "@/Game";
import GuiLayout from "./gui/layouts/GuiLayout";
import { _BlocLayoutOptions, _BlocLayoutPosition } from "@types";
import BlocLayout from "./gui/layouts/BlocLayout";





let layout = new GuiLayout();
console.log("index.js : instanciated layout", layout);
let TopBar = new BlocLayout({
  x: 0,
  y: 0,
  width: 100,
  height: 4,
  zIndex: 100,
  class: "TopBar"
});
console.log("index.js : instanciated TopBar", TopBar);

let LeftBar = new BlocLayout({
  x: 0,
  y: 4,
  width: 10,
  height: 96,
  class: "LeftBar",
  actionBar: true
});

let RightBar = new BlocLayout({
  x: 85,
  y: 4,
  width: 15,
  height: 96,
  class: "RightBar",
  actionBar: true
});

let OtherRightBar = new BlocLayout({
  x: 75,
  y: 4,
  width: 4,
  height: 96,
  class: "RightBar",
});


let BottomBar = new BlocLayout({
  x: 10,
  y: 92,
  width: 75,
  height: 8,
  class: "BottomBar",
});

let OtherBloc = new BlocLayout({
  x: 20,
  y: 30,
  width: 30,
  height: 20,
  class: "Bloc",
  actionBar: true
});

layout
  .addBloc(TopBar)
  .addBloc(RightBar)
  .addBloc(LeftBar)
  .addBloc(BottomBar)
  .addBloc(OtherBloc)
  .addBloc(OtherRightBar);

console.log("index.js : added TopBar to layout");

document.getElementById("clear-layout")?.addEventListener("click", () => {
  layout.clear();
});
document.getElementById("save-layout")?.addEventListener("click", () => {
  let layouts = layout.exportLayout();

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(layouts, null, 2)], {
    type: "application/json"
  }));
  a.setAttribute("download", "layout.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

let importInput = document.getElementById('import-file');
if (importInput) {
  importInput.onchange = function (e?: Event) {
    let file = (e?.target as any).files[0];
    let fr = new FileReader();
    fr.onload = () => {
      if (fr.result) {
        layout.importLayout(JSON.parse(fr.result.toString()));
      }
    };
    fr.readAsText(file);
  };
}




// const game = new Game()

// window.__jeesee__ = {
//     game: game,
//     helpers: {
//     }
// }

// game.start()
