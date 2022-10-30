import {IAffine, IFigure, IPoint, IProjective, IRotation, ITransformMatrix} from "./types"


interface IStage {
    width: number
    height: number
    padding: number
    px_per_sm: number
    ox: (x: number) => number
    oy: (x: number) => number
    pos: (x: number, y: number, grid?: boolean) => [number, number]
    grid_width: number
    setTransformMatrix: (matrix: ITransformMatrix) => void
    transform: (matrix: ITransformMatrix) => (x: number, y: number) => [number, number]
    ctx: CanvasRenderingContext2D
    shift: IPoint
    rotation: IRotation
    affine: IAffine
    projective: IProjective,
    figure: IFigure,
    isTangent: boolean,
    isNormal: boolean,
    isAsymptote: boolean,
    init: boolean
    activePointIndex: number,
    arc: {
        show: boolean,
        from: number,
        to: number
    }
    isInflectionPoints: boolean
}

const INITIAL_A_PARAM = 2
// @ts-ignore
export var stage: IStage = {
    init: true,
    width: 1500,
    height: window.outerHeight - 135,
    padding: 20,
    px_per_sm: 20,
    grid_width: 400,
    activePointIndex: 0,
    shift: {
        x: 0,
        y: 0,
    },
    arc: {
        show: true,
        from: 0,
        to: 0
    },
    rotation: {
        x: 0,
        y: 0,
        angle: 0,
    },
    figure: {
        a: INITIAL_A_PARAM,
    },
    isTangent: true,
    isNormal: false,
    isAsymptote: false,
    isInflectionPoints: true,
    affine: {
        xx: 1,
        xy: 0,
        yx: 0,
        yy: 1,
        ox: 0,
        oy: 0,
    },
    projective: {
        xx: 35,
        xy: 0,
        yy: 35,
        yx: 0,
        ox: 0,
        oy: 0,
        wx: 0,
        wy: 0,
        wo: 35
    }
}

stage.ox = (x: number) => stage.padding + (stage.width / 2) + x;
stage.oy = (y: number) => (stage.height / 2) - y - stage.padding;

stage.pos = (x: number, y: number) => [stage.padding + x, stage.height - y - stage.padding]


stage.setTransformMatrix = (m: ITransformMatrix) => {
    stage.pos = (x: number, y: number, grid = false) => {

        if (!grid) {

            const rtx = stage.rotation.x * stage.px_per_sm;
            const rty = stage.rotation.y * stage.px_per_sm;

            [x, y] = stage.transform([ // rotation
                [Math.cos(stage.rotation.angle), Math.sin(stage.rotation.angle), 0],
                [-Math.sin(stage.rotation.angle), Math.cos(stage.rotation.angle), 0],
                [
                    -rtx * (Math.cos(stage.rotation.angle) - 1) + rty * Math.sin(stage.rotation.angle),
                    -rtx * Math.sin(stage.rotation.angle) - rty * (Math.cos(stage.rotation.angle) - 1),
                    1],
            ])(x, y);

            [x, y] = stage.transform([ // translate
                [1, 0, 0],
                [0, 1, 0],
                [stage.shift.x * stage.px_per_sm, stage.shift.y * stage.px_per_sm, 1],
            ])(x, y);

            // console.log({x, y, m})
        }

        // console.log(x,y,m)

        // x *= stage.px_per_sm
        // y *= stage.px_per_sm

        return [
            stage.ox((x * m[0][0] + y * m[1][0] + m[2][0]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
            stage.oy((x * m[0][1] + y * m[1][1] + m[2][1]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
        ]
    }
}

stage.transform = (m: ITransformMatrix) => (x: number, y: number) => [
    ((x * m[0][0] + y * m[1][0] + m[2][0]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
    ((x * m[0][1] + y * m[1][1] + m[2][1]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
]


console.log(stage)
