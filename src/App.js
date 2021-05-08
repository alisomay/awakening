import { hot } from 'react-hot-loader/root';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './reset.css';
import './App.css';

const getRandomNumsArr = (count, scale = 1) => {
  let arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(Math.random() * scale);
  }
  return arr;
};

const decreaseBiquadFreq = (audioCtx, biquadFilter, step, limit) => {
  let newFilterFreq =
    biquadFilter.frequency.value - step >= limit
      ? biquadFilter.frequency.value - step
      : limit;
  biquadFilter.frequency.setValueAtTime(
    newFilterFreq,
    audioCtx.currentTime,
  );
};
const increaseBiquadFreq = (audioCtx, biquadFilter, step, limit) => {
  let newFilterFreq =
    biquadFilter.frequency.value + step <= limit
      ? biquadFilter.frequency.value + step
      : limit;
  biquadFilter.frequency.setValueAtTime(
    newFilterFreq,
    audioCtx.currentTime,
  );
};

// Global state
let playing = false;

export const App = hot(() => {
  // Web Audio
  const playButtonRef = useRef(null);
  let biquadFilter;
  let delay;
  let feedbackNode;
  let audioCtx;

  useEffect(() => {
    const URL = 'sugarmoon.mp3';
    audioCtx = new AudioContext();
    let buf;

    window
      .fetch(URL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        playButtonRef.current.disabled = false;
        buf = audioBuffer;
      });

    playButtonRef.current.onclick = () => play(buf);

    function play(audioBuffer) {
      console.log('Play');
      playing = true;

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      delay = audioCtx.createDelay(5);

      feedbackNode = audioCtx.createGain();
      feedbackNode.gain.value = 0.3;

      biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.setValueAtTime(
        16000,
        audioCtx.currentTime,
      );
      biquadFilter.Q.setValueAtTime(11, audioCtx.currentTime);

      // Patching
      source.connect(biquadFilter);
      biquadFilter.connect(delay);
      delay.connect(feedbackNode);
      feedbackNode.connect(delay);
      delay.connect(audioCtx.destination);

      source.start();
    }

    return () => {};
  }, []);

  // Three JS
  const threeRef = useRef(null);
  const videoRef = useRef(null);
  const instances = 2500;
  let lastTime = 0;
  let rConst = 100;
  const pointLightInitialPos = [-60, 2, -74];
  const pointLightInitialIntensity = 10;
  const sandColorLight = 0xedc855;
  const sandColor = 0xc2b280;
  const hitTestColor = new THREE.Color();
  let lastIntersectedInstanceId = 0;
  const cubeSteadyYPosition = -2.1;
  let camForward = true;

  useEffect(() => {
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const onMouseMove = (event) => {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize);
    threeRef.current.appendChild(renderer.domElement);

    const sandDiffuse = new THREE.TextureLoader().load('sand.jpg');
    sandDiffuse.wrapS = THREE.RepeatWrapping;
    sandDiffuse.wrapT = THREE.RepeatWrapping;
    sandDiffuse.repeat.set(4, 4);
    const sandNormal = new THREE.TextureLoader().load(
      'sandm_NRM.png',
    );
    sandNormal.wrapS = THREE.RepeatWrapping;
    sandNormal.wrapT = THREE.RepeatWrapping;
    sandNormal.repeat.set(4, 4);

    const cubeGeometry = new THREE.BoxBufferGeometry(0.7, 0.5, 0.5);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: sandColor,
      wireframe: false,
      map: sandDiffuse,
      // normalMap: sandNormal,
      // displacementMap: sandDisplacement,
      // displacementScale: 1,
      // specularMap: sandSpec,
      // specular: 0xfff4c3,
    });
    const cube = new THREE.InstancedMesh(
      cubeGeometry,
      cubeMaterial,
      instances,
    );
    cube.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const planeGeometry = new THREE.PlaneGeometry(40, 10, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: sandColor,
      side: THREE.DoubleSide,
      map: sandDiffuse,
      normalMap: sandNormal,
      // displacementMap: sandDisplacement,
      // displacementScale: 50,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    const ambientLight = new THREE.AmbientLight(0xfffede, 0.5);
    const directionalLight = new THREE.DirectionalLight(
      0xfffede,
      0.9,
    );
    const pointLight = new THREE.PointLight(
      0xfff4c3,
      pointLightInitialIntensity,
      106,
      1,
    );

    // Attach point light to sun in the video.
    videoRef.current.addEventListener('ended', () => {
      videoRef.current.play();
      20;
      let i = 0;
      let int = setInterval(() => {
        pointLight.intensity += 0.1;
        pointLight.position.x -= 0.1;
        pointLight.position.y += 0.1;
        i++;
        if (i > 100) {
          pointLight.intensity = pointLightInitialIntensity;
          pointLight.position.set(...pointLightInitialPos);
          clearInterval(int);
          i = 0;
        }
      }, 1);
    });

    // Helpers
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      10,
      0x0000ff,
    );
    const sphereSize = 2;
    const pointLightHelper = new THREE.PointLightHelper(
      pointLight,
      sphereSize,
      0xff0000,
    );

    camera.position.z = 5;

    plane.position.x = 0;
    plane.position.y = -4.5;
    plane.position.z = -8;

    plane.rotation.x = -45;
    plane.rotation.y = 0;
    plane.rotation.z = 0;

    directionalLight.position.x = -20;
    directionalLight.position.y = 20;
    directionalLight.position.z = 60;

    // directionalLight.rotation.x = 1;
    // directionalLight.rotation.y = 4;
    // directionalLight.rotation.z = 0;

    pointLight.position.set(...pointLightInitialPos);

    scene.add(cube);
    scene.add(plane);
    // scene.add(ambientLight);
    scene.add(directionalLight);
    // scene.add(directionalLightHelper);
    scene.add(pointLight);
    // scene.add(pointLightHelper);

    // Create Instances

    const pinkInstanceIds = [];
    const pinkInstanceIdsGroup1 = [];
    const pinkInstanceIdsGroup2 = [];
    const moveQ = new THREE.Quaternion(
      0.5,
      0.5,
      0.5,
      0.0,
    ).normalize();
    const tmpQ = new THREE.Quaternion();

    for (let i = 0; i < instances; i++) {
      if (!(i % 30)) {
        pinkInstanceIds.push(i);
        //console.log(i);
        i % 60
          ? pinkInstanceIdsGroup1.push(i)
          : pinkInstanceIdsGroup2.push(i);
        cube.setColorAt(i, new THREE.Color(0xff00ff));
      } else {
        cube.setColorAt(
          i,
          new THREE.Color(
            sandColor + (-1000 + Math.random() * rConst),
          ),
        );
      }

      tmpQ
        .set(
          moveQ.x * Math.random() * 20,
          moveQ.y * Math.random() * 0.00001,
          moveQ.z * Math.random() * 0.00001,
          1,
        )
        .normalize();
      const translation = new THREE.Matrix4().makeTranslation(
        -20 + Math.random() * 40,
        cubeSteadyYPosition,
        -20 + Math.random() * 60,
      );
      const rotation = new THREE.Matrix4().makeRotationFromQuaternion(
        tmpQ,
      );
      const scale = new THREE.Matrix4().makeScale(
        Math.random() + 2,
        Math.random() * 3 + 1,
        Math.random() * 4,
      );
      const transform = translation.multiply(
        scale.multiply(rotation),
      );
      cube.setMatrixAt(i, transform);
    }
    // console.log(
    //   'hey',
    //   pinkInstanceIdsGroup1,
    //   pinkInstanceIdsGroup2,
    //   pinkInstanceIds,
    // );
    cube.instanceMatrix.needsUpdate = true;

    // Roaming direction for camera.
    const camDirectionDice = () => {
      setTimeout(
        () => {
          camForward = Math.random() > 0.5;
          console.log('CamForward', camForward);
          camDirectionDice();
        },
        camForward ? Math.random() * 100000 : Math.random() * 5000,
      );
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const time = performance.now();
      const delta = (time - lastTime) / 100000;
      const deltaY = (time - lastTime) / 50000;
      const deltaTri = (time - lastTime) / 1000;

      // Slowly rotate instances.
      for (let i = 0; i < instances; i++) {
        tmpQ
          .set(moveQ.x * delta, moveQ.y * deltaY, moveQ.z * delta, 1)
          .normalize();
        const rotation = new THREE.Matrix4().makeRotationFromQuaternion(
          tmpQ,
        );
        const currentTransformation = new THREE.Matrix4();

        cube.getMatrixAt(i, currentTransformation);
        currentTransformation.multiply(rotation);
        cube.setMatrixAt(i, currentTransformation);
      }

      // Attach light to the sun.
      pointLight.position.x += 0.02;
      pointLight.position.y -= 0.02;
      pointLight.intensity -= 0.03;

      // Move camera slowly
      camForward
        ? (camera.position.z -= 0.005)
        : (camera.position.z += 0.005);

      // Check intersection
      rayCaster.setFromCamera(mouse, camera);
      const intersection = rayCaster.intersectObject(cube);
      let instanceId = 0;

      if (intersection.length > 0) {
        instanceId = intersection[0].instanceId;

        const currentTransformation = new THREE.Matrix4();
        cube.getMatrixAt(instanceId, currentTransformation);

        const pos = new THREE.Vector3().setFromMatrixPosition(
          currentTransformation,
        );

        let yPos = pos.y;
        yPos > cubeSteadyYPosition + 0.6
          ? (yPos = pos.y)
          : (yPos = pos.y + 0.012);
        currentTransformation.setPosition(pos.x, yPos, pos.z);
        cube.setMatrixAt(instanceId, currentTransformation);

        cube.instanceMatrix.needsUpdate = true;
        lastIntersectedInstanceId = instanceId;

        // Group 1
        if (playing && pinkInstanceIdsGroup1.includes(instanceId)) {
          decreaseBiquadFreq(audioCtx, biquadFilter, 150, 180);
        }
        // Not in Group 1
        if (playing && !pinkInstanceIdsGroup1.includes(instanceId)) {
          increaseBiquadFreq(audioCtx, biquadFilter, 4, 16000);
        }
        // Group 2
        if (playing && pinkInstanceIdsGroup2.includes(instanceId)) {
        }
        // Not in Group 2
        if (playing && !pinkInstanceIdsGroup2.includes(instanceId)) {
        }
        // Not in any group
        if (playing && !pinkInstanceIds.includes(instanceId)) {
        }
      }
      // No intersection
      else {
        if (playing) {
          increaseBiquadFreq(audioCtx, biquadFilter, 4, 16000);
        }
      }

      // All instances pull down. @todo This loop could be merged.
      for (let i = 0; i < instances; i++) {
        if (i !== instanceId) {
          const currentTransformation = new THREE.Matrix4();
          cube.getMatrixAt(i, currentTransformation);
          const pos = new THREE.Vector3().setFromMatrixPosition(
            currentTransformation,
          );
          let yPos = 0;
          pos.y > cubeSteadyYPosition
            ? (yPos = pos.y - 0.003)
            : (yPos = cubeSteadyYPosition);
          currentTransformation.setPosition(pos.x, yPos, pos.z);
          cube.setMatrixAt(i, currentTransformation);
        }
      }

      lastTime = time;
      // cube.instanceColor.needsUpdate = true;
      cube.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    camDirectionDice();
    animate();
    return () => {};
  }, [instances, lastTime]);

  return (
    <div
      ref={threeRef}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        className="filtered-video transformed-video"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
        }}
      >
        <source src="modaskycolor.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          minWidth: '100%',
          position: 'absolute',
          zIndex: 1,
          top: 0,
          left: 0,
          border: 'solid black 1px',
          display: `flex`,
          justifyContent: `center`,
          alignContent: `center`,
          alignItems: `center`,
        }}
      >
        <div
          style={{
            zIndex: 1,
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `flex-start`,
            alignContent: `center`,
            alignItems: `center`,
            transform: 'translateY(-270px)',
          }}
        >
          <div ref={playButtonRef} style={{ marginTop: 100 }}>
            PLAY
          </div>
        </div>
      </div>
    </div>
  );
});

