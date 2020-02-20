import Color from '../Color';

class Line {
  constructor(fromPoint, toPoint, color) {
    if (Number.isNaN(fromPoint.x)) throw new Error('x is not a number');
    if (Number.isNaN(fromPoint.y)) throw new Error('y is not a number');
    if (Number.isNaN(toPoint.x)) throw new Error('x is not a number');
    if (Number.isNaN(toPoint.y)) throw new Error('y is not a number');

    this.from = fromPoint;
    this.to = toPoint;
	this.color = color;
  }
}

export default Line