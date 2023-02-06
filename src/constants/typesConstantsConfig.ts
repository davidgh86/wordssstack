import HTMLStackElement from "@/wordpressstack/htmlStackElement";
import ImageStackElement from "@/wordpressstack/imageStackElement";
import StackElement from "@/wordpressstack/stackElement";
import TwitterStackElement from "@/wordpressstack/twitterStackElement";
import VideoStackElement from "@/wordpressstack/videoStackElement";
import YoutubeStackElement from "@/wordpressstack/youtubeStackElement";
import TemplateEntity from "../service/TemplateEntity"

enum FileTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    HTML = "HTML",
    YOUTUBE = "YOUTUBE",
    TWITTER = "TWITTER",
    UNKNOWN = "UNKNOWN"
}

class TypesConstantsConfig {

    public static templateMap: Map<string, TemplateEntity> = new Map();

    private static extensions = new Map<string, FileTypes>(
        [
            ["html", FileTypes.HTML],
            ["htm", FileTypes.HTML],
            
            ["jpg", FileTypes.IMAGE],
            ["jpeg", FileTypes.IMAGE],
            ["png", FileTypes.IMAGE],
            ["gif", FileTypes.IMAGE],
            
            ["mp4", FileTypes.VIDEO],
            ["youtube", FileTypes.YOUTUBE],
            ["twitter", FileTypes.TWITTER],
        ]
    )