//   <img
//     style={{
//       filter:
//         'grayscale(100%) invert(100%) opacity(45%) sepia(100%)',
//       width: '70%',
//     }}
//     className="animating"
//     src="pngegg.png"
//     alt=""
//   />
//   <p
//     style={{
//       alignSelf: `center`,
//       fontSize: 72,
//       textAlign: `center`,
//       fontWeight: `bold`,
//       fontFamily: `Times New Roman`,
//       opacity: 0.8,
//     }}
//   ></p>

// const sandDisplacement = new THREE.TextureLoader().load(
//   'sandm_DISP.png',
// );
// sandDisplacement.wrapS = THREE.RepeatWrapping;
// sandDisplacement.wrapT = THREE.RepeatWrapping;
// sandDisplacement.repeat.set(4, 4);
// const sandSpec = new THREE.TextureLoader().load('sandm_SPEC.png');
// sandSpec.wrapS = THREE.RepeatWrapping;
// sandSpec.wrapT = THREE.RepeatWrapping;
// sandSpec.repeat.set(4, 4);

// let newDelayTime;
// newDelayTime =
//   delay.delayTime.value + 0.3 <= 5 ? delay.delayTime.value + 0.3 : 5;
// delay.delayTime.setValueAtTime(newDelayTime, audioCtx.currentTime);

// let newFeedBackGain;
// newFeedBackGain =
//   feedbackNode.gain.value + 0.05 <= 0.8
//     ? feedbackNode.gain.value + 0.05
//     : 0.8;

// feedbackNode.gain.setValueAtTime(
//   newFeedBackGain,
//   audioCtx.currentTime,
// );

// let newDelayTime;
// newDelayTime =
//   delay.delayTime.value - 0.3 >= 0 ? delay.delayTime.value - 0.3 : 0;
// delay.delayTime.setValueAtTime(newDelayTime, audioCtx.currentTime);

// let newFeedBackGain;
// newFeedBackGain =
//   feedbackNode.gain.value - 0.05 >= 0.5
//     ? feedbackNode.gain.value - 0.05
//     : 0.5;

// feedbackNode.gain.setValueAtTime(
//   newFeedBackGain,
//   audioCtx.currentTime,
// );
