import React, { useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',
    transform: 'translateY(-110%) scale(4)',
  },
}));

export const ReplayButton = ({ handleClick }) => {
  useEffect(() => {}, []);

  const classes = useStyles();
  return (
    <IconButton
      onClick={() => {
        handleClick();
      }}
      className={classes.root}
      aria-label="replay"
    >
      <ReplayIcon />
    </IconButton>
  );
};
