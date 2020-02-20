import eventify from 'ngraph.events';

import Element from './Element';
import onClap from './clap';
import {mat4, vec4} from 'gl-matrix';
import createMapCamera from './createMapCamera';
import createGameCamera from './createGameCamera';

export default function makeScene(canvas, options) {
  var width;
  var height;
  var pixelRatio = window.devicePixelRatio;
  if (!options) options = {};

  var wglContextOptions = options.wglContext;

  var gl = canvas.getContext('webgl', wglContextOptions) || canvas.getContext('experimental-webgl', wglContextOptions);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT)

  var frameToken = 0;
  var sceneRoot = new Element();

  var view = mat4.create();
  var camera = mat4.create();
  var fov = options.fov === undefined ? Math.PI / 6 : options.fov;
  var near = options.near === undefined ? 1e-2 : options.near;
  var far = options.far === undefined ? Infinity : options.far;

  var drawContext = { 
    width: window.innerWidth,
    height: window.innerHeight,
    canvas,
    camera,
    view,
    fov,
    origin: new Float32Array(3)
 };

  updateCanvasSize();

  var api = eventify({
    appendChild,
    getSceneCoordinate,
    getClientCoordinate,
    getTransform,
    getRoot,
    getGL,
    removeChild,
    setViewBox,
    setClearColor,
    getClearColor,
    clear,
    dispose,
    renderFrame,

    getPixelRatio,
    setPixelRatio,

    getCamera,
    getDrawContext
  });


  sceneRoot.bindScene(api);
  let cameraController = createMapCamera(api, drawContext);
  //let cameraController = createGameCamera(api, drawContext); 

  var disposeClick;
  listenToEvents();

  renderFrame();

  return api;

  function getPixelRatio() {
    return pixelRatio;
  }

  function getDrawContext() {
    return drawContext;
  }

  function setPixelRatio(newPixelRatio) {
    pixelRatio = newPixelRatio;
    updateCanvasSize();
  }

  function getGL() {
    return gl;
  }

  function getRoot() {
    return sceneRoot;
  }

  function getCamera() {
    return cameraController;
  }

  function getTransform() {
    return sceneRoot.model;
  }

  function setClearColor(r, g, b, a) {
    gl.clearColor(r, g, b, a)
  }

  function getClearColor() {
    // [r, g, b, a]
    return gl.getParameter(gl.COLOR_CLEAR_VALUE);
  }

  function listenToEvents() {
    canvas.addEventListener('mousemove', onMouseMove);

    disposeClick = onClap(canvas, onMouseClick, this);

    window.addEventListener('resize', onResize, true);
  }

  function dispose() {
    canvas.removeEventListener('mousemove', onMouseMove);


    if (disposeClick) disposeClick();

    window.removeEventListener('resize', onResize, true);

    cameraController.dispose();
    sceneRoot.dispose();

    if (frameToken) {
      cancelAnimationFrame(frameToken);
      frameToken = 0;
    }
  }

  function onResize() {
    updateCanvasSize();
  }

  function updateCanvasSize() {
    if (options.size) {
      // Fixed size canvas doesn't update. We assume CSS does the scaling.
      width = canvas.width = options.size.width;
      height = canvas.height = options.size.height;
    } else {
      width = canvas.width = canvas.offsetWidth * pixelRatio;
      height = canvas.height = canvas.offsetHeight * pixelRatio;
    }

    gl.viewport(0, 0, width, height);

    drawContext.width = width;
    drawContext.height = height;
    sceneRoot.worldTransformNeedsUpdate = true;
    mat4.perspective(camera, fov, width/height, near, far);
    renderFrame();
  }

  function onMouseClick(e) {
    var p = getSceneCoordinate(e.clientX, e.clientY);
    if (!p) return; // need to zoom in!
    api.fire('click', {
      originalEvent: e,
      sceneX: p.x,
      sceneY: p.y,
    })
  }

  function onMouseMove(e) {
    var p = getSceneCoordinate(e.clientX, e.clientY);
    if (!p) return;

    api.fire('mousemove', {
      originalEvent: e,
      x: p[0],
      y: p[1],
      z: p[2],
    });
  }

  function getSceneCoordinate(clientX, clientY) {
    // TODO: This is not optimized by any means.
    var dpr = api.getPixelRatio();
    let clipSpaceX = (dpr * clientX / width) * 2 - 1;
    let clipSpaceY = (1 - dpr * clientY / height) * 2 - 1;

    var mvp = mat4.multiply(mat4.create(), camera, view)
    mat4.multiply(mvp, mvp, sceneRoot.model);
    var zero = vec4.transformMat4([], [drawContext.origin[0], drawContext.origin[1], -drawContext.origin[2], 1], mvp);
    var iMvp = mat4.invert(mat4.create(), mvp);
    if (!iMvp) {
      // likely they zoomed out too far for this `near` plane.
      return;
    }
    return vec4.transformMat4([], [zero[3] * clipSpaceX, zero[3] * clipSpaceY, zero[2], zero[3]], iMvp);
  }

  function getClientCoordinate(sceneX, sceneY, sceneZ = 0) {
    // TODO: this is not optimized either.
    var mvp = mat4.multiply(mat4.create(), camera, view)
    mat4.multiply(mvp, mvp, sceneRoot.model);
    var coordinate = vec4.transformMat4([], [sceneX, sceneY, sceneZ, 1], mvp);

    var dpr = api.getPixelRatio();
    var x = width * (coordinate[0]/coordinate[3] + 1) * 0.5/dpr;
    var y = height * (1 - (coordinate[1]/coordinate[3] + 1) * 0.5)/dpr;
    return {x, y};
  }

  function setViewBox(rect) {
    cameraController.setViewBox(rect);
  }

  function renderFrame(immediate) {
    if (immediate) {
      return frame();
    }

    if (!frameToken) frameToken = requestAnimationFrame(frame)
  }

  function frame() {
    gl.clear(gl.COLOR_BUFFER_BIT)
    drawContext.wasDirty = sceneRoot.updateWorldTransform();
    sceneRoot.draw(gl, drawContext);
    frameToken = 0;
  }

  function clear() {
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  function appendChild(child, sendToBack) {
    sceneRoot.appendChild(child, sendToBack);
  }

  function removeChild(child) {
    sceneRoot.removeChild(child)
  }
}
