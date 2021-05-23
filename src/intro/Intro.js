import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
  },
  headline: {
    color: '#E65E5E',
    fontFamily: 'GrandSlang-Roman',
    fontSize: 40,
    paddingTop: 90,
    paddingBottom: 20,
  },
  line: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: '1.4rem',
    marginTop: 24,
    color: '#A7A9AC',
  },
  annotate: {
    fontWeight: '400',
    color: '#C7C9CC',
    fontStyle: 'italic',
  },
  icon: {
    marginTop: 20,
    width: '5%',

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  start: {
    '&:hover': {
      cursor: 'pointer',
    },
    marginTop: 20,
    width: '20%',

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  logo: {
    marginTop: 40,
    width: '20%',

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
}));

export const Intro = React.forwardRef((_, ref) => {
  const classes = useStyles();
  const [startImageSrc, setStartImageSrc] = useState(
    'img/start-melon.png',
  );

  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <img src="img/logo.png" alt="logo" />
      </div>
      <h1 className={classes.headline}>AWAKENING</h1>
      <p className={classes.line}>
        Explore an interactive visual and immersive binaural audio
        <br /> experience of Roz Yuen’s
        <span className={classes.annotate}> Three Stops</span> from
        her album
        <br /> <span className={classes.annotate}>Awakening. </span>
        Anti-Asian violence has surged around the world
        <br /> since the emergence of COVID-19. Her song is about her
        <br /> experience of navigating her identity as an
        Asian-Australian
        <br /> woman living in Berlin during the pandemic.
        #stopasianhate
        <br /> #Iamnotavirus
      </p>
      <div className={classes.icon}>
        <img src="img/headphone.png" alt="logo" />
      </div>
      <p className={classes.line}>
        Wear Headphones for the best listening experience
      </p>
      <div className={classes.icon}>
        <img src="img/ok-png.png" alt="logo" />
      </div>
      <p className={classes.line}>
        Drag your mouse cursor in different directions and click to
        alter the visual experience
      </p>
      <div
        ref={ref}
        className={classes.start}
        onMouseEnter={() => {
          setStartImageSrc('img/start-gray.png');
        }}
        onMouseLeave={() => {
          setStartImageSrc('img/start-melon.png');
        }}
      >
        <img src={startImageSrc} alt="logo" />
      </div>
    </div>
  );
});