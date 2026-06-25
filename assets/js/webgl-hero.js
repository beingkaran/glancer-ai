// WebGL Hero Animation — Interactive particle transitions
class WebGLHero {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!this.gl) {
      console.warn('WebGL2 not supported, falling back to WebGL');
      this.gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    }

    this.gl.clearColor(0, 0, 0, 0);
    this.particles = [];
    this.time = 0;
    this.particleCount = 150;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseOver = false;

    this.setupShaders();
    this.initParticles();
    this.resize();
    this.setupEventListeners();
    this.animate();
  }

  setupShaders() {
    const vsSource = `
      #version 100
      precision highp float;

      attribute vec2 position;
      attribute vec3 color;
      attribute float size;
      attribute float life;

      uniform mat4 projection;

      varying vec4 vColor;
      varying float vLife;

      void main() {
        vColor = vec4(color, 1.0);
        vLife = life;
        gl_PointSize = size * (0.5 + 0.5 * life);
        gl_Position = projection * vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      #version 100
      precision highp float;

      varying vec4 vColor;
      varying float vLife;

      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        float alpha = (1.0 - dist * dist) * vLife;
        gl_FragColor = vec4(vColor.rgb, alpha * 0.8);
      }
    `;

    const vertexShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program link failed:', this.gl.getProgramInfoLog(this.program));
    }
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  initParticles() {
    this.positions = new Float32Array(this.particleCount * 2);
    this.velocities = new Float32Array(this.particleCount * 2);
    this.colors = new Float32Array(this.particleCount * 3);
    this.sizes = new Float32Array(this.particleCount);
    this.lives = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      this.resetParticle(i);
    }
  }

  resetParticle(i) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;

    this.positions[i * 2] = (Math.random() - 0.5) * this.canvas.width;
    this.positions[i * 2 + 1] = (Math.random() - 0.5) * this.canvas.height;

    this.velocities[i * 2] = Math.cos(angle) * speed;
    this.velocities[i * 2 + 1] = Math.sin(angle) * speed;

    // Blend between brand and accent colors
    const blend = Math.random();
    if (blend < 0.5) {
      // Brand blue (#1769ff)
      this.colors[i * 3] = 0.09 + Math.random() * 0.2;
      this.colors[i * 3 + 1] = 0.41 + Math.random() * 0.2;
      this.colors[i * 3 + 2] = 1.0;
    } else {
      // Accent green (#16a34a)
      this.colors[i * 3] = 0.09 + Math.random() * 0.2;
      this.colors[i * 3 + 1] = 0.64 + Math.random() * 0.2;
      this.colors[i * 3 + 2] = 0.29 + Math.random() * 0.2;
    }

    this.sizes[i] = 4 + Math.random() * 8;
    this.lives[i] = 1.0;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left - rect.width / 2;
      this.mouseY = e.clientY - rect.top - rect.height / 2;
      this.isMouseOver = true;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseOver = false;
    });
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    const left = -this.canvas.width / 2;
    const right = this.canvas.width / 2;
    const top = this.canvas.height / 2;
    const bottom = -this.canvas.height / 2;

    const projection = this.orthoMatrix(left, right, bottom, top, 0, 1);
    this.projectionLoc = this.gl.getUniformLocation(this.program, 'projection');
    this.gl.useProgram(this.program);
    this.gl.uniformMatrix4fv(this.projectionLoc, false, projection);
  }

  orthoMatrix(left, right, bottom, top, near, far) {
    const result = new Float32Array(16);
    result[0] = 2 / (right - left);
    result[5] = 2 / (top - bottom);
    result[10] = -2 / (far - near);
    result[12] = -(right + left) / (right - left);
    result[13] = -(top + bottom) / (top - bottom);
    result[14] = -(far + near) / (far - near);
    result[15] = 1;
    return result;
  }

  update() {
    this.time += 0.016;

    for (let i = 0; i < this.particleCount; i++) {
      let x = this.positions[i * 2];
      let y = this.positions[i * 2 + 1];
      let vx = this.velocities[i * 2];
      let vy = this.velocities[i * 2 + 1];

      // Mouse attraction when hovering
      if (this.isMouseOver) {
        const dx = this.mouseX - x;
        const dy = this.mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 0.15;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
        }
      }

      // Damping and drift
      vx *= 0.98;
      vy *= 0.98;
      vy -= 0.01; // Slight upward drift

      x += vx;
      y += vy;

      // Wrap around edges
      if (x > this.canvas.width / 2) x = -this.canvas.width / 2;
      if (x < -this.canvas.width / 2) x = this.canvas.width / 2;
      if (y > this.canvas.height / 2) y = -this.canvas.height / 2;
      if (y < -this.canvas.height / 2) y = this.canvas.height / 2;

      this.positions[i * 2] = x;
      this.positions[i * 2 + 1] = y;
      this.velocities[i * 2] = vx;
      this.velocities[i * 2 + 1] = vy;

      // Fade in/out
      this.lives[i] -= 0.004;
      if (this.lives[i] <= 0) {
        this.resetParticle(i);
        this.lives[i] = 1.0;
      }
    }
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);

    const posLoc = this.gl.getAttribLocation(this.program, 'position');
    const colorLoc = this.gl.getAttribLocation(this.program, 'color');
    const sizeLoc = this.gl.getAttribLocation(this.program, 'size');
    const lifeLoc = this.gl.getAttribLocation(this.program, 'life');

    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(colorLoc);
    this.gl.vertexAttribPointer(colorLoc, 3, this.gl.FLOAT, false, 0, 0);

    const sizeBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.sizes, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(sizeLoc);
    this.gl.vertexAttribPointer(sizeLoc, 1, this.gl.FLOAT, false, 0, 0);

    const lifeBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, lifeBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.lives, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(lifeLoc);
    this.gl.vertexAttribPointer(lifeLoc, 1, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
  }

  animate = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.animate);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-hero');
  if (canvas) {
    try {
      new WebGLHero(canvas);
    } catch (e) {
      console.error('WebGL hero failed to initialize:', e);
      canvas.style.display = 'none';
    }
  }
});
