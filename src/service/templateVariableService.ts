class TemplateVariableService {

    private static instance: TemplateVariableService;

    private imageTemplateDefaultVariables = '[{ "variableName": "src_image", "variableValue": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" }]';
    private videoTemplateDefaultVariables = '[{ "variableName": "src_video", "variableValue": "https://videos.files.wordpress.com/2IUdmeVU/fdgshdnfgt.mp4" }, { "variableName": "video_extension", "variableValue": "mp4" }]';
    private youtubeTemplateDefaultVariables = '[{ "variableName": "youtube_video_id", "variableValue": "3oOrd-oWlaE" }]';
    private htmlTemplateDefaultVariables = '[{ "variableName": "content", "variableValue": "<p>Html content</p>" }]';
    private twitterTemplateDefaultVariables = '[{ "variableName": "content", "variableValue": "<blockquote class=\'twitter-tweet\'><p lang=\'es\' dir=\'ltr\'>Hola, soy bi-color:P<a href=\'https://t.co/VJ8sZKJAPt\'>https://t.co/VJ8sZKJAPt</a> <br><br>Minecraft extremo 🥸<br>Simón dice con el ded 🥸<br>Otras cosas 🥸 <a href=\'https://t.co/kOVvqQAyF1\'>pic.twitter.com/kOVvqQAyF1</a></p>&mdash; Ari Gameplays 💗 (@arigameplays) <a href=\'https://twitter.com/arigameplays/status/1618378584397336576?ref_src=twsrc%5Etfw\'>January 25, 2023</a></blockquote>\n<script async src=\'https://platform.twitter.com/widgets.js\' charset=\'utf-8\'></script>\n" }]';

    imageTemplateVariables: any;
    videoTemplateVariables: any;
    youtubeTemplateVariables: any;
    htmlTemplateVariables: any;
    twitterTemplateVariables: any;

    constructor() {  // Constructor
        this.imageTemplateVariables = localStorage.getItem("imageTemplateVariables") || this.imageTemplateDefaultVariables;
        this.videoTemplateVariables = localStorage.getItem("videoTemplateVariables") || this.videoTemplateDefaultVariables;
        this.youtubeTemplateVariables = localStorage.getItem("youtubeTemplateVariables") || this.youtubeTemplateDefaultVariables;
        this.htmlTemplateVariables = localStorage.getItem("htmlTemplateVariables") || this.htmlTemplateDefaultVariables;
        this.twitterTemplateVariables = localStorage.getItem("twitterTemplateVariables") || this.twitterTemplateDefaultVariables;
        
        this.imageTemplateVariables = JSON.parse(this.imageTemplateVariables);
        this.videoTemplateVariables = JSON.parse(this.videoTemplateVariables);
        this.youtubeTemplateVariables = JSON.parse(this.youtubeTemplateVariables);
        this.htmlTemplateVariables = JSON.parse(this.htmlTemplateVariables);
        this.twitterTemplateVariables = JSON.parse(this.twitterTemplateVariables);
      }

    public static getInstance(): TemplateVariableService {
        if (!TemplateVariableService.instance) {
            TemplateVariableService.instance = new TemplateVariableService()
        }
        
        return TemplateVariableService.instance
    }

    getImageTemplateVariables() {
        return this.imageTemplateVariables;
    }

    getVideoTemplateVariables() {
        return this.videoTemplateVariables;
    }

    getYoutubeTemplateVariables() {
        return this.youtubeTemplateVariables;
    }

    getHtmlTemplateVariables() {
        return this.htmlTemplateVariables;
    }

    getTwitterTemplateVariables() {
        return this.twitterTemplateVariables;
    }

    setImageTemplateVariables(template) {
        this.imageTemplateVariables = template;
        localStorage.setItem("imageTemplateVariables", JSON.stringify(template));
    }

    setVideoTemplateVariables(template) {
        this.videoTemplateVariables = template;
        localStorage.setItem("videoTemplateVariables", JSON.stringify(template));
    }

    setYoutubeTemplateVariables(template) {
        this.youtubeTemplateVariables = template;
        localStorage.setItem("youtubeTemplateVariables", JSON.stringify(template));
    }

    setTwitterTemplateVariables(template) {
        this.twitterTemplateVariables = template;
        localStorage.setItem("twitterTemplateVariables", JSON.stringify(template));
    }

    setHtmlTemplateVariables(template) {
        this.htmlTemplateVariables = template;
        localStorage.setItem("htmlTemplateVariables", JSON.stringify(template));
    }

}

export default TemplateVariableService.getInstance()