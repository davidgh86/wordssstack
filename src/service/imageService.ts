class ImageService {

    private static instance: ImageService;

    public static getInstance(): ImageService {
        if(!ImageService.instance) {
            ImageService.instance = new ImageService()
        }
        return ImageService.instance
    }

    public blobToPNG(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((pngBlob) => {
                resolve(pngBlob);
              }, 'image/png');
            };
            img.onerror = reject;
            img.src = reader.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    }

    public cropToSquarePNG(file: File): Promise<File> {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
            ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
            canvas.toBlob((squareBlob) => {
              const squareFile = new File([squareBlob], file.name, { type: 'image/jpeg' });
              resolve(squareFile);
            }, 'image/jpeg');
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }


    public cropToSquare(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
            ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
            canvas.toBlob((squareBlob) => {
              resolve(squareBlob);
            }, 'image/png');
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }

}

export default ImageService.getInstance()