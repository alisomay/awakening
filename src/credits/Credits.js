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
    width: '100%',
    height: ' auto',
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
  },
  role: {
    color: '#E65E5E',
  },
  name: {
    color: '#A7A9AC',
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

export const Credits = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <img src="img/logo.png" alt="logo" />
      </div>
      <h1 className={classes.headline}>AWAKENING</h1>
      <p className={classes.line}>
        <span className={classes.role}>
          Performer/Composer/Co-Producer/Co-Mix Engineer
        </span>
        <br />
        <span className={classes.name}>Roz Yuen</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>
          Co-Mix Engineer/Co-Producer:
        </span>
        <br />
        <span className={classes.name}>Andrew Hockey</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>Mastering</span>
        <br />
        <span className={classes.name}>
          Philip Röder (Copilco Productions)
        </span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>
          Art Direction and Video Content Creator
        </span>
        <br />
        <span className={classes.name}>Roz Yuen</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>Visual Designer</span>
        <br />
        <span className={classes.name}>Başak Ünal</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>
          Audiovisual Artist/Creative Technologist (TBC)
        </span>
        <br />
        <span className={classes.name}>Lars Ullrich</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>TBC</span>
        <br />
        <span className={classes.name}>Ali Somay</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>Project Consultant</span>
        <br />
        <span className={classes.name}>Suzanne D’Bel</span>
      </p>
      <p className={classes.line}>
        <span className={classes.role}>
          This project was funded by Musikfonds e.V.
        </span>
      </p>
    </div>
  );
};
