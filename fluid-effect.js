// Reusable Fluid Effect Component
class FluidEffect {
    constructor(element, options = {}) {
      // Store the element to apply the effect to
      this.container = element;
      
      // Default options that can be overridden
      this.options = {
        viscosityConstant: options.viscosityConstant || 0.98,
        mouseSize: options.mouseSize || 15,
        mouseAmp: options.mouseAmp || 0.03,
        heightCompensation: options.heightCompensation || 0.1,
        showTitles: options.showTitles !== undefined ? options.showTitles : true,
        mainTitle: options.mainTitle || "blue ink",
        subTitle: options.subTitle || "threejs | fluid sim",
        ...options
      };
  
      // Create a container for all the effect elements
      this.effectContainer = document.createElement('div');
      this.effectContainer.style.position = 'relative';
      this.effectContainer.style.width = '100%';
      this.effectContainer.style.height = '100%';
      this.effectContainer.style.overflow = 'hidden';
      this.container.appendChild(this.effectContainer);
      
      // Initialize the effect
      this.init();
      
      // Start animation loop
      this.tick();
      
      // Handle window resize
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);
    }
    
    init() {
      this.initRenderer();
      this.initDebugPlane();
      this.initGPUCompute();
      
      this.iddleData = { waiting: true, th: 0 };
      
      // Add mouse move event listener to the container
      this.effectContainer.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.effectContainer.addEventListener('mouseleave', () => {
        this.iddleData.waiting = true;
      });
    }
    
    
    initRenderer() {
      this.scene = new THREE.Scene();
      
      const rect = this.container.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      const aspectRatio = this.width / this.height;
      const camHeight = this.height / 200;
      const camWidth = camHeight * aspectRatio;
      
      this.camera = new THREE.OrthographicCamera(
          -camWidth / 2, 
          camWidth / 2, 
          camHeight / 2,
          -camHeight / 2, 
          0.1, 
          100
      );
      
      this.camera.position.z = 5;
      this.scene.add(this.camera);
      
      this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.zIndex = '-1';
      this.renderer.domElement.style.pointerEvents = 'auto'; // Already default, but explicit for clarity
      this.effectContainer.appendChild(this.renderer.domElement);
  }
    
    initDebugPlane() {
      const aspectRatio = this.width / this.height;
      const camHeight = this.height / 200;
      const camWidth = camHeight * aspectRatio;
      
      const geometry = new THREE.PlaneBufferGeometry(camWidth, camHeight);
      
      const debugUniforms = {
        u_resolution: { type: "v3", value: new THREE.Vector2(this.width, this.height) },
        u_heightmap: { type: "sampler2D", value: null }
      };
      
      const vertexShader = `
        void main() {
          gl_Position = vec4(position * 1.0, 1.0);
        }
      `;
      
      const fragmentShader = `
        uniform vec2 u_resolution;
        uniform sampler2D u_heightmap;
        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          float h = texture2D(u_heightmap, uv).y;
          float r = texture2D(u_heightmap, uv).x;
          gl_FragColor = vec4(1.65 * abs(h), 1.5 * abs(h), abs(r), 0.1);
        }
      `;
      
      this.debugMat = new THREE.ShaderMaterial({
        uniforms: debugUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      
      this.canvas = new THREE.Mesh(geometry, this.debugMat);
      this.scene.add(this.canvas);
    }
    
    initGPUCompute() {
      const simWidth = this.width / 2;
      const simHeight = this.height / 2;
      
      this.gpuCompute = new THREE.GPUComputationRenderer(simWidth, simHeight, this.renderer);
      
      const heightMap = this.gpuCompute.createTexture();
      
      const heightmapFragmentShader = `
        #include <common>
        uniform vec2 mousePos;
        uniform float mouseSize;
        uniform float viscosityConstant;
        uniform float heightCompensation;
        uniform vec2 windowSize;
        uniform float mouseAmp;
  
        void main() {
          vec2 cellSize = 0.999 / resolution.xy;
          vec2 uv = gl_FragCoord.xy * cellSize;
          // heightmapValue.x == height from previous frame
          // heightmapValue.y == height from penultimate frame
          // heightmapValue.z, heightmapValue.w not used
          vec4 heightmapValue = texture2D(heightmap, uv);
  
          // Get neighbours
          vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));
          vec4 south = texture2D(heightmap, uv + vec2(0.0, -cellSize.y));
          vec4 east = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));
          vec4 west = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0));
  
          float newHeight = ((north.x + south.x + east.x + west.x) * 0.49 - heightmapValue.y) * viscosityConstant;
  
          // Mouse influence
          float distToMouse = length((uv - vec2(0.5)) * windowSize - vec2(mousePos.x, -mousePos.y)); //0..windowSize
          float mouseFallof = cos(clamp(distToMouse * PI / mouseSize, 0.0, PI)) + 1.0; //0..1
          newHeight += mouseFallof * mouseAmp;
  
          heightmapValue.y = heightmapValue.x;
          heightmapValue.x = newHeight;
          
          if(abs(heightmapValue.x) > 0.1)
            heightmapValue.z = 1.0;
          heightmapValue.z = clamp(heightmapValue.z - 0.001, 0.0, 100.0);
  
          gl_FragColor = heightmapValue;
        }
      `;
      
      this.heightmapVariable = this.gpuCompute.addVariable("heightmap", heightmapFragmentShader, heightMap);
      
      this.heightmapVariable.material.uniforms['mousePos'] = { value: new THREE.Vector2(10000, 10000) };
      this.heightmapVariable.material.uniforms['mouseSize'] = { value: this.options.mouseSize };
      this.heightmapVariable.material.uniforms['mouseAmp'] = { value: this.options.mouseAmp };
      this.heightmapVariable.material.uniforms['viscosityConstant'] = { value: this.options.viscosityConstant };
      this.heightmapVariable.material.uniforms['heightCompensation'] = { value: this.options.heightCompensation };
      this.heightmapVariable.material.uniforms['windowSize'] = { 
        value: new THREE.Vector2(this.width.toFixed(1), this.height.toFixed(1)) 
      };
      
      this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]);
      
      const error = this.gpuCompute.init();
      if (error !== null) {
        console.error("compute init error: " + error);
      }
    }
    
    tick() {
      if (this.iddleData.waiting) {
        this.waitingRoutine();
      }
      
      this.gpuCompute.compute();
      this.debugMat.uniforms.u_heightmap.value = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;
      this.renderer.render(this.scene, this.camera);
      
      requestAnimationFrame(this.tick.bind(this));
    }
    
    waitingRoutine() {
      this.iddleData.th += 0.02 * Math.random();
      const uniforms = this.heightmapVariable.material.uniforms;
      const maxDimension = Math.min(this.width, this.height) / 2;
      uniforms['mousePos'].value.set(
        maxDimension * 0.5 * Math.cos(this.iddleData.th),
        maxDimension * 0.25 * Math.sin(this.iddleData.th)
      );
    }
    
    onMouseMove(e) {
      this.iddleData.waiting = false;
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left - this.width / 2;
      const y = e.clientY - rect.top - this.height / 2;
      
      const uniforms = this.heightmapVariable.material.uniforms;
      uniforms['mousePos'].value.set(x, y);
    }
    
    handleResize() {
      const rect = this.container.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      
      // Update renderer size
      this.renderer.setSize(this.width, this.height);
      
      // Update camera
      const aspectRatio = this.width / this.height;
      const camHeight = this.height / this.width;
      const camWidth = camHeight * aspectRatio;
      
      this.camera.left = camWidth / 2;
      this.camera.right = camWidth / 2;
      this.camera.top = camHeight / 2;
      this.camera.bottom = camHeight / 2;
      this.camera.updateProjectionMatrix();
      
      // Update debug plane
      this.scene.remove(this.canvas);
      this.initDebugPlane();
      
      // Update GPU compute
      //this.gpuCompute.dispose();
      this.initGPUCompute();
      
      // Update uniforms
      this.debugMat.uniforms.u_resolution.value = new THREE.Vector2(this.width, this.height);
    }
    
    destroy() {
      // Clean up event listeners
      this.effectContainer.removeEventListener('mousemove', this.onMouseMove);
      this.resizeObserver.disconnect();
      
      // Clean up Three.js resources
      this.renderer.dispose();
      this.scene.remove(this.canvas);
      this.canvas.geometry.dispose();
      this.canvas.material.dispose();
      this.gpuCompute.dispose();
      
      // Remove DOM elements
      this.container.removeChild(this.effectContainer);
    }
  }
  
  // Initialize all elements with the "effect" class
  function initializeFluidEffects() {
    // Make sure Three.js is loaded
    if (!window.THREE) {
      console.error("THREE.js is not loaded");
      return;
    }
    
    // Make sure the GPUComputationRenderer is available
    if (!window.THREE.GPUComputationRenderer) {
      console.error("THREE.GPUComputationRenderer is not available");
      return;
    }
    
    const effectElements = document.querySelectorAll('.effect');
    effectElements.forEach(element => {
      // Get options from data attributes if any
      const options = {
        viscosityConstant: parseFloat(element.dataset.viscosity || 0.98),
        mouseSize: parseFloat(element.dataset.mouseSize || 15),
        mouseAmp: parseFloat(element.dataset.mouseAmp || 0.03),
        showTitles: element.dataset.showTitles !== "false",
        mainTitle: element.dataset.mainTitle || "gold ink",
        subTitle: element.dataset.subTitle || "threejs | fluid sim"
      };
      
      // Initialize the effect
      element.fluidEffect = new FluidEffect(element, options);
    });
  }
  


  