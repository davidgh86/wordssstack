//import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
//

class AudioService {

    private static instance: AudioService;

    public static getInstance(): AudioService {
        if(!AudioService.instance) {
            AudioService.instance = new AudioService()
        }
        return AudioService.instance
    }

    public convertToWav(audioBlob: Blob): Promise<Blob> {
        return this.convert(audioBlob);
    }

    public convert(audioFileData: Blob): Promise<Blob> {
        return this.convertOGGToWAV(audioFileData)
    }
    
    // Function to convert OGG audio blob to WAV audio blob
    private convertOGGToWAV(blob: Blob): Promise<Blob> {
        const audioContext = new AudioContext();
        const reader = new FileReader();

        const functionCreateWav = this.createWAV
        const wString = this.writeString

        return new Promise((resolve) => {
            reader.onload = function(event) {
                const oggData = event.target.result;
            
            // Decode the OGG audio data
            audioContext.decodeAudioData(oggData as ArrayBuffer, function(decodedData) {
                // Create a buffer to hold the decoded audio data
                    const buffer = audioContext.createBuffer(decodedData.numberOfChannels, decodedData.length, audioContext.sampleRate);
                    
                    // Copy the decoded audio data to the buffer
                    for (let i = 0; i < decodedData.numberOfChannels; i++) {
                        buffer.getChannelData(i).set(decodedData.getChannelData(i));
                    }
                    
                    // Create a WAV audio blob from the buffer
                    const wavData = new DataView(functionCreateWav(buffer, wString));
                    const wavBlob = new Blob([wavData], { type: 'audio/wav' });
                    
                    // Invoke the callback with the WAV audio blob
                    resolve(wavBlob);
                });
            };
            
            reader.readAsArrayBuffer(blob);
        })
        
        
    }
  
    // Function to create a WAV audio buffer from an AudioBuffer
    private createWAV(audioBuffer, writeString) {

        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const dataSize = audioBuffer.length * blockAlign;
        const buffer = new ArrayBuffer(44 + dataSize);
        const dataView = new DataView(buffer);
        
        // Write the WAV header
        writeString(dataView, 0, 'RIFF');
        dataView.setUint32(4, 36 + dataSize, true);
        writeString(dataView, 8, 'WAVE');
        writeString(dataView, 12, 'fmt ');
        dataView.setUint32(16, 16, true);
        dataView.setUint16(20, 1, true);
        dataView.setUint16(22, numChannels, true);
        dataView.setUint32(24, sampleRate, true);
        dataView.setUint32(28, sampleRate * blockAlign, true);
        dataView.setUint16(32, blockAlign, true);
        dataView.setUint16(34, bitsPerSample, true);
        writeString(dataView, 36, 'data');
        dataView.setUint32(40, dataSize, true);
        
        // Write the audio data
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let j = 0; j < numChannels; j++) {
                const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(j)[i]));
                const sample16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                dataView.setInt16(44 + i * blockAlign + j * bytesPerSample, sample16, true);
            }
        }
        
        return buffer;
    }

    private writeString(dataView, offset, string) {
        for (let i = 0; i < string.length; i++) {
            dataView.setUint8(offset + i, string.charCodeAt(i));
        }
    }
      

}

export default AudioService.getInstance()