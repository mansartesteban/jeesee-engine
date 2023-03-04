import MiniVector2 from "@/core/geometry/MiniVector2";
import Game from "@/Game";
import { BufferGeometry, Material, Object3D, Vector2, Vector3 } from "three";

declare global {
    var __jeesee__: {
        game: Game,
        helpers: {
        }
    }
}

interface IObserver {
    observers: _LocalObserver[],

    $on(event: string, observer: Function): this,

    $emit(event: string, ...arg: any[]): this,

    unset(observer: _LocalObserver): this,
}

type _LocalObserver = {
    event: string,
    callback: Function
}

interface IEntity {
    name: string
    parent: string | null
    object: Object3D | null
    children: IEntity[]
    options?: _ActorOptions
    updateLoop(tick: number): void
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

type _GridLayoutOptions = {
    rows: number,
    columns: number
}

type _BlocLayoutOptions = {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    zIndex?: number,
    resizableX?: boolean,
    resizableY?: boolean,
    actionBar?: boolean,
    class?: string,
    snapStrength?: number,
    resizerSize?: number
}

type _BlocLayoutPosition = {
    from: MiniVector2,
    to: MiniVector2,
    size: MiniVector2
}

interface IInterfacor {
    node: Node | null
    createElement(): void
}

interface IActorOptionsInterface extends _ActorOptions, _RigidBodyOptions { }

export {
    IActorOptionsInterface,
    IEntity,
    IObserver,
    _LocalObserver,

    //Layouts
    IInterfacor,
    _GridLayoutOptions,
    _BlocLayoutOptions,
    _BlocLayoutPosition
}