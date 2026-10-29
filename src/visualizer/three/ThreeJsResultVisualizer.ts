/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { IQScoreResult } from '../../core/models/types';
import { IResultVisualizer } from '../interfaces/IResultVisualizer';

export class ThreeJsResultVisualizer implements IResultVisualizer {
  private container: HTMLElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private frameId: number = 0;
  private isDisposed: boolean = false;
  private autoRotate: boolean = true;
  private viewMode: 'gaussian' | 'neural' | 'combined' = 'combined';

  private gaussianGroup: THREE.Group = new THREE.Group();
  private neuralGroup: THREE.Group = new THREE.Group();
  private userMarkerGroup: THREE.Group = new THREE.Group();

  // Pointer dragging state
  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private targetRotation = { x: 0.35, y: -0.4 };
  private currentRotation = { x: 0.35, y: -0.4 };

  // Reusable vectors to avoid GC in animation loop
  private readonly _tempVec = new THREE.Vector3();
  private particlesData: Array<{ velocity: THREE.Vector3; position: THREE.Vector3 }> = [];
  private particlePositions: Float32Array | null = null;
  private particleSystem: THREE.Points | null = null;
  private linesMesh: THREE.LineSegments | null = null;

  public mount(container: HTMLElement, result: IQScoreResult): void {
    this.unmount();
    this.container = container;
    this.isDisposed = false;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Detect software WebGL renderer for performance optimizations
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // Initialize scene and camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.035);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 4.5, 9.5);
    this.camera.lookAt(0, 0, 0);

    // Lighting rig
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.2);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    keyLight.position.set(5, 8, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-5, -3, -5);
    this.scene.add(rimLight);

    // Build scene graph
    this.scene.add(this.gaussianGroup);
    this.scene.add(this.neuralGroup);
    this.scene.add(this.userMarkerGroup);

    this.buildGaussianBellCurve(result);
    this.buildNeuralNetwork(result);
    this.buildUserScoreMarker(result);

