import BaseLineCollection from './BaseLineCollection';
import makeLinesProgram from './makeLinesProgram';
import WireAccessor from './WireAccessor';

/**
 * Unlike lines, wires do not have width, and are always 1px wide, regardless
 * of resolution.
 */
class WireCollection extends BaseLineCollection {
  constructor(capacity) {
    super(capacity, 6); // items per wire

    this.type = 'WireCollection';
  }

  _makeProgram(gl) {
    return makeLinesProgram(gl, this, /* drawTriangles = */ false);
  }

  _addInternal(line, offset) {
    let lineUI = new WireAccessor(this, offset);
    lineUI.update(line.from, line.to);
    return lineUI;
  }
}

export default WireCollection;