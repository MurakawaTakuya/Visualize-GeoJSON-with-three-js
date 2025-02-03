export const vertexShaderUniforms = `
      varying vec2 vUv;
      attribute float uDistance;
      attribute float uDirection;
      varying float vDistance;
      varying float vDirection;
    `;
export const fragmentShaderUniforms = `
      uniform float uTime;
      varying float vDirection;
      varying float vDistance;
      varying vec2 vUv;
    `;
export const fragmentShaderLogic = `
      vec2 p;
      p.x = vUv.x * vDistance;
      p.y = vUv.y * 1.0 - 0.5;

      float centerDistY = p.y;
      float offset = abs(centerDistY) * 0.5;

      float time = uTime;
      if(centerDistY < 0.0) {
        if(vDirection == 1.0){
          time = -uTime;
          offset = -offset;
        } else if(vDirection == 2.0) {
          offset = offset;
        }
      }

      float line = mod(p.x - time + offset, 1.9) < 0.9 ? 1.0 : 0.0;
      vec3 mainColor;
      if(vDirection == 1.0) {
        mainColor = vec3(0.0, 1.0, 1.0);
      } else if(vDirection == 2.0) {
        mainColor = vec3(1.0, 1.0, 0.0);
      }
      vec3 color = mix(mainColor, mainColor, line);

      gl_FragColor = vec4(color, line * 0.7);
    `;
