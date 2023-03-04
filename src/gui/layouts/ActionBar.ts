import Observer from "@/Observer";
import { _ActionBarItem } from "@types";
import Interfacor from "./Interfacor";

type _ActionBarOptions = {
    align: string;
};

// TODO: Implements DOMElement ?
class ActionBar extends Interfacor {

    options: _ActionBarOptions = {
        align: "right" // Left, Center, Right
    };

    actions: _ActionBarItem[] = [];

    observer: Observer = new Observer();

    constructor(options?: _ActionBarOptions) {
        super(options);

        this.createElement();
    }

    createElement() {
        this.node = document.createElement("div");
        this.node.classList.toggle("action-bar", true);
    }

    addAction(action: _ActionBarItem) {
        if (this.node) {
            let actionButton = document.createElement("div");
            actionButton.classList.add("action-bar-button");

            if (action.icon) {
                if (!action.icon.startsWith("gg-")) {
                    action.icon = "gg-" + action.icon;
                }
                let icon = document.createElement("i");
                icon.classList.add(action.icon);
                actionButton.appendChild(icon);
            }

            if (action.callback) {
                console.log("binding callback");
                actionButton.addEventListener("click", (e: MouseEvent) => {
                    console.log("clicked");
                    e.preventDefault();
                    e.stopPropagation();
                    action.callback && action.callback();
                });
            }

            this.node.appendChild(actionButton);
            this.actions.push(action);
        }
    }

}

export default ActionBar;