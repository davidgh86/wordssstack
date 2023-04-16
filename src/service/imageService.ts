class ImageService {

    private static instance: ImageService;

    public static getInstance(): ImageService {
        if(!ImageService.instance) {
            ImageService.instance = new ImageService()
        }
        return ImageService.instance
    }

    public cropToSquarePng(blob: Blob): Promise<Blob> {
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
          img.src = URL.createObjectURL(blob);
        });
      }

}

export default ImageService.getInstance()