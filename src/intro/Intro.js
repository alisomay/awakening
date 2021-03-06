import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: '#000',
  },
  headline: {
    color: '#E65E5E',
    fontFamily: 'GrandSlang-Roman',
    fontSize: 47,
    paddingTop: 90,
    paddingBottom: 0,
    marginLeft: 3,
  },
  line: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 1.3,
    marginTop: 24,
    color: '#A7A9AC',
  },
  annotate: {
    fontWeight: '400',
    color: '#C7C9CC',
    fontStyle: 'italic',
  },
  headphones: {
    marginTop: 50,
    width: 75,
    marginLeft: 10,

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  icon: {
    marginTop: 50,
    width: 40,
    marginLeft: 20,
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
    marginTop: 70,
    marginLeft: 15,
    width: 270,
    //
    paddingBottom: 60,

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  logo: {
    marginTop: 40,
    width: 270,

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
    'public/img/start-melon.png',
  );

  return (
    <div id="intro-container" className={classes.root}>
      <div className={classes.logo}>
        <img src="public/img/logo.png" alt="logo" />
      </div>
      <h1 className={classes.headline}>AWAKENING</h1>
      <p className={classes.line}>
        Explore an interactive visual and immersive binaural audio
        <br /> experience of Roz Yuen???s
        <span className={classes.annotate}> Three Stops</span> from
        her album
        <br /> <span className={classes.annotate}>Awakening. </span>
        Anti-Asian violence has surged around the world
        <br /> since the emergence of COVID-19. Her song is about her
        <br /> experience of navigating her identity as an
        Asian-Australian
        <br /> woman living in Berlin during the pandemic.
        <br /> #stopasianhate #Iamnotavirus
      </p>
      <div className={classes.headphones}>
        <img src="public/img/headphone.png" alt="logo" />
      </div>
      <p className={classes.line}>
        Wear Headphones for the best listening experience
      </p>
      <div className={classes.icon}>
        <img src="public/img/ok-png.png" alt="logo" />
      </div>
      <p className={classes.line}>
        Move your mouse cursor in different directions to interact
      </p>
      <div
        ref={ref}
        className={classes.start}
        onMouseEnter={() => {
          setStartImageSrc('public/img/start-gray.png');
        }}
        onMouseLeave={() => {
          setStartImageSrc('public/img/start-melon.png');
        }}
      >
        <img src={startImageSrc} alt="logo" />
      </div>
    </div>
  );
});
