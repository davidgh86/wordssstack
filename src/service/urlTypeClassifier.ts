import { FileTypes } from "@/wordpressstack/fileTypes";

class UrlTypeClassifier {

    private static instance: UrlTypeClassifier;

    public static getInstance(): UrlTypeClassifier {
        if (!UrlTypeClassifier.instance) {
            UrlTypeClassifier.instance = new UrlTypeClassifier()
        }
        
        return UrlTypeClassifier.instance
    }

    private getUrlType(url: string) {
        return FileTypes.YOUTUBE
    }
}

export default UrlTypeClassifier.getInstance()