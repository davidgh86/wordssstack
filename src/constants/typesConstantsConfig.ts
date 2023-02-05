import { FileTypes } from "@/wordpressstack/fileTypes";
import HTMLStackElement from "@/wordpressstack/htmlStackElement";
import ImageStackElement from "@/wordpressstack/imageStackElement";
import StackElement from "@/wordpressstack/stackElement";
import TwitterStackElement from "@/wordpressstack/twitterStackElement";
import VideoStackElement from "@/wordpressstack/videoStackElement";
import YoutubeStackElement from "@/wordpressstack/youtubeStackElement";
import TemplateEntity from "../service/TemplateEntity"

class TypesConstantsConfig {

    public static templateMap: Map<string, TemplateEntity> = new Map();

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
            htmlTemplateVariables
        ));
        TypesConstantsConfig.templateMap.set("image", new TemplateEntity(
            imageTemplate,
            imageTemplateVariables
        ));
        TypesConstantsConfig.templateMap.set("video", new TemplateEntity(
            videoTemplate,
            videoTemplateVariables
        ));
        TypesConstantsConfig.templateMap.set("youtube", new TemplateEntity(
            youtubeTemplate,
            youtubeTemplateVariables
        ));
        TypesConstantsConfig.templateMap.set("twitter", new TemplateEntity(
            twitterTemplate,
            twitterTemplateVariables
        ));
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
}

export default TypesConstantsConfig;