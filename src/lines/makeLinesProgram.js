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
  //gl_FragColor = vColor;
}
`;

// TODO: this needs to be in a separate file, with proper resource management
let lineProgramCache = new Map(); // maps from GL context to program

function makeLineProgram(gl, data, drawTriangles, is3D) {
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

<<<<<<< HEAD
  function draw(transform, count, screen) {
=======
  function draw(lineCollection, drawContext) {
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
    if (data.length === 0) return;
    var size = is3D ? 3 : 2;

    gl.useProgram(lineProgram);

<<<<<<< HEAD
    gl.uniformMatrix4fv(locations.uniforms.uTransform, false, transform.getArray());
    gl.uniform2f(locations.uniforms.uScreenSize, screen.width, screen.height);
    //gl.uniform4f(locations.uniforms.uColor, color.r, color.g, color.b, color.a);
=======
    gl.uniformMatrix4fv(locations.uniforms.uModel, false, lineCollection.worldModel);
    gl.uniformMatrix4fv(locations.uniforms.uCamera, false, drawContext.camera);
    gl.uniformMatrix4fv(locations.uniforms.uView, false, drawContext.view);
    gl.uniform3fv(locations.uniforms.uOrigin, drawContext.origin);

    var color = lineCollection.color;
    gl.uniform4f(locations.uniforms.uColor, color.r, color.g, color.b, color.a);
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494

    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);

    // TODO: Avoid buffering, if data hasn't changed?
    gl.enableVertexAttribArray(locations.attributes.aPosition)
    gl.enableVertexAttribArray(locations.attributes.aColor)

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
<<<<<<< HEAD
    gl.vertexAttribPointer(locations.attributes.aPosition, 2, gl.FLOAT, false, bpe * 5, 0)

    // gl.vertexAttribPointer(locations.attributes.aPosition, 2, gl.FLOAT, false, bpe * 8, 2 * bpe)
    // gl.enableVertexAttribArray(locations.attributes.aPosition)
    gl.vertexAttribPointer(locations.attributes.aColor, 3, gl.FLOAT, false, bpe * 5, 2 * bpe)

    gl.drawArrays(drawType, 0, 2*count);
=======
    gl.vertexAttribPointer(locations.attributes.aPosition, size, gl.FLOAT, false, bpe * size, 0)

    gl.drawArrays(drawType, 0, data.length / size);
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
  }
}
