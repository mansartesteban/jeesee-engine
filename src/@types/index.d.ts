import { Mesh, Object3D } from "three";

declare global {
    interface Window { Auralux: any; }
}

interface _Observer {
    observers: _LocalObserver[],

    $on(event: string, observer: Function): this,

    $emit(event: string, ...arg: any[]): this,

    unset(observer: _LocalObserver): this,
}

type _LocalObserver = {
    event: string,
    callback: Function
}

interface _Entity {
    object: Object3D | null
    update() :void;
}

export {
    _Entity,
    _Observer,
    _LocalObserver
}