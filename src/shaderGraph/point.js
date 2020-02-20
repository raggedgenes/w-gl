export default {
  globals() {
    return `
attribute float aPointSize;

`;
  },
  mainBody() {
    return `
<<<<<<< HEAD
  gl_PointSize = aPointSize * transformed[0][0];

=======
    float cameraDist = length( mvPosition.xyz - uOrigin );
  gl_PointSize = max(aPointSize * 128./cameraDist, 2.);
  vColor = aColor;
>>>>>>> 243efc3d94c429e7fec3ebe18e91ab66fe480494
`;
  }
};