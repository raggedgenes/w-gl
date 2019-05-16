export default {
  globals() {
    return `
attribute float aPointSize;

`;
  },
  mainBody() {
    return `
  gl_PointSize = aPointSize * transformed[0][0];

`;
  }
};