import { die } from "./die.js";
import { GlMatrix } from "./transform.js";

const rotationUniformName = "r";
const aspectRatioUniformName = "a";
const positionAttributeName = "p";

const vertexProgram = `uniform mat4 ${rotationUniformName};uniform float ${aspectRatioUniformName};attribute vec3 ${positionAttributeName};void main(){vec4 t=${rotationUniformName}*vec4(${positionAttributeName},1)+vec4(0,0,-35,0);gl_Position=vec4(t.x*${aspectRatioUniformName},t.y,2,-t.z);}`;

const fragmentProgram = `void main(){gl_FragColor=vec4(1.0,1.0,1.0,1.0);}`;

function compileShader(
  gl: WebGLRenderingContext,
  shaderType: number,
  programText: string,
): WebGLShader {
  const shader = gl.createShader(shaderType);

  if (!shader) {
    //die("createShader");
    die();
  }

  gl.shaderSource(shader, programText);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    //die(`Shader compile: ${log} `);
    //die("shader compile");
    die();
  }

  return shader;
}

function createShaderProgram(gl: WebGLRenderingContext): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexProgram);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentProgram);

  const program = gl.createProgram();

  if (!program) {
    //die("createShader");
    die();
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    //die(`create shader program: ${gl.getProgramInfoLog(program)} `);
    //die("create program");
    die();
  }

  return program;
}

function attribLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
) {
  const result = gl.getAttribLocation(program, name);
  if (result === -1) {
    //die("getAttribLocation");
    die();
  }
  return result;
}

function uniformLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
) {
  const result = gl.getUniformLocation(program, name);
  if (result === null) {
    //die("getUniformLocation");
    die();
  }
  return result;
}

function makeBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (!buffer) {
    //die("makeBuffer");
    die();
  }
  return buffer;
}

export interface ShaderParameterLocations {
  program_: WebGLProgram;
  aspectRatioUniform_: WebGLUniformLocation;
  rotationUniform_: WebGLUniformLocation;
}

export function bindShaderAndGeometry(
  gl: WebGLRenderingContext,
  positions: Float32Array,
  indexes: Uint16Array,
): ShaderParameterLocations {
  if (positions.length >= 1 << 16) {
    //die("Too many vertices");
    die();
  }

  const program = createShaderProgram(gl);
  const vertexPositionAttrib = attribLocation(
    gl,
    program,
    positionAttributeName,
  );

  gl.useProgram(program);

  // in a real program someone should dispose of this I guess
  const positionBuffer = makeBuffer(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // in a real program someone should dispose of this I guess
  const indexBuffer = makeBuffer(gl);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);

  gl.vertexAttribPointer(vertexPositionAttrib, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionAttrib);

  return {
    program_: program,
    aspectRatioUniform_: uniformLocation(gl, program, aspectRatioUniformName),
    rotationUniform_: uniformLocation(gl, program, rotationUniformName),
  };
}

export function setShaderParameters(
  gl: WebGLRenderingContext,
  shaderParameterLocations: ShaderParameterLocations,
  aspectRatio: number,
  rotation: GlMatrix,
) {
  gl.uniformMatrix4fv(
    shaderParameterLocations.rotationUniform_,
    false,
    rotation,
  );
  gl.uniform1f(shaderParameterLocations.aspectRatioUniform_, aspectRatio);
}
