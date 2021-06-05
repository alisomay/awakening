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
    margin: 'auto',
    backgroundColor: '#000',
  },
  headline: {
    color: '#E65E5E',
    fontFamily: 'GrandSlang-Roman',
    fontSize: '6em',
    paddingTop: 165,
    paddingBottom: 0,
    marginLeft: 3,
  },

  annotate: {
    marginTop: 140,
    fontSize: '3em',
    textAlign: 'center',
    lineHeight: 1.18,
    letterSpacing: 0.8,
    fontWeight: '400',
    color: '#C7C9CC',
  },
  back: {
    '&:hover': {
      cursor: 'pointer',
    },
    marginTop: 260,
    marginLeft: 15,
    width: '50%',
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
    marginTop: 100,
    width: '46%',

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
}));

export const MobileBlock = () => {
  const classes = useStyles();
  const [imgSrc, setImgSrc] = useState('public/img/back-melon.png');
  return (
    <div id="intro-container" className={classes.root}>
      <div className={classes.logo}>
        <img src="public/img/logo.png" alt="logo" />
      </div>
      <h1 className={classes.headline}>AWAKENING</h1>
      <p className={classes.annotate}>
        Sorry, this experience
        <br /> only runs on
        <br /> desktop devices.
      </p>
      <a
        href="https://rozyuen.com"
        onClick={() => {
          setImgSrc('public/img/back-grey.png');
        }}
        className={classes.back}
      >
        <img src={imgSrc} alt="back_button" />
      </a>
    </div>
  );
};
