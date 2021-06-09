import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    height: '80vh',
  },
  headline: {
    marginTop: '20vh',
    color: '#E65E5E',
    fontFamily: 'GrandSlang-Roman',
    fontSize: 60,
  },
  lineFirst: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 1.9,
  },
  line: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 1.9,
    marginTop: 50,
  },
  creditContainer: {
    marginTop: '20vh',
  },

  role: {
    color: '#E65E5E',
  },
  name: {
    color: '#A7A9AC',
  },
  logo: {
    marginTop: '20vh',
    width: 270,
    alignSelf: 'center',
    '& img': {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
  },
}));

export const Credits = ({ index, show }) => {
  const classes = useStyles();

  if (!show) {
    return <div style={{ display: 'none' }}></div>;
  } else {
    switch (index) {
      case 3:
        return (
          <div className={classes.root}>
            <div className={classes.logo}>
              <img src="public/img/logo.png" alt="logo" />
            </div>
          </div>
        );
      case 0:
        return (
          <div className={classes.root}>
            <h1 className={classes.headline}>AWAKENING</h1>
          </div>
        );
      case 1:
        return (
          <div className={classes.root}>
            <div className={classes.creditContainer}>
              <p className={classes.lineFirst}>
                <span className={classes.role}>
                  {'Performer/Composer/Producer'}
                </span>
                <br />
                <span className={classes.name}>
                  {`Roz Yuen`.toUpperCase()}
                </span>
              </p>
              <p className={classes.line}>
                <span className={classes.role}>
                  {'Mix Engineer (Original Track):'}
                </span>
                <br />
                <span className={classes.name}>
                  {`Andrew Hockey`.toUpperCase()}
                </span>
              </p>
              <p className={classes.line}>
                <span className={classes.role}>
                  {'Mix Engineer (Binaural Version):'}
                </span>
                <br />
                <span className={classes.name}>
                  {`Roz Yuen`.toUpperCase()}
                </span>
              </p>
              <p className={classes.line}>
                <span className={classes.role}>Mastering</span>
                <br />
                <span className={classes.name}>
                  {`Philip Röder (Copilco Productions)`.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={classes.root}>
            <div className={classes.creditContainer}>
              <p className={classes.lineFirst}>
                <span className={classes.role}>Art Direction</span>
                <br />
                <span className={classes.name}>
                  {`Roz Yuen and Başak Ünal`.toUpperCase()}
                </span>
              </p>
              <p className={classes.line}>
                <span className={classes.role}>Digital Artist</span>
                <br />
                <span className={classes.name}>
                  {`Başak Ünal`.toUpperCase()}
                </span>
              </p>
              <p className={classes.line}>
                <span className={classes.role}>
                  {'Developer/Creative Technologist'}
                </span>
                <br />
                <span className={classes.name}>
                  {`Ali Somay`.toUpperCase()}
                </span>
              </p>
              <p className={classes.line}>
                <span className={classes.role}>
                  This project was supported by
                </span>
                <br />
                <span className={classes.name}>
                  {`Musikfonds e.V.`.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        );
    }
  }
};
