import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
  imageIcon: {
    height: '100%',
    verticalAlign: 'baseline',
    transform: 'scale(0.8)',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  iconRoot: {
    zIndex: 9999999,
    width: '80%',
    textAlign: 'center',
    transform: 'scale(4) translateY(-10px)',
  },
}));

export const ReplayButton = ({ handleClick }) => {
  useEffect(() => {}, []);

  const classes = useStyles();
  return (
    <Icon
      classes={{ root: classes.iconRoot }}
      onClick={() => {
        handleClick();
      }}
      aria-label="replay"
    >
      <img
        id="replay-svg"
        onMouseEnter={() => {
          gsap.to('#replay-svg', {
            duration: 0.5,
            scale: 0.7,
            ease: 'power2.out',
          });
        }}
        onMouseLeave={() => {
          gsap.to('#replay-svg', {
            duration: 0.5,
            scale: 0.8,
            ease: 'power2.out',
          });
        }}
        className={classes.imageIcon}
        src="public/img/repeat.svg"
      />
    </Icon>
  );
};
