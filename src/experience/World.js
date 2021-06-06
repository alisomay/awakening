import * as THREE from 'three';
import fragment from '../../public/shader/fragment.frag';
import vertex from '../../public/shader/vertex.vert';
import tex1 from '../../public/img/NanoTextile.png';
import { GamesSharp } from '@material-ui/icons';

export class World {
  constructor(options) {
    this.video = options.videoElement;
    this.currentPeak = 0;
    this.lastPeak = 0;
    this.videoTexture = new THREE.VideoTexture(this.video);
    this.scene = new THREE.Scene();
    this.container = options.domElement;
    this.player = options.player;
    this.rayCaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    // console.log(this.width, this.height);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );

    this.replaying = false;
    this.camera.position.set(0, 0, 0.01);
    this.time = 0;
    this.isPlaying = true;
    this.loadTextures();

    this.faceVisible = false;

    this.player.attachLifeCycleListener('onEnded', () => {
      this.faceVisible = false;
      this.material.uniforms.beat1.value = 1.0;
      this.material.uniforms.beat2.value = 1.0;
      this.material.uniforms.uRotation.value = new THREE.Vector3(
        0.0,
        0.0,
        0.0,
      );
      this.material.uniforms.uDisplacementMultiplier.value = 1.0;
      this.material.uniforms.uDistanceToOrigin.value = 1;
      this.material.uniforms.uLightIntensity.value = 0.0;
      this.material.uniforms.uRayMaxDistance.value = 1.0;
      this.material.uniforms.uLightPos.value = new THREE.Vector3(
        -0.14,
        0.1,
        0.4,
      );
    });
    this.player.attachLifeCycleListener(
      'onBar',
      (levels, barCount) => {
        // console.log('BAR : ', barCount);
        if (!this.replaying) {
          if (barCount >= 20 && barCount < 23) {
            this.faceVisible = true;
          } else if (barCount >= 38 && barCount < 47) {
            this.faceVisible = true;
          } else if (barCount >= 49 && barCount < 52) {
            this.faceVisible = true;
          } else if (barCount >= 68 && barCount < 77) {
            this.faceVisible = true;
          } else if (barCount >= 98 && barCount < 106) {
            this.faceVisible = true;
          } else {
            this.faceVisible = false;
          }
        } else {
          if (barCount >= 19 && barCount < 23) {
            this.faceVisible = true;
          } else if (barCount >= 37 && barCount < 47) {
            this.faceVisible = true;
          } else if (barCount >= 48 && barCount < 52) {
            this.faceVisible = true;
          } else if (barCount >= 67 && barCount < 77) {
            this.faceVisible = true;
          } else if (barCount >= 98 && barCount < 106) {
            this.faceVisible = true;
          } else {
            this.faceVisible = false;
          }
        }

        const [avg, peak] = levels;
        if (this.faceVisible) {
          this.material.uniforms.uDisplacementMultiplier.value = 0.0;
        } else {
          let max = 3.2;
          let val = 7 + peak / 4;
          if (val >= max) {
            val = max;
          }
          this.material.uniforms.uDisplacementMultiplier.value = val;
        }
      },
    );
    document
      .getElementsByTagName('canvas')[0]
      .removeAttribute('width');
    document
      .getElementsByTagName('canvas')[0]
      .removeAttribute('height');
  }

  settings() {
    let that = this;
    this.settings = {};
  }

  loadTextures() {
    //setup and load content texture
    this.videoTexture.wrapS = THREE.RepeatWrapping;
    this.videoTexture.wrapT = THREE.RepeatWrapping;
    this.videoTexture.repeat.set(1, 1);

    //load the cubemap
    this.loader = new THREE.CubeTextureLoader();
    this.loader.setPath('public/img/');
    this.textureCube = this.loader.load([
      'n_B.png',
      'n_D.png',
      'n_L.png',
      'p_F.png',
      'p_R.png',
      'p_U.png',
    ]);
  }

  scale(unscaledNum, minAllowed, maxAllowed, min, max) {
    return (
      ((maxAllowed - minAllowed) * (unscaledNum - min)) /
        (max - min) +
      minAllowed
    );
  }
  setupListeners() {
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener(
      'mousemove',
      this.mouseMove.bind(this),
      false,
    );
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  mouseMove(event) {
    this.mouse.x = this.scale(
      event.clientX / window.innerWidth,
      -1,
      1,
      0,
      1,
    );
    this.mouse.y = this.scale(
      event.clientY / window.innerHeight,
      -1,
      1,
      0,
      1,
    );
    this.material.uniforms.uRotation.value = new THREE.Vector3(
      this.mouse.x * 20,
      0.0,
      this.mouse.y * 20,
    );
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives:
          '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        beat1: {
          type: 'f',
          value: 1.0,
        },
        beat2: {
          type: 'f',
          value: 1.0,
        },
        uRotation: {
          type: 'v3',
          value: new THREE.Vector3(0.0, 0.0, 0.0),
        },
        uDisplacementMultiplier: {
          type: 'f',
          value: 1.0,
        },
        uDistanceToOrigin: {
          type: 'f',
          value: 1,
        },
        uLightIntensity: {
          type: 'f',
          value: 0.0,
        },
        uRayMaxDistance: {
          type: 'f',
          value: 1.0,
        },
        uLightPos: {
          type: 'v3',
          value: new THREE.Vector3(-0.14, 0.1, 0.4),
        },
        mouse: {
          type: 'v2',
          value: new THREE.Vector2(this.mouse.x, this.mouse.y),
        },
        time: { type: 'f', value: 0 },
        resolution: {
          type: 'v4',
          value: new THREE.Vector4(this.width, this.height, 0, 0),
        },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
        tex0: {
          type: 't',
          value: this.videoTexture,
        },
        tex1: { value: new THREE.TextureLoader().load(tex1) },
        skybox: { value: this.textureCube },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  animationTimelineStart() {
    gsap.to(this.material.uniforms.uRayMaxDistance, {
      duration: 30,
      value: 100.0,
      ease: 'sine.inOut',
    });
  }

  stop() {
    this.isPlaying = false;
  }

  play(replay) {
    if (replay) {
      this.replaying = true;
    }
    if (!this.isPlaying) {
      this.video.play();
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.01;
    // console.log(this.time);
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.resolution.value = new THREE.Vector4(
      this.width,
      this.height,
      0,
      1,
    );

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
