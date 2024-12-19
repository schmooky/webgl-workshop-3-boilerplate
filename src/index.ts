// Достали шейдеры через магию вита
import fragmentShaderSource from './base.frag?raw';
import vertexShaderSource from './base.vert?raw';

// Забрали канвасик
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;

if (!gl) {
    console.error("WebGL is not supported by your browser.");
    throw new Error("WebGL not supported");
}

// Поставили его на весь экран
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Функция для создания и компиляции шейдеров
function createShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("Shader compile error");
    }

    return shader;
}

// Создаем шейдеры
const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

// Линкуем шейдеры к програме
const shaderProgram = gl.createProgram()!;
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(shaderProgram));
    throw new Error("Program link error");
}

// Создаем буффер
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

const vertices = new Float32Array([
    0,  1, 0,
   -1, -1, 0,
    1, -1, 0
]);

gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Получаем локацию аттрибутов и юниформов
const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
if (positionLocation === -1) {
    console.error("Failed to get attribute location for aPosition");
    throw new Error("Attribute location not found");
}

const uTimeLocation = gl.getUniformLocation(shaderProgram, "uTime");
if (uTimeLocation === null) {
    console.error("Failed to get uniform location for uTime");
    throw new Error("Uniform location not found");
}

// Настраиваем позиции через массив
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// Наш рендер-луп
function render(time: number) {
    const uTime = time * 0.001; // Еее конвертация

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    // Сетаем юниформ
    gl.uniform1f(uTimeLocation, uTime);

    // Рисуем треугольники
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Просим еще кадр
    requestAnimationFrame(render);
}

// Погнали)
requestAnimationFrame(render);