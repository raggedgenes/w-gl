import gl_utils from '../glUtils';

export default makeLineProgram;

import shaderGraph from '../shaderGraph/index.js';
import panzoomVS from '../shaderGraph/panzoom.js';

const lineVSSrc = shaderGraph.getVSCode([
  panzoomVS
]);

const lineFSSrc = `
precision highp float;
varying vec4 vColor;

void main() {
  gl_FragColor = vec4(vColor.rgb, 1.0);
}
`;

// TODO: this needs to be in a separate file, with proper resource management
let lineProgramCache = new Map(); // maps from GL context to program

function makeLineProgram(gl, data, drawTriangles) {
  let lineProgram = lineProgramCache.get(gl)
  if (!lineProgram) {
    var lineVSShader = gl_utils.compile(gl, gl.VERTEX_SHADER, lineVSSrc);
    var lineFSShader = gl_utils.compile(gl, gl.FRAGMENT_SHADER, lineFSSrc);
    lineProgram = gl_utils.link(gl, lineVSShader, lineFSShader);
    lineProgramCache.set(gl, lineProgram);
  }

  var locations = gl_utils.getLocations(gl, lineProgram);

  var lineBuffer = gl.createBuffer();
  var bpe = data.BYTES_PER_ELEMENT;
  var drawType = drawTriangles ? gl.TRIANGLES : gl.LINES;
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

  var api = {
    draw,
    dispose
  }

  return api;

  function dispose() {
    gl.deleteBuffer(lineBuffer);
    gl.deleteProgram(lineProgram);
    lineProgramCache.delete(gl);
  }

  function draw(transform, count, screen) {
    if (data.length === 0) return;

    gl.useProgram(lineProgram);

    gl.uniformMatrix4fv(locations.uniforms.uTransform, false, transform.getArray());
    gl.uniform2f(locations.uniforms.uScreenSize, screen.width, screen.height);
    //gl.uniform4f(locations.uniforms.uColor, color.r, color.g, color.b, color.a);

    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
 
    // TODO: Avoid buffering, if data hasn't changed?
	gl.enableVertexAttribArray(locations.attributes.aPosition)
    gl.enableVertexAttribArray(locations.attributes.aColor)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(locations.attributes.aPosition, 2, gl.FLOAT, false, bpe * 5, 0)
    gl.vertexAttribPointer(locations.attributes.aColor, 3, gl.FLOAT, false, bpe * 5, 2 * bpe)
    gl.drawArrays(drawType, 0, 2*count);
  }
}
