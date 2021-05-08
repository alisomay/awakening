export class Player {
  constructor(url, playButton) {
    this.buf;
    this.ctx = new AudioContext();
    let context = this.ctx;
    window
      .fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        playButton.disabled = false;
        this.buf = audioBuffer;
      });
    this.playing = false;
  }
  play() {
    console.log('Play');
    this.playing = true;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buf;
    console.log(source.buffer);

    // Patching
    source.connect(this.ctx.destination);
    source.start();
  }
}
