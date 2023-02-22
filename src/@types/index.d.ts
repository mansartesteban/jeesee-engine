import Game from "@/Game";
import { Object3D, Vector3 } from "three";

declare global {
    var __auralux__: {
        game: Game,
        helpers: {
        }
    }
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
    children: _Entity[]
    options?: _ActorOptions,
    update() :void;
}

type _ActorOptions = {
    position?: Vector3,
    rotation?: Vector3,
    scale?: Vector3
}

export {
    _ActorOptions,
    _Entity,
    _Observer,
    _LocalObserver
}