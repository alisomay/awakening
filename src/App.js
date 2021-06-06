import $ from 'jquery';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './reset.css';
import './App.css';
import { Experience } from './experience/Experience';
import { Credits } from './credits/Credits';
import { World } from './experience/World';
import { Intro } from './intro/Intro';
import { MobileBlock } from './mobile-block/MobileBlock';
import { Controls } from './controls/Controls';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect';

// let lastCreditIndex = 0;
export const App = () => {
  // return <div className="mob">RENDERS</div>;
  const refToExperienceMain = React.createRef();
  const refToStartButton = React.createRef();
  const [init, setInit] = React.useState(false);
  const [creditIndex, setCreditIndex] = React.useState(0);

  const initExperience = (threeRef, videoRef, player) => {
    const world = new World({
      domElement: threeRef.current,
      videoElement: videoRef.current,
      player,
    });
    world.addObjects();
    world.resize();
    world.render();
    world.setupListeners();
    return world;
  };

  // useEffect(() => {
  //   setInterval(() => {
  //     lastCreditIndex = (lastCreditIndex + 1) % 4;
  //     setCreditIndex(lastCreditIndex);
  //   }, 1720);
  // }, []);

  useEffect(() => {
    const startButton = refToStartButton.current;
    const page2 = refToExperienceMain.current;
    $(document).ready(() => {
      $('#experience-container').css('display', 'none');
    });

    $(startButton).on('click', () => {
      $('#experience-container').css('display', 'flex');
      $('html, body').animate(
        {
          scrollTop: $(page2).offset().top,
        },
        1600,
        () => {
          setInit(true);
          $('html, body')
            .css('overflow-x', 'hidden')
            .css('overflow-y', 'hidden');

          $('#loading').fadeIn();
          // Scroll Complete
          // Start exp
          // If we want to change url it is here
        },
      );
    });

    return () => {};
  }, []);

  return (
    <div className="app">
      <BrowserView>
        <Intro ref={refToStartButton}></Intro>
        <Experience
          ref={refToExperienceMain}
          initExperience={initExperience}
          init={init}
        ></Experience>
      </BrowserView>
      <MobileView>
        <MobileBlock></MobileBlock>
      </MobileView>
      {/* <Controls replay={true}></Controls> */}
    </div>
  );

  // return <Experience></Experience>;
  // return <Credits index={creditIndex}></Credits>;
};
