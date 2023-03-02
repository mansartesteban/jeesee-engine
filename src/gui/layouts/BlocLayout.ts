import { IInterfacor, _BlocLayoutOptions, _GridLayoutOptions } from "@types";
import MathUtils from "@utils/MathUtils";
import GuiLayout from "./GuiLayout";
const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
// TODO: Extends ResizableGridBloc

// TODO: Ne pas pouvoir resizer quand on est sur les bord
// TODO: Ne pas pouvoir resize plus loin qu'un autre élément déjà existant (exemple: le bandeau de gauche doit limiter sont redimmensionnement au début du bandeau de droite)
// TODO: Pouvoir déplacer les blocs
// TODO: Enregirster la position des blocs
// TODO: Lorsque l'on redimensionne d'un côté pûis de l'autre, le bloc revient à sa position de départ (rendre les données réactives)

class BlocLayout implements IInterfacor {
  options: _BlocLayoutOptions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    zIndex: 1,
    resizableX: true,
    resizableY: true,
    actionBar: true,
  };
  node: Node | null = null;

  layout: GuiLayout

  constructor(options: _BlocLayoutOptions, layout: GuiLayout) {
    if (options) {
      this.options = { ...this.options, ...options };
    }

    this.layout = layout

    this.createElement();
  }

  createElement(): void {
    let bloc = document.createElement("div");
    bloc.classList.add("layout-bloc", "resizable", this.options.class || "");

    bloc.style.left = `${this.options.x || 0}vw`;
    bloc.style.right = `${
      100 - ((this.options.width || 0) + (this.options.x || 0))
    }vw`;
    bloc.style.top = `${this.options.y || 0}vh`;
    bloc.style.bottom = `${
      100 - ((this.options.height || 0) + (this.options.y || 0))
    }vh`;
    // bloc.style.width = `${this.options.width || 0}vw`
    // bloc.style.height = `${this.options.height || 0}vh`
    // bloc.style.gridColumn = `${this.options.x + 1} / span ${this.options.width}`
    // if (this.options.y || this.options.y === 0) {
    // 	// bloc.style.gridRow = `${this.options.y + 1} / span ${this.options.height}`
    // }
    // if (this.options.zIndex) {
    //     bloc.style.zIndex = this.options.zIndex.toString()
    // }

    bloc.style.background = "#" + randomColor();
    this.createResizers(bloc);

    this.node = bloc;
  }

  createResizers(bloc: Node) {
    if (this.options.resizableX) {
      this.createLeftResizer(bloc);
      this.createRightResizer(bloc);
    }
    if (this.options.resizableY) {
      this.createBottomResizer(bloc);
      this.createTopResizer(bloc);
    }
  }

  transformCoordinates(xFrom: number, yFrom: number, xTo: number, yTo: number) {
    // TODO: Doit retourner un x, y, width, height
  }

  createRightResizer(bloc: Node) {
    let resizerRight = document.createElement("div");
    resizerRight.classList.add("resizer", "resizer-right");
    bloc.appendChild(resizerRight);

    resizerRight.addEventListener("mousedown", () => {
      document.body.classList.add("resize-x");

      const mouseMoveHandler = (e: MouseEvent) => {
        let position = GuiLayout.getScreenPosition(e.clientX, e.clientY);

        // Passer une snapSensitivity en param
        let nearblocs = this.layout.blocs.find(bl => {
            if (bl.options.x && bl.options.class)
            //   console.log(
            //     bl.options.class,
            //     position.x,
            //     bl.options.x,
            //     position.x - bl.options.x < 5,
            //   );
            return (
              bl !==this && bl.options.x &&
              bl.options.width &&
              Math.abs(position.x - bl.options.x) < 1
            );
        })
        let newPosX = (nearblocs?.options.x&&(100 - nearblocs?.options.x)) || 100 - position.x;
        ;(bloc as HTMLElement).style.right = `${newPosX}vw`;
      };
      const mouseUpHandler = () => {
        document.body.classList.remove("resize-x");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });
  }

  createLeftResizer(bloc: Node) {
    let resizerLeft = document.createElement("div");
    resizerLeft.classList.add("resizer", "resizer-left");
    bloc.appendChild(resizerLeft);

    resizerLeft.addEventListener("mousedown", () => {
      document.body.classList.add("resize-x");

      const mouseMoveHandler = (e: MouseEvent) => {
        let position = GuiLayout.getScreenPosition(e.clientX, e.clientY);
        (bloc as HTMLElement).style.left = `${position.x}vw`;
      };
      const mouseUpHandler = () => {
        document.body.classList.remove("resize-x");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });
  }

  createTopResizer(bloc: Node) {
    let resizerTop = document.createElement("div");
    resizerTop.classList.add("resizer", "resizer-top");
    bloc.appendChild(resizerTop);

    resizerTop.addEventListener("mousedown", () => {
      document.body.classList.add("resize-y");

      const mouseMoveHandler = (e: MouseEvent) => {
        let position = GuiLayout.getScreenPosition(e.clientX, e.clientY);
        (bloc as HTMLElement).style.top = `${position.y}vh`;

      };
      const mouseUpHandler = () => {
        document.body.classList.remove("resize-y");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });
  }

  createBottomResizer(bloc: Node) {
    let resizerBottom = document.createElement("div");
    resizerBottom.classList.add("resizer", "resizer-bottom");
    bloc.appendChild(resizerBottom);

    resizerBottom.addEventListener("mousedown", () => {
      document.body.classList.add("resize-y");

      const mouseMoveHandler = (e: MouseEvent) => {
        let position = GuiLayout.getScreenPosition(e.clientX, e.clientY);
        (bloc as HTMLElement).style.bottom = `${100 - position.y}vh`;
      };
      const mouseUpHandler = () => {
        document.body.classList.remove("resize-y");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });
  }
}

export default BlocLayout;
