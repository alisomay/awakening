import $ from 'jquery';
import React, { useEffect } from 'react';
import './reset.css';
import './App.css';
import { Experience } from './experience/Experience';

import { World } from './experience/World';
import { Intro } from './intro/Intro';
import { MobileBlock } from './mobile-block/MobileBlock';
import { BrowserBlock } from './browser-block/BrowserBlock';

import {
  BrowserView,
  MobileView,
  isChrome,
  isFirefox,
} from 'react-device-detect';
const isSafari =
  /constructor/i.test(window.HTMLElement) ||
  (function (p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(
    !window['safari'] ||
      (typeof safari !== 'undefined' && safari.pushNotification),
  );

// let lastCreditIndex = 0;
export const App = () => {
  if ((isChrome || isFirefox) && !isSafari) {
    const refToExperienceMain = React.createRef();
    const refToStartButton = React.createRef();
    const [init, setInit] = React.useState(false);

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
    useEffect(() => {
      console.log(
        '%cRoz Yuen - Awakening',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:4rem;font-weight:bold',
      );
      console.log(
        '%cPerformer/Composer/Producer',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cRoz Yuen',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cMix Engineer (Original Track):',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cAndrew Hockey',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cMix Engineer (Binaural Version):',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cRoz Yuen',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cMastering',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cPhilip Röder (Copilco Productions)',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cArt Direction',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cRoz Yuen and Başak Ünal',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cDigital Artist',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cBaşak Ünal',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cDeveloper/Creative Technologist',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cAli Somay',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cThis project was funded by',
        'color:#E65E5E;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
      console.log(
        '%cMusikfonds e.V.',
        'color:#fff;font-family:GrandSlang-Roman;font-size:1rem;font-weight:bold',
      );
    }, []);
  }
  if ((isChrome || isFirefox) && !isSafari) {
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
      </div>
    );
  } else {
    // Don't allow
    return (
      <div className="app">
        <BrowserView>
          <BrowserBlock></BrowserBlock>
        </BrowserView>
        <MobileView>
          <MobileBlock></MobileBlock>
        </MobileView>
      </div>
    );
  }
};
