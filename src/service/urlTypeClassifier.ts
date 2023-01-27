import { FileTypes } from "@/wordpressstack/fileTypes";

class UrlTypeClassifier {

    private static instance: UrlTypeClassifier;

    public static getInstance(): UrlTypeClassifier {
        if (!UrlTypeClassifier.instance) {
            UrlTypeClassifier.instance = new UrlTypeClassifier()
        }
        
        return UrlTypeClassifier.instance
    }

    public getUrlType(url: string) {
        const hostname = (new URL(url)).hostname
        
        if (hostname === "www.youtube.com" || hostname === "youtu.be") {
            return FileTypes.YOUTUBE
        } else if (hostname === "twitter.com") {
            return FileTypes.TWITTER
        }

        return FileTypes.YOUTUBE
    }
}

export default UrlTypeClassifier.getInstance()