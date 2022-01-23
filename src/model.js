import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import vertex from './shader/vertexShader.glsl';
import fragment from './shader/fragmentShader.glsl';

class Model {
  constructor(obj) {
    console.log(obj);
    this.name = obj.name;
    this.file = obj.file;
    this.scene = obj.scene;
    this.placeOnLoad = obj.placeOnLoad;

    this.isActive = false;

    this.color1 = obj.color1;
    this.color2 = obj.color2;

    this.background = obj.background;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./draco/');
    this.loader.setDRACOLoader(this.dracoLoader);

    console.log(this.loader);

    this.init();
  }

  init() {
    this.loader.load(this.file, (response) => {
      // Model mesh
      this.mesh = response.scene.children[0];

      // Material mesh
      this.material = new THREE.MeshBasicMaterial({
        color: 'yellow',
        wireframe: true,
      });
      this.mesh.material = this.material;

      // Geometry mesh
      this.geometry = this.mesh.geometry;

      // Particles material

      // this.particlesMaterial = new THREE.PointsMaterial({
      //   color: '#1597FB',
      //   size: 0.02,
      // });

      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color(this.color1) },
          uColor2: { value: new THREE.Color(this.color2) },
          uTime: { value: 0 },
          uScale: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      // Particles geometry
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      const numParticles = 20000;

      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);
      const partcileRandomness = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set(
          [newPosition.x, newPosition.y, newPosition.z],
          i * 3
        );

        partcileRandomness.set(
          [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
          i * 3
        );
      }

      this.particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPosition, 3)
      );
      this.particlesGeometry.setAttribute(
        'aRandom',
        new THREE.BufferAttribute(partcileRandomness, 3)
      );

      console.log(this.particlesGeometry);

      // Particles
      this.particles = new THREE.Points(
        this.particlesGeometry,
        this.particlesMaterial
      );

      // Adding a skull model by default
      if (this.placeOnLoad) {
        this.add();
      }
    });
  }

  add() {
    this.scene.add(this.particles);

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 1,
      ease: 'back.out',
      delay: 0.3,
      duration: 1.0,
    });

    gsap.to('body', { backgroundColor: this.background, duration: 0.8 });

    if (!this.isActive) {
      gsap.fromTo(
        this.particles.rotation,
        {
          y: Math.PI,
        },
        {
          y: 0,
          duration: 0.8,
          ease: 'back.out',
        }
      );
    }

    this.isActive = true;
  }

  remove() {
    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 0,
      autoAlpha: 0,
      onComplete: () => {
        this.isActive = false;
        this.scene.remove(this.particles);
      },
    });

    gsap.to(this.particles.rotation, {
      y: Math.PI,
      duration: 0.8,
      ease: 'power3.out',
    });
  }
}

export default Model;
