precision mediump float;

uniform float uTime;

void main(void) {
    // Используем uniTime для изменения цвета со временем
    gl_FragColor = vec4(0.5 + 0.5 * sin(uTime), 0.5 + 0.5 * cos(uTime), 1.0, 1.0);
}