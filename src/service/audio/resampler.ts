export default class WavEncoder {
  private sampleRate: number;
  private channels: number;
  private bitsPerSample: number;

  constructor(sampleRate = 44100, channels = 2, bitsPerSample = 16) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitsPerSample = bitsPerSample;
  }

  public encode(audioData: AudioBuffer): ArrayBuffer {
    const samples = audioData.getChannelData(0);
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    view.setUint32(0, 0x52494646); // "RIFF"
    view.setUint32(4, 36 + samples.length * 2, true);
    view.setUint32(8, 0x57415645); // "WAVE"

    // fmt sub-chunk
    view.setUint32(12, 0x666d7420); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, this.channels, true);
    view.setUint32(24, this.sampleRate, true);
    view.setUint32(28, this.sampleRate * this.channels * this.bitsPerSample / 8, true);
    view.setUint16(32, this.channels * this.bitsPerSample / 8, true);
    view.setUint16(34, this.bitsPerSample, true);

    // data sub-chunk
    view.setUint32(36, 0x64617461); // "data"
    view.setUint32(40, samples.length * 2, true);
    const offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      const sampleInt = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset + i * 2, sampleInt, true);
    }

    return buffer;
  }
}