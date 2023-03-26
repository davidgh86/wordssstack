class MediaService {

    private static isInitialized = false;
    private static instance: MediaService;

    private static INITIALIZATION_ERROR = new Error("Media services not ready");

    public initialize() {
        MediaService.isInitialized = true
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
}

export default MediaService.getInstance()