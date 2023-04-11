import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';
import { ref } from 'vue';

class MediaService {

    private static isInitialized = false;
    private static instance: MediaService;
    private static canRecord = ref(false)

    private static INITIALIZATION_ERROR = new Error("Media services not ready");

    public initialize() {
        MediaService.isInitialized = true
        VoiceRecorder.canDeviceVoiceRecord().then(
            (result: GenericResponse) => {
                if (result.value) {
                    VoiceRecorder.hasAudioRecordingPermission().then(
                        (result: GenericResponse) => {
                            if (result.value) {
                                MediaService.canRecord.value = true
                            } else {
                                // TODO if permission asked before do not ask again
                                VoiceRecorder.requestAudioRecordingPermission().then((result: GenericResponse) => {
                                    if (result.value) {
                                        MediaService.canRecord.value = true
                                    }
                                })
                            }
                        })
                }
            })
    }

    public getCanRecord() {
        return MediaService.canRecord
    }

    public static getInstance(): MediaService {
        if(!MediaService.instance) {
            MediaService.instance = new MediaService()
        }
        return MediaService.instance
    }

    private static checkInitializationBeforPromiseAndThen(callback): Promise<MediaFile[]> {
        return new Promise<MediaFile[]>((resolve, reject) => {
            if (!MediaService.isInitialized) {
                reject(MediaService.INITIALIZATION_ERROR)
            } else {
                callback(resolve, reject)
            }
        }) 
    }

    public captureVideo(): Promise<MediaFile[]> {
        return MediaService.checkInitializationBeforPromiseAndThen(navigator.device.capture.captureVideo)
    }

    public captureAudio(): Promise<MediaFile[]> {
        return MediaService.checkInitializationBeforPromiseAndThen(navigator.device.capture.captureAudio)
    }

    public captureImage(): Promise<MediaFile[]> {
        return MediaService.checkInitializationBeforPromiseAndThen(navigator.device.capture.captureImage)
    }

    public startRecording(): Promise<GenericResponse> {
        return VoiceRecorder.startRecording()
    }

    public stopRecording(): Promise<RecordingData> {
        return VoiceRecorder.stopRecording()
    }
}

export default MediaService.getInstance()