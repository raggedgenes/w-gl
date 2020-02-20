/**
 * Wire accessor provides access to the buffer that stores wires.
 * 
 * Wires are "lines" with 1.0 width.
 */
 
import Color from '../Color';
class WireAccessor {
  constructor(buffer, offset, color) {
    this.offset = offset;
    this.buffer = buffer;
    this.color = color || new Color(1, 1, 1, 1); 
  }

  update(from, to) {
    var buffer = this.buffer;
    var offset = this.offset;

    buffer[offset + 0] = from.x
    buffer[offset + 1] = from.y

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
  }
}

export default WireAccessor;