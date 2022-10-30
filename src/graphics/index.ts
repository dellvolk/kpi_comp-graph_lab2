import {stage} from './stage'
import Grid from './grid'
import Circle from './circle'
import {ICore, IPoint} from "./types";
import Line, {LineDeg, LinePoint} from "./line";

const point = (x: number, y: number): IPoint => ({x, y})

export default function (): ICore {

    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.beginPath();

    let historyInflectionPoints:number[] = []

    stage.ctx = ctx;

    const {height: HEIGHT, width: WIDTH} = stage

    canvas.width = WIDTH
    canvas.height = HEIGHT

    const grid = Grid(ctx)

    // @ts-ignore
    window.ctx = ctx

    stage.setTransformMatrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ])

    function drawPoints() {
        ctx.strokeStyle = 'blue' // pivot point
        Circle(stage.rotation.x, stage.rotation.y, .1)

        ctx.strokeStyle = 'green' // active point
        const {activePointIndex, figure: {a}} = stage;
        const x = 2 * a * Math.cos(activePointIndex) * (1 + Math.cos(activePointIndex)),
            y = 2 * a * Math.sin(activePointIndex) * (1 + Math.cos(activePointIndex));
        Circle(x, y, .1)

        ctx.strokeStyle = 'black'
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.draw()

        ctx.beginPath()

        figure()

        drawPoints()

        drawResults()

        drawTangent()
        drawNormal()

        drawInflectionPoints()

        ctx.closePath()

        stage.init = false;
    }

    function drawInflectionPoints() {
        const {isInflectionPoints, figure: {a}} = stage
        if (!isInflectionPoints) return void 0;

        const _drawPoint = (t:number) => {
            ctx.strokeStyle = 'purple' // active point
            const _x = 2 * a * Math.cos(t) * (1 + Math.cos(t)),
                _y = 2 * a * Math.sin(t) * (1 + Math.cos(t));
            Circle(_x, _y, .1)
            ctx.strokeStyle = 'black'
        }

        if (historyInflectionPoints.length > 0) {
            historyInflectionPoints.forEach(i => _drawPoint(i))
            return void 0;
        }

        const step = .0001
        for (let t = 0; t < Math.PI * 2; t += step) {
            const x = (-2 * a * Math.cos(t) - 4 * a * Math.cos(2 * t))
            const y = (-2 * a * Math.sin(t) - 4 * a * Math.sin(2 * t))
            // console.log({x,y})
            if ((-0.001 <= x && x <= 0.001) || (-0.001 <= y && y <= 0.001)) {
                historyInflectionPoints.push(t)
                _drawPoint(t)
                t += 0.05
                // console.log({x, y, t})
            }
        }
    }

    function drawResults() {
        const {arc: {show, from: _from, to: _to}, figure: {a}} = stage
        if (!show) return void 0;

        try { // Arc length
            const $node = document.querySelector('#menu_result') as HTMLInputElement;

            const from = _from
            const to = _to
            // const to = _to > Math.PI ? Math.PI - _to : _to

            const length = 8 * a * (Math.sin(to / 2) - Math.sin(from / 2))

            $node.value = length.toString();
        } catch (e) {
            console.error(e)
            alert('Error in draw arc length')
        }

        try { // Area
            const $node = document.querySelector('#menu_area') as HTMLInputElement;

            $node.value = (6 * Math.PI * Math.pow(a, 2)).toString();
        } catch (e) {
            console.error(e)
            alert('Error in draw arc length')
        }
    }

    function drawTangent() {
        if (!stage.isTangent) return void 0;
        ctx.strokeStyle = 'red'

        const {activePointIndex: t, figure: {a}} = stage;
        const p = point(
            2 * a * Math.cos(t) * (1 + Math.cos(t)),
            2 * a * Math.sin(t) * (1 + Math.cos(t))
        )

        const q = point(
            2 * a * (-(Math.cos(t) + 1) * Math.sin(t) - Math.cos(t) * Math.sin(t)),
            2 * a * (Math.cos(t) * (Math.cos(t) + 1) - Math.pow(Math.sin(t), 2))
        )
        const der = q.y / q.x
        const y = p.y + der * (-p.x)

        LinePoint(...LineDeg(p, point(0, y), 3))
        ctx.strokeStyle = 'black'
    }

    function drawNormal() {
        if (!stage.isNormal) return void 0;
        ctx.strokeStyle = 'green'

        const {activePointIndex: t, figure: {a}} = stage;
        const p = point(
            2 * a * Math.cos(t) * (1 + Math.cos(t)),
            2 * a * Math.sin(t) * (1 + Math.cos(t))
        )

        const q = point(
            2 * a * (-(Math.cos(t) + 1) * Math.sin(t) - Math.cos(t) * Math.sin(t)),
            2 * a * (Math.cos(t) * (Math.cos(t) + 1) - Math.pow(Math.sin(t), 2))
        )
        const der = q.y / q.x
        const y = p.y + der * (-p.x)

        LinePoint(...LineDeg(p, point(0, y), 5, Math.PI / 2))
        ctx.strokeStyle = 'black'
    }

    function figure() {
        const {figure: {a}, arc: {show, from: _from, to: _to}} = stage
        // const history = []

        const step = .05

        let px = 2 * a * Math.cos(-Math.PI) * (1 + Math.cos(-Math.PI)),
            // let px = 2 * a * Math.cos(0) * (1 + Math.cos(0)),
            py = 2 * a * Math.sin(-Math.PI) * (1 + Math.cos(-Math.PI)),
            // py = 2 * a * Math.sin(0) * (1 + Math.cos(0)),
            qx,
            qy;

        // const from = (_from + 2 * Math.PI) % 2 * Math.PI
        // const to = (_to + 2 * Math.PI) % 2 * Math.PI
        // const to = _to < 0 ? 2 * Math.PI + _to : _to

        for (let t = step, _t = -Math.PI + step; t < 2 * Math.PI + step; t += step, _t += step) {
            qx = 2 * a * Math.cos(_t) * (1 + Math.cos(_t))
            qy = 2 * a * Math.sin(_t) * (1 + Math.cos(_t))

            if (show && _from < _to) {

                if (_from <= _t && _t <= _to) {
                    ctx.strokeStyle = 'orange'
                } else {
                    ctx.strokeStyle = 'black'
                }

            }

            // if (show && _from < _to && t >= from && (t <= to || to === Math.PI * 2)) {
            //     ctx.strokeStyle = 'orange'
            // } else {
            //     ctx.strokeStyle = 'black'
            // }

            Line(px, py, qx, qy)
            // history.push(point(qx, qy))

            px = qx;
            py = qy;
        }

        // return history
    }

    function set(changed: string, value: number) {
        const [type, key] = changed.split('.')
        if (!key) {
            // @ts-ignore
            stage[changed] = value
            // draw()
            // return void 0;
        } else {
            // @ts-ignore
            stage[type][key] = value
        }

        if (type === 'affine') {

            let {xx, xy, yx, yy, ox, oy} = stage.affine

            // xx /= stage.px_per_sm
            // xy /= stage.px_per_sm
            // yx /= stage.px_per_sm
            // yy /= stage.px_per_sm
            // ox *= stage.px_per_sm
            // oy *= stage.px_per_sm

            // console.log([
            //     [xx, xy, 0],
            //     [yx, yy, 0],
            //     [ox, oy, 1],
            // ])

            stage.setTransformMatrix([
                [xx, xy, 0],
                [yx, yy, 0],
                [ox, oy, 1],
            ])
        } else if (type === 'projective') {
            let {xx, xy, yx, yy, ox, oy, wx, wy, wo} = stage.projective

            // xx /= stage.px_per_sm
            // xy /= stage.px_per_sm
            // yx /= stage.px_per_sm
            // yy /= stage.px_per_sm
            // wx /= stage.px_per_sm * 100
            // wy /= stage.px_per_sm * 100
            // wo /= stage.px_per_sm
            // ox *= stage.px_per_sm
            // oy *= stage.px_per_sm

            xx *= stage.px_per_sm
            xy *= stage.px_per_sm
            yx *= stage.px_per_sm
            yy *= stage.px_per_sm

            ox *= stage.px_per_sm
            oy *= stage.px_per_sm
            // xx *= stage.px_per_sm

            // console.log([
            //     [xx, xy, wx],
            //     [yx, yy, wy],
            //     [ox, oy, wo],
            // ])

            stage.setTransformMatrix([
                [xx * wx, xy * wx, wx],
                [yx * wy, yy * wy, wy],
                [ox * wo, oy * wo, wo],
            ])
        }

        // switch (type) {
        //     case 'shift':
        //
        //
        //         break;
        //     default:
        //         break;
        // }

        draw()

    }

    // draw()

    return {
        draw,
        set,
    }
}


