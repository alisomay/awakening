import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ReplayButton } from '../replay-button/ReplayButton';
import { ProgressBar } from '../progress-bar/ProgressBar';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '100vw',
  },
}));

export const Controls = ({
  replay,
  player,
  handleReplayButtonClick,
}) => {
  useEffect(() => {}, []);

  const classes = useStyles();
  if (replay) {
    return <ReplayButton handleClick={handleReplayButtonClick} />;
  } else {
    return <ProgressBar player={player} />;
  }
};
