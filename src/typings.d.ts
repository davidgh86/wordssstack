/* Media typings */

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
        ): void,
        captureImage(
          onSuccess: (mediaFiles: MediaFile[]) => void,
          onError: (error: CaptureError) => void,
          options?: CaptureImageOptions
        ): void,
        captureAudio(
          onSuccess: (mediaFiles: MediaFile[]) => void,
          onError: (error: CaptureError) => void,
          options?: CaptureAudioOptions
        ): void;
      };
    };
  }

interface CaptureVideoOptions {
  limit?: number,
  duration?: number
}

interface CaptureImageOptions {
  limit?: number
}

interface CaptureAudioOptions {
  limit?: number,
  duration?: number
}

interface CaptureError {
  CAPTURE_INTERNAL_ERR: Error,
  CAPTURE_APPLICATION_BUSY: Error,
  CAPTURE_INVALID_ARGUMENT: Error,
  CAPTURE_NO_MEDIA_FILES: Error,
  CAPTURE_PERMISSION_DENIED: Error,
  CAPTURE_NOT_SUPPORTED: Error
}

interface Error {
  code: number,
  message: string
}

interface MediaFile {
  name,
  fullPath,
  type,
  lastModifiedDate,
  size,
  getFormatData(
    onSuccess: (mediaFile: MediaFileData) => void,
    onError: (error: CaptureError) => void,
  )
}

interface MediaFileData {
  codecs?,
  bitrate?,
  height?,
  width?,
  duration?,
}

/* SQLite typings */

interface SQLiteDB {
  transaction(
    callback: (tx: SQLiteTransaction) => void,
    error?: (err: any) => void,
    success?: () => void
  ): void;
}

interface SQLiteTransaction {
  executeSql(
    statement: string,
    params?: any[],
    success?: (tx: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
    error?: (tx: SQLiteTransaction, err: any) => void
  ): void;
}

interface SQLiteResultSet {
  insertId: number;
  rowsAffected: number;
  rows: {
    length: number;
    item(index: number): any;
  };
}