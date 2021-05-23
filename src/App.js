import { hot } from 'react-hot-loader/root';
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

// Ensure that page always starts from top.
$(window).on('beforeunload', function () {
  $(window).scrollTop(0);
});

export const App = hot(() => {
  const refToExperienceMain = React.createRef();
  const refToStartButton = React.createRef();
  const [init, setInit] = React.useState(false);
  const initExperience = (threeRef, videoRef) => {
    const world = new World({
      domElement: threeRef.current,
      videoElement: videoRef.current,
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
    $(startButton).on('click', () => {
      $('html, body').animate(
        {
          scrollTop: $(page2).offset().top,
        },
        1600,
        () => {
          setInit(true);
          // Scroll complete
          // If we want to change url it is here
        },
      );
    });

    return () => {};
  }, []);
  return (
    <div className="app">
      <Intro ref={refToStartButton}></Intro>
      <Experience
        ref={refToExperienceMain}
        initExperience={initExperience}
        init={init}
      ></Experience>
    </div>
  );
  // return <Experience></Experience>;
  // return <Credits></Credits>;
});
