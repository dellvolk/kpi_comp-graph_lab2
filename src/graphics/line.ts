import {stage} from './stage'
import {IPoint} from "./types";

export const LinePoint = (a: IPoint, b: IPoint): void => {
    Line(a.x, a.y, b.x, b.y)
}

/* @param c - center point
*  @param p - end point
* */
export const LineDeg = (c: IPoint, p: IPoint, l: number, _deg:number = 0): [IPoint, IPoint] => {
    let x = p.x - c.x,
        y = c.y - p.y; // todo: md swap

    const rad = Math.atan(y / x) + _deg

    const px = l * Math.cos(rad),
        py = l * Math.sin(rad)

    return [
        {x: c.x - px, y: c.y + py},
        {x: c.x + px, y: c.y - py},
    ]
}

// export const LineDeg = (a: IPoint, d: IPoint): [IPoint, IPoint] => {
//     const cr1 = {
//         x: (a.x + d.x) / 2,
//         y: (a.y + d.y) / 2
//     }
//
//     let cr1_x = a.x - d.x
//     let cr1_y = a.y - d.y
//     const cr1_angle = Math.atan(cr1_y / cr1_x)
//     const {
//         startPoint: cr1_start,
//         endPoint: cr1_end
//     } = Circle(cr1.x, cr1.y, r1, cr1_angle, cr1_angle + Math.PI, cr1_angle < 0)
//     LinePoint(cr1_start, a)
//     LinePoint(cr1_end, d)
//
//     return
// }

export default function Line(x1: number, y1: number, x2: number, y2: number): void {
    const {ctx, pos, px_per_sm,} = stage;

    ctx.beginPath()
    ctx.lineWidth = 2;

    x1 *= px_per_sm
    y1 *= px_per_sm

    x2 *= px_per_sm
    y2 *= px_per_sm

    ctx.moveTo(...pos(x1, y1))
    ctx.lineTo(...pos(x2, y2))
    ctx.stroke()

}
