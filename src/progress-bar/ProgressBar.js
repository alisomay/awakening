import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  slider: {
    width: '75%',
  },
}));

export const ProgressBar = ({ player }) => {
  const [progressBarValue, setProgressBarValue] = useState(0);

  const setProgressBarValueWithElapsedTime = (
    totalLength,
    currentOffset,
  ) => {
    const percentage = (currentOffset / totalLength) * 100;
    console.log(`Elapsed: ${percentage}%`);
    setProgressBarValue(percentage);
  };
  player.attachDurationListener({
    intervalInSecs: 1,
    callback: setProgressBarValueWithElapsedTime,
  });
  const setProgressBarValueOnChange = (value, updatePlayer) => {
    setProgressBarValue(value);
    if (updatePlayer) console.log(`Jumping to offset ${value}`);
  };
  const ProgressBarSlider = withStyles({
    root: {
      color: '#fff',
      height: 4,
    },
    thumb: {
      visibility: 'hidden',
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      color: '#E65E5E',
      height: 4,
      borderRadius: 4,
      transition: 'width 0.5s linear !important',
    },
    rail: {
      color: '#fff',
      height: 4,
      borderRadius: 4,
    },
  })(Slider);

  useEffect(() => {}, []);

  const classes = useStyles();
  return (
    <ProgressBarSlider
      aria-label="progress bar"
      defaultValue={0}
      step={0.1}
      min={0}
      max={100}
      className={classes.slider}
      value={progressBarValue > 100 ? 0 : progressBarValue}
      onChangeCommitted={(_, value) => {
        console.log('com', value);
        setProgressBarValueOnChange(value, true);
      }}
      disabled
      onChange={(_, value) => {
        console.log('norm', value);
        setProgressBarValueOnChange(value);
      }}
    />
  );
};
