import { hot } from 'react-hot-loader/root';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './reset.css';
import './App.css';
import { Experience } from './experience/Experience';

export const App = hot(() => {
  useEffect(() => {}, []);
  return <Experience></Experience>;
});
