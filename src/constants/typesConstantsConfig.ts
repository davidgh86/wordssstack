import AudioStackElement from "@/wordpressstack/audioStackElement";
import HTMLStackElement from "@/wordpressstack/htmlStackElement";
import ImageStackElement from "@/wordpressstack/imageStackElement";
import StackElement from "@/wordpressstack/stackElement";
import StrawpollStackElement from "@/wordpressstack/strawpollStackElement";
import TwitterStackElement from "@/wordpressstack/twitterStackElement";
import VideoStackElement from "@/wordpressstack/videoStackElement";
import YoutubeStackElement from "@/wordpressstack/youtubeStackElement";
import TemplateEntity from "../service/TemplateEntity"

enum FileTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    HTML = "HTML",
    YOUTUBE = "YOUTUBE",
    TWITTER = "TWITTER",
    UNKNOWN = "UNKNOWN",
    STRAWPOLL = "STRAWPOLL",

    LINK = "LINK"
}

class TypesConstantsConfig {

    public static templateMap: Map<string, TemplateEntity> = new Map();

    public static extensions = new Map<string, FileTypes>(
        [
            ["html", FileTypes.HTML],
            ["htm", FileTypes.HTML],
            
            ["jpg", FileTypes.IMAGE],
            ["jpeg", FileTypes.IMAGE],
            ["png", FileTypes.IMAGE],
            ["gif", FileTypes.IMAGE],

            ["mp3", FileTypes.AUDIO],
            ["aac", FileTypes.AUDIO],
            ["ogg", FileTypes.AUDIO],
            ["opus", FileTypes.AUDIO],
            ["m4a", FileTypes.AUDIO],
            ["wav", FileTypes.AUDIO],
            
            ["mp4", FileTypes.VIDEO],
            ["youtube", FileTypes.YOUTUBE],
            ["twitter", FileTypes.TWITTER],
            ["strawpoll", FileTypes.STRAWPOLL],

            ["link", FileTypes.LINK],
        ]
    )

    static {

        const imageTemplateDefaultVariables = '[{ "variableName": "src_image", "variableValue": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" }]';
        const videoTemplateDefaultVariables = '[{ "variableName": "src_video", "variableValue": "https://videos.files.wordpress.com/2IUdmeVU/fdgshdnfgt.mp4" }, { "variableName": "video_extension", "variableValue": "mp4" }]';
        const audioTemplateDefaultVariables = '[{ "variableName": "src_audio", "variableValue": "https://download.samplelib.com/mp3/sample-6s.mp3" }]';
        const youtubeTemplateDefaultVariables = '[{ "variableName": "youtube_video_id", "variableValue": "3oOrd-oWlaE" }]';
        const strawpollTemplateDefaultVariables = '[{ "variableName": "strawpoll_embed_url", "variableValue": "https://strawpoll.com/embed/rae5gcp1" }]';
        const htmlTemplateDefaultVariables = '[{ "variableName": "content", "variableValue": "<p>Html content</p>" }]';
        const auxTwitterTemplate = "<blockquote class=\"twitter-tweet\"><p lang=\"es\" dir=\"ltr\">Hola, soy bi-color:P<a href=\"https://t.co/VJ8sZKJAPt\">https://t.co/VJ8sZKJAPt</a> <br><br>Minecraft extremo 🥸<br>Simón dice con el ded 🥸<br>Otras cosas 🥸 <a href=\"https://t.co/kOVvqQAyF1\">pic.twitter.com/kOVvqQAyF1</a></p>&mdash; Ari Gameplays 💗 (@arigameplays) <a href=\"https://twitter.com/arigameplays/status/1618378584397336576?ref_src=twsrc%5Etfw\">January 25, 2023</a></blockquote>\n<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n"
        const twitterTemplateDefaultVariables = JSON.stringify([{ variableName: "content", variableValue: auxTwitterTemplate }]);

        const defaultVideoTemplate = `<div style="width: 100%;height: 100%;overflow: hidden;">
    <video controls style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">
        <source src="{src_video}" type="video/{video_extension}">
    </video>
</div>`
        const defaultAudioTemplate = `<audio controls>
    <source src="{src_audio}">
    Your browser does not support the audio element.
</audio>`
        const defaultImageTemplate = `<img src="{src_image}"/>`
        const defaultYoutubeTemplate = `<iframe width="560" height="315" src="https://www.youtube.com/embed/{youtube_video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        const defaultStrawpollTemplate = `<iframe width="620" height="512" src="{strawpoll_embed_url}" style="width: 100%; height: 515px;" frameborder="0" allowfullscreen></iframe>`
        const defaultHtmlTemplate = `{content}`
        const defaultTwitterTemplate = `{content}`


        const imageTemplateVariables = JSON.parse(localStorage.getItem("imageTemplateVariables") || imageTemplateDefaultVariables);
        const videoTemplateVariables = JSON.parse(localStorage.getItem("videoTemplateVariables") || videoTemplateDefaultVariables);
        const audioTemplateVariables = JSON.parse(localStorage.getItem("audioTemplateVariables") || audioTemplateDefaultVariables);
        const youtubeTemplateVariables = JSON.parse(localStorage.getItem("youtubeTemplateVariables") || youtubeTemplateDefaultVariables);
        const strawpollTemplateVariables = JSON.parse(localStorage.getItem("strawpollTemplateVariables") || strawpollTemplateDefaultVariables);
        const htmlTemplateVariables = JSON.parse(localStorage.getItem("htmlTemplateVariables") || htmlTemplateDefaultVariables);
        const twitterTemplateVariables = JSON.parse(localStorage.getItem("twitterTemplateVariables") || twitterTemplateDefaultVariables);

        const imageTemplate = localStorage.getItem("imageTemplate") || defaultImageTemplate;
        const videoTemplate = localStorage.getItem("videoTemplate") || defaultVideoTemplate;
        const audioTemplate = localStorage.getItem("videoTemplate") || defaultAudioTemplate;
        const youtubeTemplate = localStorage.getItem("youtubeTemplate") || defaultYoutubeTemplate;
        const strawpollTemplate = localStorage.getItem("strawpollTemplate") || defaultStrawpollTemplate;
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
        TypesConstantsConfig.templateMap.set("audio", new TemplateEntity(
            audioTemplate,
            audioTemplateVariables,
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
        TypesConstantsConfig.templateMap.set("strawpoll", new TemplateEntity(
            strawpollTemplate,
            strawpollTemplateVariables,
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

    private static getMimeTypeFromBase64String(base64String: string): string {
        return base64String.substring(5, base64String.indexOf(';'))
    }

    public static getStackElementByBase64String(base64String: string): StackElement {
        const extension = this.getMimeTypeFromBase64String(base64String).split("/")[1]
        const fileType = this.extensions.get(extension)
        switch(fileType) {
            case FileTypes.IMAGE: {
                return new ImageStackElement(base64String, undefined)
                break;
            }
            case FileTypes.VIDEO: {
                return new VideoStackElement(base64String, undefined)
                break;
            }
            case FileTypes.AUDIO: {
                return new AudioStackElement(base64String, undefined)
                break;
            }
            default: {
                throw new Error("Not implemented exception")
            }
        } 
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
            case FileTypes.AUDIO: {
                return new AudioStackElement(element.filePath, element.extension)
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
            case FileTypes.STRAWPOLL: {
                return new StrawpollStackElement(element.url, element.embedUrl)
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
        } else if (fileType === FileTypes.AUDIO) {
            return "audio/"+extension
        } 
        return ""
    }
}

export {TypesConstantsConfig, FileTypes};