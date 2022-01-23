varying vec3 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
    vec3 color = vec3(1.0, 1.0, 0.4);
    // color.r = 0.0;
    // color = vec3(vPosition.x, vPosition.x, vPosition.x);
    // color = vec3(vPosition.z, vPosition.x, vPosition.y);
    // color = sin(vPosition / 2.0) * 5.0;

    // vec3 color1 = vec3(1.0, 0.0, 0.0);
    // vec3 color2 = vec3(1.0, 1.0, 0.0);
    // vec3 mixedColor = mix(color1, color2, vPosition.z * 0.5 + 0.5);

    float depth = vPosition.z * 0.5 + 0.5;

    vec3 mixedColor = mix(uColor1, uColor2, depth);

    color = mixedColor;

    gl_FragColor = vec4(color , depth * 0.3 + 0.2);
}