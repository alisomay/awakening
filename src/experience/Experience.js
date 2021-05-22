import { hot } from 'react-hot-loader/root';
import React, { useEffect, useRef, useState } from 'react';
import './Experience.css';
import { World } from './World';
import { Player } from './Player';
import { Controls } from '../controls/Controls';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    width: '100%',
    height: '100%',
  },
  experience: {
    minWidth: '100%',
    height: '100%',
  },
}));

let player = new Player(`audio/k.wav`);
player.init();

let replayGlobal = false;

export const Experience = hot(() => {
  const threeRef = useRef(null);
  const videoRef = useRef(null);

  const videos = [
    `video/Roz_01.webm`,
    `video/Roz_02.webm`,
    `video/Roz_03.webm`,
    `video/Roz_04.webm`,
    `video/Roz_05.webm`,
    `video/Roz_06.webm`,
    `video/Roz_07.webm`,
    `video/Roz_08.webm`,
    `video/Roz_09.webm`,
    `video/Roz_10.webm`,
    `video/Roz_11.webm`,
    `video/Roz_12.webm`,
    `video/Train_01.webm`,
    `video/Train_02.webm`,
    `video/Train_03.webm`,
    `video/Train_04.webm`,
  ];
  const [videoIdx, setVideoIdx] = useState(0);
  const [replay, setReplay] = useState(false);

  player.attachLifeCycleListener('onEnded', (paused) => {
    if (!paused) setReplay(true);
    replayGlobal = true;
    videoRef.current.pause();
  });
  player.attachLifeCycleListener('onStart', () => {
    setReplay(false);
    replayGlobal = false;
    videoRef.current.play();
  });

  const handleReplayButtonClick = () => {
    setReplay(false);
    replayGlobal = false;
    player.play();
  };
  let spaceBarPressedBefore = false;
  const handleSpaceBar = () => {
    if (spaceBarPressedBefore) {
      console.log('');
      if (player) {
        if (player.playing() && player.ready()) {
          player.pause();
          spaceBarPressedBefore = false;
        }
      }
    } else {
      if (player) {
        if (!player.playing() && player.ready()) {
          player.play();
          spaceBarPressedBefore = true;
        }
      }
    }
  };
  const handleUserTriggeredReplay = () => {
    if (replayGlobal) {
      handleReplayButtonClick();
    }
  };

  useEffect(() => {
    const world = new World({
      domElement: threeRef.current,
      videoElement: videoRef.current,
    });
    world.addObjects();
    world.resize();
    world.render();
    world.setupListeners();

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        handleSpaceBar();
      }
      if (event.code === 'KeyR' || event.code === 'Enter') {
        handleUserTriggeredReplay();
      }
    });

    videoRef.current.addEventListener('ended', () => {
      // Catch ending loop vid
      console.log('looped');
      videoRef.current.play();
    });
    world.play();
    return () => {};
  }, []);
  const classes = useStyles();

  return (
    <div
      className="main-container"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
      }}
    >
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        alignContent="center"
        className={classes.root}
        spacing={0}
      >
        <Grid
          item
          xs={11}
          ref={threeRef}
          className={classes.experience}
          onClick={() => {
            setVideoIdx((videoIdx + 1) % videos.length);
            videoRef.current.load();
          }}
        ></Grid>
        <div
          style={{
            backgroundColor: 'green',
            height: '50px',
            width: '10%',
            position: 'absolute',
            transform: 'translateY(100px)',
            zIndex: '999',
          }}
          onClick={() => {
            console.log(player);
            if (player) {
              if (!player.playing() && player.ready()) {
                player.play();
              }
            }
          }}
        ></div>
        <div
          style={{
            backgroundColor: 'yellow',
            height: '50px',
            width: '10%',
            position: 'absolute',
            transform: 'translateY(150px)',
            zIndex: '999',
          }}
          onClick={() => {
            if (player) {
              if (player.playing() && player.ready()) {
                player.pause();
              }
            }
          }}
        ></div>
        <div
          style={{
            backgroundColor: 'red',
            height: '50px',
            width: '10%',
            position: 'absolute',
            transform: 'translateY(200px)',
            zIndex: '999',
          }}
          onClick={() => {
            if (player) {
              if (player.playing() && player.ready()) {
                //player.stop();
              }
            }
          }}
        ></div>
        <Controls
          replay={replay}
          player={player}
          handleReplayButtonClick={handleReplayButtonClick}
        ></Controls>
      </Grid>
      <video
        ref={videoRef}
        muted
        className="filtered-video transformed-video"
        style={{
          visibility: 'hidden',
          width: '320px',
          height: '240px',

          minWidth: '100%',
          objectFit: 'cover',
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
        }}
      >
        <source src={videos[videoIdx]} type="video/webm" />
      </video>
    </div>
  );
});