    this.setupEventListeners();
    this.startLoop(isSoftwareGl);
  }

  public setViewMode(mode: 'gaussian' | 'neural' | 'combined'): void {
    this.viewMode = mode;
    this.gaussianGroup.visible = mode === 'gaussian' || mode === 'combined';
    this.neuralGroup.visible = mode === 'neural' || mode === 'combined';
  }

  public toggleAutoRotate(enabled: boolean): void {
    this.autoRotate = enabled;
  }

  public resetCamera(): void {
    this.targetRotation.x = 0.35;
    this.targetRotation.y = -0.4;
    if (this.camera) {
      this.camera.position.set(0, 4.5, 9.5);
      this.camera.lookAt(0, 0, 0);
    }
  }

  private buildGaussianBellCurve(result: IQScoreResult): void {
    // Clear previous
    while (this.gaussianGroup.children.length > 0) {
      const child = this.gaussianGroup.children[0];
      this.gaussianGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    const segments = 48;
    const size = 7.0;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const colorA = new THREE.Color(0x312e81); // Indigo deep
    const colorB = new THREE.Color(0x06b6d4); // Cyan bright
    const tempColor = new THREE.Color();

    const sigma = 1.4;
    const peakHeight = 2.4;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r2 = x * x + z * z;
      const y = peakHeight * Math.exp(-r2 / (2 * sigma * sigma));
      pos.setY(i, y);

      const normalizedH = Math.min(1, Math.max(0, y / peakHeight));
      tempColor.copy(colorA).lerp(colorB, normalizedH);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const wireMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const mesh = new THREE.Mesh(geometry, wireMat);
    mesh.position.y = -0.6;
    this.gaussianGroup.add(mesh);

    // Base coordinate rings
    for (let ringR = 1.0; ringR <= 3.2; ringR += 1.1) {
      const ringGeo = new THREE.RingGeometry(ringR - 0.02, ringR, 64);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x4338ca,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = -0.59;
      this.gaussianGroup.add(ringMesh);
    }
  }

  private buildUserScoreMarker(result: IQScoreResult): void {
    while (this.userMarkerGroup.children.length > 0) {
      const child = this.userMarkerGroup.children[0];
      this.userMarkerGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    // Map IQ to x coordinate along bell curve (z-score: 1 SD = 1.1 units)
    const zScore = (result.iqScore - 100) / 15;
    const markerX = Math.min(2.8, Math.max(-2.8, zScore * 1.1));
    const markerZ = 0;

    const sigma = 1.4;
    const peakHeight = 2.4;
    const markerY = -0.6 + peakHeight * Math.exp(-(markerX * markerX) / (2 * sigma * sigma));

    // Glowing Sphere at User Score
    const sphereGeo = new THREE.SphereGeometry(0.16, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(markerX, markerY, markerZ);
    this.userMarkerGroup.add(sphereMesh);

    // Vertical Light Column / Beacon
    const cylinderGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.0, 16);
    const cylinderMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinderMesh.position.set(markerX, markerY + 2.0, markerZ);
    this.userMarkerGroup.add(cylinderMesh);

    // Pulsing Beacon Halo Ring
    const haloGeo = new THREE.RingGeometry(0.24, 0.28, 32);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(markerX, markerY + 0.02, markerZ);
    this.userMarkerGroup.add(haloMesh);
  }

  private buildNeuralNetwork(result: IQScoreResult): void {
    while (this.neuralGroup.children.length > 0) {
      const child = this.neuralGroup.children[0];
      this.neuralGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    const particleCount = 85;
    const maxDistance = 1.6;
    const groupRadius = 3.6;

    this.particlePositions = new Float32Array(particleCount * 3);
    this.particlesData = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.cbrt(Math.random()) * groupRadius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6 + 0.5;
      const z = r * Math.cos(phi);

      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;

      this.particlesData.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ),
      });
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const particlesMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.1,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });

    this.particleSystem = new THREE.Points(particlesGeo, particlesMat);
    this.neuralGroup.add(this.particleSystem);

    // Dynamic synaptic line segments
    const maxConnections = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxConnections * 6);

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const linesMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    this.linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    this.neuralGroup.add(this.linesMesh);
  }

  private setupEventListeners(): void {
    if (!this.container) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.006;
      this.targetRotation.x = Math.max(
        0.05,
        Math.min(1.2, this.targetRotation.x + deltaY * 0.006)
      );

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    const handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    const dom = this.renderer?.domElement;
    if (dom) {
      dom.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      dom.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
      window.addEventListener('resize', handleResize);
    }
  }

  private startLoop(isSoftwareGl: boolean): void {
    let lastTime = performance.now();

    const tick = () => {
      if (this.isDisposed || !this.renderer || !this.scene || !this.camera) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Auto rotation
      if (this.autoRotate && !this.isDragging) {
        this.targetRotation.y += 0.2 * delta;
      }

      // Smooth damping interpolation
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

      // Rotate root groups
      this.gaussianGroup.rotation.y = this.currentRotation.y;
      this.gaussianGroup.rotation.x = this.currentRotation.x;

      this.userMarkerGroup.rotation.y = this.currentRotation.y;
      this.userMarkerGroup.rotation.x = this.currentRotation.x;

      this.neuralGroup.rotation.y = this.currentRotation.y * 0.7;
      this.neuralGroup.rotation.x = this.currentRotation.x * 0.7;

      // Update particle network
      if (this.particlePositions && this.linesMesh && this.particleSystem) {
        const count = this.particlesData.length;
        const linePosAttr = this.linesMesh.geometry.attributes.position as THREE.BufferAttribute;
        const lineArr = linePosAttr.array as Float32Array;
        let lineIdx = 0;

        for (let i = 0; i < count; i++) {
          const p = this.particlesData[i];
          p.position.add(p.velocity);

          // Bounce within bounds
          if (Math.abs(p.position.x) > 3.2) p.velocity.x *= -1;
          if (Math.abs(p.position.y) > 2.0) p.velocity.y *= -1;
          if (Math.abs(p.position.z) > 3.2) p.velocity.z *= -1;

          this.particlePositions[i * 3] = p.position.x;
          this.particlePositions[i * 3 + 1] = p.position.y;
          this.particlePositions[i * 3 + 2] = p.position.z;

          // Connect nearby particles
          for (let j = i + 1; j < count; j++) {
            const pj = this.particlesData[j];
            const dx = p.position.x - pj.position.x;
            const dy = p.position.y - pj.position.y;
            const dz = p.position.z - pj.position.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 1.35) {
              lineArr[lineIdx++] = p.position.x;
              lineArr[lineIdx++] = p.position.y;
              lineArr[lineIdx++] = p.position.z;
              lineArr[lineIdx++] = pj.position.x;
              lineArr[lineIdx++] = pj.position.y;
              lineArr[lineIdx++] = pj.position.z;
            }
          }
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        linePosAttr.needsUpdate = true;
        this.linesMesh.geometry.setDrawRange(0, lineIdx / 3);
      }

      this.renderer.render(this.scene, this.camera);

      if (!isSoftwareGl) {
        this.frameId = requestAnimationFrame(tick);
      } else {
        // Safe paced callback on software WebGL
        this.frameId = window.setTimeout(tick, 33);
      }
    };

    tick();
  }

  public unmount(): void {
    this.isDisposed = true;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      clearTimeout(this.frameId);
    }

    if (this.renderer && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      this.renderer.dispose();
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;
    this.container = null;
  }
}
