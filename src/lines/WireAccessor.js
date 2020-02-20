/**
 * Wire accessor provides access to the buffer that stores wires.
 * 
 * Wires are "lines" with 1.0 width.
 */

import Color from '../Color';
class WireAccessor {
<<<<<<< HEAD
  constructor(buffer, offset, color) {
    this.offset = offset;
    this.buffer = buffer;
    this.color = color || new Color(1, 1, 1, 1); 
=======
  constructor(wireCollection, offset) {
    this.offset = offset;
    this._wire = wireCollection;
    this.update = wireCollection.is3D ? this.update3D : this.update2D;
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
  }

  update2D(from, to) {
    var positions = this._wire.positions;
    var offset = this.offset;

    positions[offset + 0] = from.x;
    positions[offset + 1] = from.y;
    offset += 2;
    var hasColor = this._wire.allowColors;
    if (hasColor) {
      if (from.color !== undefined) this._wire.colors[offset] = from.color;
      offset += 1;
    }

<<<<<<< HEAD
    buffer[offset + 5] = to.x
    buffer[offset + 6] = to.y

    this.setColor(this.color);
  }
  setColor(color) {
    this.color = color;
    var buffer = this.buffer;
    var offset = this.offset;
    buffer[offset + 2] = color.r
    buffer[offset + 3] = color.g
    buffer[offset + 4] = color.b
    buffer[offset + 7] = color.r
    buffer[offset + 8] = color.g
    buffer[offset + 9] = color.b
=======
    positions[offset + 0] = to.x
    positions[offset + 1] = to.y
    if (hasColor && to.color) {
      this._wire.colors[offset + 2] = to.color;
    }
  }

  update3D(from, to) {
    var positions = this._wire.positions;
    var offset = this.offset;

    positions[offset + 0] = from.x
    positions[offset + 1] = from.y
    positions[offset + 2] = from.z || 0
    offset += 3;
    var hasColor = this._wire.allowColors;
    if (hasColor) {
      if (from.color !== undefined) this._wire.colors[offset] = from.color;
      offset += 1;
    }

    positions[offset + 0] = to.x
    positions[offset + 1] = to.y
    positions[offset + 2] = to.z || 0
    if (hasColor && to.color) this._wire.colors[offset + 3] = to.color;
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
  }
}

export default WireAccessor;