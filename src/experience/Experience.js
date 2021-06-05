import { hot } from 'react-hot-loader/root';
import React, { useEffect, useRef, useState } from 'react';
import './Experience.css';
import { World } from './World';
import { Player } from './Player';
import { Controls } from '../controls/Controls';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: 'auto',
    backgroundColor: '#000',
    position: 'relative',
  },
  experience: {
    minWidth: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
    height: '100vh',
    // height: '80vh',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
    height: 120,
    '& > *': {
      alignSelf: 'center',
    },
  },
}));

// Breaks rendering on IOS, this is why it is blocked.
if (!isMobile) {
  // let player = new Player(`audio/k.wav`);
  let player = new Player(`public/audio/three_stops.mp3`);
  player.init();

  let replayGlobal = false;
}

export const Experience = React.forwardRef(
  ({ initExperience, init }, ref) => {
    const threeRef = useRef(null);
    const videoRef = useRef(null);

    const videos = [
      `public/video/mix-video.mp4`,
      // `video/basak_test_1.mp4`,
      // `video/basak_test_2.mp4`,
      // `video/Roz_01.webm`,
      // `video/Roz_02.webm`,
      // `video/Roz_03.webm`,
      // `video/Roz_04.webm`,
      // `video/Roz_05.webm`,
      // `video/Roz_06.webm`,
      // `video/Roz_07.webm`,
      // `video/Roz_08.webm`,
      // `video/Roz_09.webm`,
      // `video/Roz_10.webm`,
      // `video/Roz_11.webm`,
      // `video/Roz_12.webm`,
      // `video/Train_01.webm`,
      // `video/Train_02.webm`,
      // `video/Train_03.webm`,
      // `video/Train_04.webm`,
    ];
    const [videoIdx, setVideoIdx] = useState(0);
    const [replay, setReplay] = useState(false);
    const [bcVisibility, setBcVisibility] = useState(false);
    const [avgPeak, setAvgPeak] = useState('');

    player.attachLifeCycleListener('onEnded', (paused) => {
      if (!paused) {
        setReplay(true);
        replayGlobal = true;
      }
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
      player.socket.emit('space');
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
      if (init) {
        const world = initExperience.call(
          null,
          threeRef,
          videoRef,
          player,
        );
        world.play();
      }
    }, [init]);

    useEffect(() => {
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
      videoRef.current.addEventListener(
        'loadeddata',
        () => {
          if (player.playing()) {
            videoRef.current.play();
            // Video is loaded and can be played
          }
        },
        false,
      );

      player.attachLifeCycleListener('onBeat', (avgPeak) => {
        // setBcVisibility(
        //   `rgb(${Math.random() * 255},${Math.random() * 255},${
        //     Math.random() * 255
        //   })`,
        // );
        // const [avg, peak] = avgPeak;
        // setAvgPeak(`AVG : ${avg} PEAK : ${peak}`);
      });
      return () => {
        // Maybe removal of listeners might be needed
      };
    }, []);
    const classes = useStyles();

    return (
      <React.Fragment>
        <div
          className={classes.root}
          id="experience-container"
          ref={ref}
        >
          <div
            ref={threeRef}
            className={classes.experience}
            onClick={() => {
              if (player.playing()) {
                // console.log(
                //   'VIDEO CHANGE',
                //   (videoIdx + 1) % videos.length,
                // );
                // setVideoIdx((videoIdx + 1) % videos.length);
                // videoRef.current.load();
              }
            }}
          ></div>
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: bcVisibility,
              position: 'absolute',
              color: 'white',
              top: 0,
              left: 0,
            }}
          >
            {avgPeak}
          </div>
          <div className={classes.controls} id="controls-container">
            <Controls
              replay={replay}
              player={player}
              handleReplayButtonClick={handleReplayButtonClick}
            ></Controls>
          </div>
        </div>
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
          <source src={videos[videoIdx]} type="video/mp4" />
        </video>
      </React.Fragment>
    );
  },
);
