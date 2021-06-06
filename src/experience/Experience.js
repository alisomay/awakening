import React, { useEffect, useRef, useState } from 'react';
import './Experience.css';
import { Player } from './Player';
import { Controls } from '../controls/Controls';
import { Credits } from '../credits/Credits';
import { makeStyles } from '@material-ui/core/styles';
import $ from 'jquery';
import { isMobile } from 'react-device-detect';

var tl = gsap.timeline({ repeat: 90, yoyo: true, paused: true });
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
// console.log(!isMobile);
// Breaks rendering on IOS, this is why it is blocked.
if (!isMobile) {
  var player = new Player(`public/audio/three_stops.mp3`);
  player.init();

  var replayGlobal = false;
}

export const Experience = React.forwardRef(
  ({ initExperience, init }, ref) => {
    const threeRef = useRef(null);
    const videoRef = useRef(null);

    const videos = [`public/video/awakening.mp4`];
    const [videoIdx, setVideoIdx] = useState(0);
    const [replay, setReplay] = useState(false);
    const [bcVisibility, setBcVisibility] = useState(false);
    const [avgPeak, setAvgPeak] = useState('');
    const [showCredits, setShowCredits] = useState(false);
    const [creditIndex, setCreditIndex] = useState(0);

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

    player.attachLifeCycleListener('onCredits', () => {
      setShowCredits(true);
    });

    player.setCreditIndex = setCreditIndex.bind(this);

    const handleReplayButtonClick = () => {
      setReplay(false);
      setShowCredits(false);
      setCreditIndex(0);
      replayGlobal = false;
      player.play(true);
    };
    let spaceBarPressedBefore = false;
    const handleSpaceBar = () => {
      if (spaceBarPressedBefore) {
        if (player) {
          if (player.playing() && player.ready()) {
            // player.pause();
            spaceBarPressedBefore = false;
          }
        }
      } else {
        if (player) {
          if (!player.playing() && player.ready()) {
            // player.play();
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
        let tween = gsap.to('#loading', {
          duration: 0.7,
          scale: 0.1,
          ease: 'sine.inOut',
        });
        tl.add(tween);
        tl.play();
        (function () {
          setTimeout(() => {
            if (player.audioLoaded) {
              const world = initExperience.call(
                null,
                threeRef,
                videoRef,
                player,
              );
              $('#loading').fadeOut();
              tl.pause();
              player.worldRef = world;
              player.play();
              setTimeout(() => {
                gsap.to('canvas', {
                  duration: 2,
                  opacity: 1.0,
                  ease: 'power3.out',
                });
              }, 1000);
            } else {
              this();
            }
          }, 2000);
        })();
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
        // console.log('looped');
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
          <div ref={threeRef} className={classes.experience}>
            <div id="loading"></div>
            <Credits index={creditIndex} show={showCredits}></Credits>
          </div>
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
