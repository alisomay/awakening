import * as THREE from 'three';
import fragment from '../../public/shader/fragment.frag';
import vertex from '../../public/shader/vertex.vert';
import face from '../../public/img/face.jpg';
import tex1 from '../../public/img/NanoTextile.png';
import { RGBA_ASTC_10x5_Format } from 'three';

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
    console.log(this.width, this.height);
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

    this.camera.position.set(0, 0, 0.01);
    this.time = 0;
    this.isPlaying = true;
    this.loadTextures();

    this.player.attachLifeCycleListener('onBar', (levels) => {
      const [avg, peak] = levels;
      //this.material.uniforms.uDisplacement.value = peak;
    });
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
    // this.contentTexture.setPath('./img/face.jpg');

    //load the cubemap
    this.loader = new THREE.CubeTextureLoader();
    this.loader.setPath('img/');
    this.textureCube = this.loader.load([
      'back.jpg',
      'down.jpg',
      'front.jpg',
      'up.jpg',
      'left.jpg',
      'right.jpg',
    ]);
    // 'posx.jpg',
    // 'negx.jpg',
    // 'posy.jpg',
    // 'negy.jpg',
    // 'posz.jpg',
    // 'negz.jpg',
  }

  setupListeners() {
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener(
      'mousemove',
      this.mouseMove.bind(this),
      false,
    );
    window.addEventListener('click', this.click.bind(this), false);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  mouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log(this.mouse.x, this.mouse.y);
    this.material.uniforms.mouse.value = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
    //console.log((event.clientX / window.innerWidth) * 2 - 1);
  }

  click(click) {
    //
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
        uRotation: {
          type: 'v3',
          value: new THREE.Vector3(1.0, 1.0, 1.0),
        },
        uDisplacement: {
          type: 'f',
          value: 1.2,
        },
        uDistanceToOrigin: {
          type: 'f',
          value: 1,
        },
        uLightIntensity: {
          type: 'f',
          value: 1.5,
        },
        uRayMaxDistance: {
          type: 'f',
          value: 100.0,
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
        tex2: { value: new THREE.TextureLoader().load(face) },
        skybox: { value: this.textureCube },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.video.play();
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.001;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.resolution.value = new THREE.Vector4(
      this.width,
      this.height,
      0,
      1,
    );

    // if (this.lastPeak < this.currentPeak) {
    //   this.lastPeak += 0.1;
    //   this.material.uniforms.beat2.value = this.lastPeak;
    //   if (this.lastPeak > this.currentPeak) {
    //     this.lastPeak = this.currentPeak;
    //   }
    // }
    // if (this.lastPeak > this.currentPeak) {
    //   this.lastPeak -= 0.1;
    //   this.material.uniforms.beat2.value = this.lastPeak;
    //   if (this.lastPeak < this.currentPeak) {
    //     this.lastPeak = this.currentPeak;
    //   }
    // }
    // this.material.uniforms.beat2.value = THREE.MathUtils.lerp(
    //   this.material.uniforms.beat2.value,
    //   this.currentPeak,
    //   0.01,
    // );

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
