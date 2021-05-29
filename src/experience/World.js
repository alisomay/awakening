import * as THREE from 'three';
import fragment from '../../public/shader/fragment.frag';
import vertex from '../../public/shader/vertex.vert';
import face from '../../public/img/face.jpg';
import tex1 from '../../public/img/NanoTextile.png';

export class World {
  constructor(options) {
    this.video = options.videoElement;
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

    this.player.attachLifeCycleListener('onBeat', (levels) => {
      const [avg, peak] = levels;
      // console.log(avg / 20, peak / 20);
      this.material.uniforms.mouse.value = new THREE.Vector2(
        avg / 20,
        avg / 20,
      );
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
      this.container.offsetWidth,
      this.container.offsetHeight,
      0,
      0,
    );
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  //   // Check intersection
  // rayCaster.setFromCamera(mouse, camera);
  // const intersection = rayCaster.intersectObject(cube);
  // if (intersection.length > 0) {
  // }
  // else {
  // }
}
