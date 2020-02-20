export default {
  globals() {
    return `
<<<<<<< HEAD
attribute vec2 aPosition;
attribute vec4 aColor;
varying vec4 vColor;
uniform vec2 uScreenSize;
uniform mat4 uTransform;
=======
attribute vec3 aPosition;
uniform mat4 uCamera;
uniform mat4 uModel;
uniform mat4 uView;
uniform vec3 uOrigin;
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
`;
  },
  mainBody() {
    return `
  // Translate screen coordinates to webgl space
<<<<<<< HEAD
  vec2 vv = 2.0 * uTransform[3].xy/uScreenSize;
  transformed[3][0] = vv.x - 1.0;
  transformed[3][1] = 1.0 - vv.y;
  vec2 xy = 2.0 * aPosition/uScreenSize;
  gl_Position = transformed * vec4(xy.x, -xy.y, 0.0, 1.0);
  
  vColor = aColor;
=======
  mat4 modelView = uView * uModel;
  vec4 mvPosition = modelView * vec4( aPosition, 1.0 );

  vec4 glPos = uCamera * mvPosition;
  gl_Position = glPos;
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
`
  }
}