import Game from "@/Game";
import { BufferGeometry, Material, Object3D, Vector3 } from "three";

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
    name: string
    parent: string | null
    object: Object3D | null
    children: _Entity[]
    options?: _ActorOptions
    updateLoop(tick: number) :void
}

type _ActorOptions = {
    position?: Vector3,
    rotation?: Vector3,
    scale?: Vector3

    material?: Material,
    geometry?: BufferGeometry
}

type _RigidBodyOptions = {
    gravity?: boolean,
    mass?: number,
    enableCollision?: boolean,
    enableCollisionResponse?: boolean,
    gravityOrigin?: Vector3
    
}

interface _ActorOptionsInterface extends _ActorOptions, _RigidBodyOptions {}

export {
    _ActorOptionsInterface,
    _Entity,
    _Observer,
    _LocalObserver
}