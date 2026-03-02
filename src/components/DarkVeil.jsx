import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './DarkVeil.css';

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;

// Optimized Noise for stability
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * u);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float n = noise(uv * 3.0 + uTime * 0.1);
    
    // Deep Dark Aesthetic matching the portfolio
    vec3 color1 = vec3(0.02, 0.04, 0.08); // Dark Blue
    vec3 color2 = vec3(0.05, 0.02, 0.1);  // Dark Purple
    
    vec3 finalColor = mix(color1, color2, n);
    finalColor *= (0.9 + 0.1 * sin(uTime + uv.x * 5.0));
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function DarkVeil({ speed = 0.5 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let renderer, gl, program, mesh, frame;

    const resize = () => {
      if (!canvas || !canvas.parentElement || !renderer) return;
      const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight;
      renderer.setSize(w, h);
      if (program) program.uniforms.uResolution.value.set(w, h);
    };

    try {
        renderer = new Renderer({ dpr: 1, canvas, alpha: true });
        gl = renderer.gl;
        
        program = new Program(gl, {
          vertex,
          fragment,
          uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new Vec2() },
          }
        });

        // SAFETY: Jika shader gagal, hentikan proses untuk cegah TypeError
        if (!program.program) throw new Error("Shader link failed");

        mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

        window.addEventListener('resize', resize);
        resize();

        const loop = (t) => {
          if (!program || !renderer || !mesh) return; // Prevent crash on unmount
          program.uniforms.uTime.value = t * 0.001 * speed;
          renderer.render({ scene: mesh });
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
    } catch (e) {
        console.warn("DarkVeil rendering skipped to prevent crash.");
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
      }
    };
  }, [speed]);

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0, background: '#050505' }} />;
}
