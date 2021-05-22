export class Player {
  constructor(url) {
    this.buf;
    this.onEnded = () => {
      this.stop();
    };
    this.onStop = () => {};
    this.onStart = () => {};
    this.onPause = () => {};
    this.info = null;
    this.audioLoaded = false;
    this.ctx = new AudioContext();
    let context = this.ctx;
    window
      .fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        console.log('Audio Loaded');
        this.audioLoaded = true;
        this.buf = audioBuffer;
      });
    this._playing = false;
    this.paused = false;

    this.startedAt = 0;
    this.pausedAt = 0;

    this.monitorInterval = null;
    this.monitorFunction = null;
  }
  attachDurationListener(
    info = {
      intervalInSecs: 1,
      callback: (totalLength, currentOffset) => {
        console.log(
          `Elapsed: ${(currentOffset / totalLength) * 100}`,
        );
      },
    },
  ) {
    this.info = info;
  }
  attachLifeCycleListener(type, callback) {
    switch (type) {
      case 'onEnded':
        this.onEnded = callback;
        break;
      case 'onStop':
        this.onStop = callback;
        break;
      case 'onStart':
        this.onStart = callback;
        break;
      case 'onPause':
        this.onPause = callback;
        break;
    }
  }

  init() {
    console.log('Init');
  }
  play() {
    this.source = this.ctx.createBufferSource();
    this.source.connect(this.ctx.destination);
    this.source.buffer = this.buf;
    this.currentTimeAtPlay = this.ctx.currentTime;
    this.source.onended = (event) => {
      console.log(
        '______END______',
        // event,
        'STARTED AT:',
        this.startedAt,
        'PAUSED AT: ',
        this.pausedAt,
        'CURRENT TIME: ',
        this.ctx.currentTime,
      );
      if (this.paused) {
        this.onEnded(this.paused);
      } else {
        this.stop();
        this.onEnded();
      }
    };

    console.log('______PLAY______');
    console.log(
      // this.source,
      'STARTED AT:',
      this.startedAt,
      'PAUSED AT: ',
      this.pausedAt,
      'CURRENT TIME: ',
      this.ctx.currentTime,
    );
    console.log('\n');

    this.startedAt = this.ctx.currentTime - this.pausedAt;
    this.source.start(0, this.pausedAt);

    this.monitorFunction = () => {
      const currentTime = this.getCurrentTime();
      console.log('CURRENT TIME AT PLAY:', this.currentTimeAtPlay);
      console.log('CURRENT TIME AT PAUSE:', this.currentTimeAtPause);
      console.log('SENT TIME:', currentTime);
      const duration = this.getDuration();
      this.info.callback(duration, currentTime);
    };
    this.monitorFunction();
    this.monitorInterval = setInterval(
      this.monitorFunction,
      this.info.intervalInSecs * 1000,
    );

    this._playing = true;
    this.paused = false;

    this.onStart();
  }
  pause() {
    console.log('______PAUSE______');
    console.log(
      // this.source,
      'CURRENT TIME: ',
      this.ctx.currentTime,
    );
    console.log('\n');
    let elapsed = this.ctx.currentTime - this.startedAt;
    this.stop(true);
    this.pausedAt = elapsed;
    this.currentTimeAtPause = this.ctx.currentTime;
    console.log(
      'STARTED AT:',
      this.startedAt,
      'PAUSED AT: ',
      this.pausedAt,
    );
    this._playing = false;
    this.paused = true;

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.onPause();
    if (this.source) this.source.stop(0);
  }
  stop(paused) {
    if (this.source) {
      this.source.disconnect();
      this.source.stop(0);
      this.source = null;
    }
    if (!paused) {
      console.log(
        'Stop',
        // this.source,
        'STARTED AT:',
        this.startedAt,
        'PAUSED AT: ',
        this.pausedAt,
        'CURRENT TIME: ',
        this.ctx.currentTime,
      );
    }

    this.startedAt = 0;
    this.pausedAt = 0;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }

    this._playing = false;
    this.paused = true;

    this.onStop();
  }

  playing() {
    return this._playing;
  }
  ready() {
    return this.audioLoaded;
  }

  getCurrentTime() {
    if (this.pausedAt) {
      return (
        this.ctx.currentTime - this.currentTimeAtPlay + this.pausedAt
      );
    }
    return this.ctx.currentTime - this.startedAt;
  }
  getDuration() {
    return this.buf.duration;
  }
}

// function createSound(buffer, context) {
//   var sourceNode = null,
//     startedAt = 0,
//     pausedAt = 0,
//     playing = false;

//   var play = function () {
//     var offset = pausedAt;

//     sourceNode = context.createBufferSource();
//     sourceNode.connect(context.destination);
//     sourceNode.buffer = buffer;
//     sourceNode.start(0, offset);

//     startedAt = context.currentTime - offset;
//     pausedAt = 0;
//     playing = true;
//   };

//   var pause = function () {
//     var elapsed = context.currentTime - startedAt;
//     stop();
//     pausedAt = elapsed;
//   };

//   var stop = function () {
//     if (sourceNode) {
//       sourceNode.disconnect();
//       sourceNode.stop(0);
//       sourceNode = null;
//     }
//     pausedAt = 0;
//     startedAt = 0;
//     playing = false;
//   };

//   var getPlaying = function () {
//     return playing;
//   };

//   var getCurrentTime = function () {
//     if (pausedAt) {
//       return pausedAt;
//     }
//     if (startedAt) {
//       return context.currentTime - startedAt;
//     }
//     return 0;
//   };

//   var getDuration = function () {
//     return buffer.duration;
//   };

//   return {
//     getCurrentTime: getCurrentTime,
//     getDuration: getDuration,
//     getPlaying: getPlaying,
//     play: play,
//     pause: pause,
//     stop: stop,
//   };
// }
