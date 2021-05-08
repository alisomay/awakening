import { hot } from 'react-hot-loader/root';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './reset.css';
import './App.css';
import { World } from './World';
import { Player } from './Player';
import { NoToneMapping } from 'three';

// Three JS

export const App = hot(() => {
  const threeRef = useRef(null);
  const videoRef = useRef(null);
  const playButtonRef = useRef(null);

  let player;

  useEffect(() => {
    const world = new World({ domElement: threeRef.current });
    world.addObjects(videoRef.current);
    world.resize();
    world.render();
    world.setupListeners();

    player = new Player(`audio/sugarmoon.mp3`, playButtonRef.current);

    videoRef.current.addEventListener('ended', () => {
      // Catch ending loop vid
      console.log('looped');
      videoRef.current.play();
    });

    return () => {};
  }, []);

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
        playsInline
        webkit-playsinline="true"
        autoPlay
        muted
        className="filtered-video transformed-video"
        style={{
          visibility: 'hidden',
          width: '320px',
          height: '240px',
          minHeight: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
        }}
      >
        <source src="video/snow.mp4" type="video/mp4" />
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
          <div
            ref={playButtonRef}
            style={{ marginTop: 100 }}
            onClick={() => {
              player.play();
            }}
          >
            PLAY
          </div>
        </div>
      </div>
    </div>
  );
});
