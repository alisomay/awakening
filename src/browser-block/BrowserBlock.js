import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: '#000',
    height: '100vh',
  },
  headline: {
    alignSelf: 'center',
    color: '#E65E5E',
    fontFamily: 'GrandSlang-Roman',
    fontSize: 47,
    paddingTop: 90,
    paddingBottom: 0,
    marginBottom: -30,
    marginLeft: 3,
  },

  annotate: {
    alignSelf: 'center',
    marginTop: 100,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 1.18,
    letterSpacing: 0.8,
    fontWeight: '400',
    color: '#C7C9CC',
  },
  back: {
    alignSelf: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    marginTop: 85,
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
    alignSelf: 'center',
    marginTop: 40,
    width: 270,

    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  link: {
    alignSelf: 'center',
    color: '#E65E5E',
    fontWeight: '300',
  },
}));

export const BrowserBlock = () => {
  const classes = useStyles();
  const [imgSrc, setImgSrc] = useState('public/img/back-melon.png');
  return (
    <div id="intro-container" className={classes.root}>
      <div className={classes.logo}>
        <img src="public/img/logo.png" alt="logo" />
      </div>
      <h1 className={classes.headline}>AWAKENING</h1>
      <p className={classes.annotate}>
        Sorry, please use{' '}
        <span className={classes.link}>
          <a href="https://www.google.com/chrome/">Google Chrome</a>
        </span>
        <br /> or{' '}
        <span className={classes.link}>
          <a href="https://www.mozilla.org/en-US/firefox/new/">
            Mozilla Firefox{' '}
          </a>
        </span>
        to view this experience.
      </p>
      <a
        href="https://rozyuen.com"
        onMouseEnter={() => {
          setImgSrc('public/img/back-grey.png');
        }}
        onMouseLeave={() => {
          setImgSrc('public/img/back-melon.png');
        }}
        className={classes.back}
      >
        <img src={imgSrc} alt="back_button" />
      </a>
    </div>
  );
};
