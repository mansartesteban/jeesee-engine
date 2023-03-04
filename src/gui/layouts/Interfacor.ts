import Observer from "@/Observer";

type options = Record<string, any>;

class Interfacor {

    node: HTMLElement | null = null;
    options: options = {};

    constructor(options?: options) {
        if (options) {
            this.options = { ...options, ...this.options };
        }
    }

    addNode(node: Interfacor): this {
        if (node.node && this.node) {
            this.node.appendChild(node.node);
        }
        return this;
    }

    getNode() {
        return this.node;
    }

}

export default Interfacor;