/**
 * Wire accessor provides access to the buffer that stores wires.
 * 
 * Wires are "lines" with 1.0 width.
 */
 
import Color from '../Color';
class WireAccessor {
  constructor(wireCollection, offset) {
    this.offset = offset;
    this._wire = wireCollection;
  }

  update(from, to) {
    // var buffer = this.buffer;
    var offset = this.offset;

    this._wire.positions[offset + 0] = from.x
    this._wire.positions[offset + 1] = from.y
    this._wire.positions[offset + 3] = to.x
    this._wire.positions[offset + 4] = to.y
   

    if (from.color != null && to.color !== null) this.setColor(from.color, to.color);
  }
  setColor(fromC, toC) {
    const offset = this.offset;
    this._wire.colors[offset + 2] = fromC;
    this._wire.colors[offset + 5] = toC;
  }
}

export default WireAccessor;