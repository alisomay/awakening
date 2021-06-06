import { AudioWorklet } from 'audio-worklet';
import io from 'socket.io-client';
export class Player {
  constructor(url) {
    // this.socket = io(`http://localhost:3000`);
    this.buf;
    this.onEndedCallbacks = [
      () => {
        this.stop();
      },
    ];
    this.onStop = () => {};
    this.onStart = () => {};
    this.onPause = () => {};
    this.onCredits = () => {};
    this.onBarCallbacks = [];
    this.onHalfBarCallbacks = [];
    this.onBeatCallbacks = [];
    this.onEighthCallbacks = [];
    this.onSixteenthCallbacks = [];
    this.info = null;
    this.audioLoaded = false;
    this.ctx = new AudioContext();
    this.sixteenthCounter = 0;
    this.barCounter = 0;
    this.beatCounter = 0;
    // After worklet loaded

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
        // console.log(
        //   `Elapsed: ${(currentOffset / totalLength) * 100}`,
        // );
      },
    },
  ) {
    this.info = info;
  }
  attachLifeCycleListener(type, callback) {
    switch (type) {
      case 'onEnded':
        this.onEndedCallbacks.push(callback);
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
      case 'onBar':
        this.onBarCallbacks.push(callback);
        break;
      case 'onHalfBar':
        this.onHalfBarCallbacks.push(callback);
        break;
      case 'onBeat':
        this.onBeatCallbacks.push(callback);
        break;
      case 'onEighth':
        this.onEighthCallbacks.push(callback);
        break;
      case 'onSixteenth':
        this.onSixteenthCallbacks.push(callback);
        break;
      case 'onCredits':
        this.onCredits = callback;
        break;
    }
  }

  init() {
    console.log('Init');
  }
  play(replaying) {
    this.worldRef.play(replaying);
    this.worldRef.animationTimelineStart();
    this.sixteenthCounter = 0;
    this.barCounter = 0;
    this.beatCounter = 0;
    console.log(this.ctx.audioWorklet);
    this.ctx.audioWorklet
      .addModule(
        new AudioWorklet(new URL('./BeatGetter.js', import.meta.url)),
      )
      .then(() => {
        this.analyser = this.ctx.createAnalyser();
        this.source = this.ctx.createBufferSource();
        this.source.buffer = this.buf;
        this.beatGetterWorkletNode = new window.AudioWorkletNode(
          this.ctx,
          'beat-getter-processor',
        );

        this.source.connect(this.beatGetterWorkletNode);
        this.beatGetterWorkletNode.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        //this.beatGetterWorkletNode.connect(this.ctx.destination);
        this.beatGetterWorkletNode.port.onmessage = (event) => {
          if (this.sixteenthCounter) {
            if (!(this.sixteenthCounter % 4)) {
              // Every beat, 139 BPM.
              // this.socket.emit(`beat`);
              this.onBeatCallbacks.forEach((cb) => {
                cb(this.analyse());
              });
              this.beatCounter += 1;
            }
            if (!(this.sixteenthCounter % 2)) {
              // Every eighth, 139 BPM.
              this.onEighthCallbacks.forEach((cb) => {
                cb(this.analyse());
              });
            }
            if (!(this.sixteenthCounter % 16)) {
              console.log(this.barCounter);

              // Every Bar, 139 BPM.
              this.onBarCallbacks.forEach((cb) => {
                cb(this.analyse(), this.barCounter);
              });
              // Credits

              if (this.barCounter === 107) {
                this.onCredits();
                // console.log(this.setCreditIndex);
                this.setCreditIndex(0);
              }
              if (this.barCounter === 108) {
                this.setCreditIndex(1);
              }
              if (this.barCounter === 110) {
                this.setCreditIndex(2);
              }
              if (this.barCounter === 112) {
                this.setCreditIndex(3);
              }

              this.barCounter += 1;
            }
            if (!(this.sixteenthCounter % 8)) {
              // Every HalfBar, 139 BPM.
              this.onHalfBarCallbacks.forEach((cb) => {
                cb(this.analyse());
              });
            } else {
              // Every sixteenth, 139 BPM.
              this.onSixteenthCallbacks.forEach((cb) => {
                cb(this.analyse());
              });
            }
          }
          this.sixteenthCounter += 1;
        };

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
            this.onEndedCallbacks.forEach((cb) => {
              cb(this.paused);
            });
          } else {
            this.stop();
            this.onEndedCallbacks.forEach((cb) => {
              cb();
            });
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
          // console.log(
          //   'CURRENT TIME AT PLAY:',
          //   this.currentTimeAtPlay,
          // );
          // console.log(
          //   'CURRENT TIME AT PAUSE:',
          //   this.currentTimeAtPause,
          // );
          // console.log('SENT TIME:', currentTime);
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
      });
  }
  pause() {
    this.barCounter = 0;
    this.beatCounter = 0;
    this.sixteenthCounter = 0;
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
    this.barCounter = 0;
    this.beatCounter = 0;
    this.sixteenthCounter = 0;
    if (this.source) {
      this.beatGetterWorkletNode.disconnect();
      this.analyser.disconnect();
      this.source.disconnect();
      this.source.stop(0);
      this.source = null;
      this.beatGetterWorkletNode = null;
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
  analyse() {
    this.analyser.fftSize = 2048;
    const sampleBuffer = new Float32Array(this.analyser.fftSize);

    this.analyser.getFloatTimeDomainData(sampleBuffer);

    // Compute average power over the interval.
    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      sumOfSquares += sampleBuffer[i] ** 2;
    }
    const avgPowerDecibels =
      10 * Math.log10(sumOfSquares / sampleBuffer.length);

    // Compute peak instantaneous power over the interval.
    let peakInstantaneousPower = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      const power = sampleBuffer[i] ** 2;
      peakInstantaneousPower = Math.max(
        power,
        peakInstantaneousPower,
      );
    }
    const peakInstantaneousPowerDecibels =
      10 * Math.log10(peakInstantaneousPower);
    return [avgPowerDecibels, peakInstantaneousPowerDecibels];
  }
}