    static {

        const imageTemplateDefaultVariables = '[{ "variableName": "src_image", "variableValue": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" }]';
        const videoTemplateDefaultVariables = '[{ "variableName": "src_video", "variableValue": "https://videos.files.wordpress.com/2IUdmeVU/fdgshdnfgt.mp4" }, { "variableName": "video_extension", "variableValue": "mp4" }]';
        const youtubeTemplateDefaultVariables = '[{ "variableName": "youtube_video_id", "variableValue": "3oOrd-oWlaE" }]';
        const htmlTemplateDefaultVariables = '[{ "variableName": "content", "variableValue": "<p>Html content</p>" }]';
        const auxTwitterTemplate = "<blockquote class=\"twitter-tweet\"><p lang=\"es\" dir=\"ltr\">Hola, soy bi-color:P<a href=\"https://t.co/VJ8sZKJAPt\">https://t.co/VJ8sZKJAPt</a> <br><br>Minecraft extremo 🥸<br>Simón dice con el ded 🥸<br>Otras cosas 🥸 <a href=\"https://t.co/kOVvqQAyF1\">pic.twitter.com/kOVvqQAyF1</a></p>&mdash; Ari Gameplays 💗 (@arigameplays) <a href=\"https://twitter.com/arigameplays/status/1618378584397336576?ref_src=twsrc%5Etfw\">January 25, 2023</a></blockquote>\n<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n"
        const twitterTemplateDefaultVariables = JSON.stringify([{ variableName: "content", variableValue: auxTwitterTemplate }]);

        const defaultVideoTemplate = `<div style="width: 100%;height: 100%;overflow: hidden;">
    <video controls style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">
        <source src="{src_video}" type="video/{video_extension}">
    </video>
</div>`
        const defaultImageTemplate = `<img src="{src_image}"/>`
        const defaultYoutubeTemplate = `<iframe width="560" height="315" src="https://www.youtube.com/embed/{youtube_video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        const defaultHtmlTemplate = `{content}`
        const defaultTwitterTemplate = `{content}`


        const imageTemplateVariables = JSON.parse(localStorage.getItem("imageTemplateVariables") || imageTemplateDefaultVariables);
        const videoTemplateVariables = JSON.parse(localStorage.getItem("videoTemplateVariables") || videoTemplateDefaultVariables);
        const youtubeTemplateVariables = JSON.parse(localStorage.getItem("youtubeTemplateVariables") || youtubeTemplateDefaultVariables);
        const htmlTemplateVariables = JSON.parse(localStorage.getItem("htmlTemplateVariables") || htmlTemplateDefaultVariables);
        const twitterTemplateVariables = JSON.parse(localStorage.getItem("twitterTemplateVariables") || twitterTemplateDefaultVariables);

        const imageTemplate = localStorage.getItem("imageTemplate") || defaultImageTemplate;
        const videoTemplate = localStorage.getItem("videoTemplate") || defaultVideoTemplate;
        const youtubeTemplate = localStorage.getItem("youtubeTemplate") || defaultYoutubeTemplate;
        const htmlTemplate = localStorage.getItem("htmlTemplate") || defaultHtmlTemplate;
        const twitterTemplate = localStorage.getItem("twitterTemplate") || defaultTwitterTemplate;

        TypesConstantsConfig.templateMap.set("html", new TemplateEntity(
            htmlTemplate,
            htmlTemplateVariables,
            false
        ));
        TypesConstantsConfig.templateMap.set("image", new TemplateEntity(
            imageTemplate,
            imageTemplateVariables,
            false
        ));
        TypesConstantsConfig.templateMap.set("video", new TemplateEntity(
            videoTemplate,
            videoTemplateVariables,
            false
        ));
        TypesConstantsConfig.templateMap.set("youtube", new TemplateEntity(
            youtubeTemplate,
            youtubeTemplateVariables,
            true
        ));
        TypesConstantsConfig.templateMap.set("twitter", new TemplateEntity(
            twitterTemplate,
            twitterTemplateVariables,
            true
        ));
    }

    public static getTemplateMap() {
        const result = {}
        const keys = TypesConstantsConfig.templateMap.keys()
        for (const key of keys) {
          result[key] = {
            variables: TypesConstantsConfig.templateMap.get(key).getVariables(),
            template: TypesConstantsConfig.templateMap.get(key).getTemplate(),
            isUrl: TypesConstantsConfig.templateMap.get(key).isUrl()
          }
        }
        return result
    }

    public static getUrlTypes(){
        const result = []
        const keys = TypesConstantsConfig.templateMap.keys()
        for (const key of keys) {
            if (TypesConstantsConfig.templateMap.get(key).isUrl()) {
                result.push(key)
            }
        }
        return result
    }

    public static getStackElementByString(fileType: FileTypes, element: any): StackElement {
        switch(fileType) {
            case FileTypes.IMAGE: {
                return new ImageStackElement(element.filePath, undefined)
                break;
            }
            case FileTypes.HTML: {
                return new HTMLStackElement(element.html)
                break;
            }
            case FileTypes.VIDEO: {
                return new VideoStackElement(element.filePath, element.extension)
                break;
            }
            case FileTypes.YOUTUBE: {
                return new YoutubeStackElement(element.url)
                break;
            }
            case FileTypes.TWITTER: {
                return new TwitterStackElement(element.url)
                break;
            }
            default: {
                throw new Error("Not implemented exception")
            }
        } 
    }

    public static getFileTypeByExtension(extension: string): FileTypes|undefined {
        const standarizedExtension = extension.trim().toLowerCase()
        if (!TypesConstantsConfig.extensions.has(standarizedExtension)) {
            return FileTypes.UNKNOWN
        }
        else {
            return TypesConstantsConfig.extensions.get(standarizedExtension)
        }
    }

    public static getMimeTypeFromExtension(extension: string): string {
        const standarizedExtension = extension.trim().toLowerCase()
        const fileType: FileTypes = TypesConstantsConfig.getFileTypeByExtension(standarizedExtension)
        if (fileType === FileTypes.IMAGE) {
            if (extension == "jpg"){
                return "image/jpeg"
            } else {
                return "image/"+extension
            }
        } else if (fileType === FileTypes.VIDEO) {
            return "video/"+extension
        }
        return ""
    }
}

export {TypesConstantsConfig, FileTypes};