class BeatGetterProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.processedBufferCount = 0;
    this.processedSampleCount = 0;
    this.sixteenthCount = 0;
    this.everIncreasingSampleCount = 0;
    this.firstBeat = true;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i];
        this.processedSampleCount += 1;
        this.everIncreasingSampleCount += 1;

        if (!(this.everIncreasingSampleCount * 0.5 < START_OFFSET)) {
          if (this.firstBeat) {
            this.port.postMessage(this.processedSampleCount);
            this.firstBeat = false;
            this.processedSampleCount = 0;
            this.processedBufferCount = 0;
          }

          if (
            this.sixteenthCount >= 240 &&
            this.sixteenthCount < 256
          ) {
            if (
              this.processedSampleCount * 0.5 >=
              BPM_IN_SAMPLES_164
            ) {
              this.port.postMessage(this.processedSampleCount);
              this.processedSampleCount = 0;
              this.processedBufferCount = 0;
              this.sixteenthCount += 1;
            }
          } else {
            if (
              this.processedSampleCount * 0.5 >=
              BPM_IN_SAMPLES_139
            ) {
              this.port.postMessage(this.processedSampleCount);
              this.processedSampleCount = 0;
              this.processedBufferCount = 0;
              this.sixteenthCount += 1;
            }
          }
        }
      }
    }

    this.processedBufferCount += 1;

    // if (this.sixteenthCount >= 240 && this.sixteenthCount < 256) {
    //   if (this.processedSampleCount * 0.5 >= BPM_IN_SAMPLES_164) {
    //     this.port.postMessage(this.processedSampleCount);
    //     this.processedSampleCount = 0;
    //     this.processedBufferCount = 0;
    //     this.sixteenthCount += 1;
    //   }
    // } else {
    // if (this.processedSampleCount * 0.5 >= BPM_IN_SAMPLES_139) {
    //   this.port.postMessage(this.processedSampleCount);
    //   this.processedSampleCount = 0;
    //   this.processedBufferCount = 0;
    //   this.sixteenthCount += 1;
    // }
    // }

    return true;
  }
}
// 10.8 9.08
// 101 ,87
const BPM_IN_SAMPLES_139 = Math.floor(sampleRate * 10.8 * 0.01);
console.log(BPM_IN_SAMPLES_139);
const BPM_IN_SAMPLES_164 = sampleRate * 8.8 * 0.01;
const START_OFFSET = Math.floor(sampleRate * 48.5 * 0.01);

registerProcessor('beat-getter-processor', BeatGetterProcessor);
export default BeatGetterProcessor;
