import Color from '../Color';

class PointAccessor {
  constructor(pointCollection, offset, data) {
    this._point = pointCollection;
    this.color = 0xffff00ff;
    this.offset = offset;
    if (data !== undefined) {
      this.data = data;
    }
  }

  get x() {
    return this._point.pointsBuffer[this.offset];
  }

  get y() {
    return this._point.pointsBuffer[this.offset + 1];
  }

  update(point) {
    const offset = this.offset;

    if (point.x) this._point.pointsBuffer[offset + 0] = point.x;
    if (point.y) this._point.pointsBuffer[offset + 1] = point.y;
    if (point.size) this._point.pointsBuffer[offset + 2] = point.size;
    if (point.color) this.setColor(point.color);
  }

  setColor(color) {
    this.color = color;
    this._point.colorsBuffer[this.offset + 3] = color;
  }
}

export default PointAccessor;