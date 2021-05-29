class BeatGetterProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.processedBufferCount = 0;
    this.processedSampleCount = 0;
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
      }
    }

    this.processedBufferCount += 1;
    if (this.processedSampleCount * 0.5 >= BPM_IN_SAMPLES_139) {
      this.port.postMessage(this.processedSampleCount);
      this.processedSampleCount = 0;
      this.processedBufferCount = 0;
    }
    return true;
  }
}

const BPM_IN_SAMPLES_139 = sampleRate * 43.2 * 0.01;

registerProcessor('beat-getter-processor', BeatGetterProcessor);
export default BeatGetterProcessor;
