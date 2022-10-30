type IMatrixRow = [number, number, number]
export type ITransformMatrix = [IMatrixRow, IMatrixRow, IMatrixRow]

export type TFUpdateHistory = (history:IPoint[]) => void

export interface ICore {
    draw(): void;

    set(key: string, value: number): void;
}

export interface IFigure {
    a: number
}

export interface IPoint {
    x: number
    y: number
}

export interface IRotation {
    x: number
    y: number
    angle: number
}

export interface IAffine {
    xx: number
    xy: number
    yy: number
    yx: number
    ox: number
    oy: number
}

export interface IProjective {
    xx: number,
    xy: number,
    yy: number,
    yx: number,
    ox: number,
    oy: number,
    wx: number,
    wy: number,
    wo: number
}
