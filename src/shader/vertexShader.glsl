varying vec3 vPosition;
uniform float uTime;

void main() {
    vPosition = position;

    vec3 pos = position;

    // Rotating a model around Y axis
    pos.x += sin(uTime * 0.8);
    pos.z += cos(uTime * 0.8);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 8.0 / -mvPosition.z;
}