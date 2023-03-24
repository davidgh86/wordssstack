interface Navigator {
    notification?: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      alert(message: string, alertCallback?: Function, title?: string, buttonName?: string): void;
    };
    device?: {
      capture: {
        captureVideo(
          onSuccess: (mediaFiles: MediaFile[]) => void,
          onError: (error: CaptureError) => void,
          options?: CaptureVideoOptions
        ): void;
      };
    };
  }