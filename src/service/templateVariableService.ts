class TemplateService {

    private static instance: TemplateService;

    private imageTemplateDefaultVariables = '[{ "variableName": "src_image", "variableValue": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" }]';
    private videoTemplateDefaultVariables = '[{ "variableName": "src_video", "variableValue": "https://videos.files.wordpress.com/2IUdmeVU/fdgshdnfgt.mp4" }, { "variableName": "video_extension", "variableValue": "mp4" }]';
    private youtubeTemplateDefaultVariables = '[{ "variableName": "youtube_video_id", "variableValue": "3oOrd-oWlaE" }]';
    private htmlTemplateDefaultVariables = '[{ "variableName": "content", "variableValue": "<p>Html content</p>" }]';
    
    imageTemplateVariables: string;
    videoTemplateVariables: string;
    youtubeTemplateVariables: string;
    htmlTemplateVariables: string;

    constructor() {  // Constructor
        this.imageTemplateVariables = localStorage.getItem("imageTemplateVariables") || this.imageTemplateDefaultVariables;
        this.videoTemplateVariables = localStorage.getItem("videoTemplateVariables") || this.videoTemplateDefaultVariables;
        this.youtubeTemplateVariables = localStorage.getItem("youtubeTemplateVariables") || this.youtubeTemplateDefaultVariables;
        this.htmlTemplateVariables = localStorage.getItem("htmlTemplateVariables") || this.htmlTemplateDefaultVariables;
        
        this.imageTemplateVariables = JSON.parse(this.imageTemplateVariables);
        this.videoTemplateVariables = JSON.parse(this.videoTemplateVariables);
        this.youtubeTemplateVariables = JSON.parse(this.youtubeTemplateVariables);
        this.htmlTemplateVariables = JSON.parse(this.htmlTemplateVariables);
      }

    public static getInstance(): TemplateService {
        if (!TemplateService.instance) {
            TemplateService.instance = new TemplateService()
        }
        
        return TemplateService.instance
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

    setHtmlTemplateVariables(template) {
        this.htmlTemplateVariables = template;
        localStorage.setItem("htmlTemplateVariables", JSON.stringify(template));
    }

    setImageTemplateDefaultVariables() {
        const template = this.imageTemplateDefaultVariables
        this.imageTemplateVariables = template;
        localStorage.setItem("imageTemplateVariables", template);
    }

    setVideoTemplateDefaultVariables() {
        const template = this.videoTemplateDefaultVariables
        this.videoTemplateVariables = template;
        localStorage.setItem("videoTemplateVariables", template);
    }

    setYoutubeTemplateDefaultVariables() {
        const template = this.youtubeTemplateDefaultVariables
        this.youtubeTemplateVariables = template;
        localStorage.setItem("youtubeTemplateVariables", template);
    }

    setHtmlTemplateDefaultVariables() {
        const template = this.htmlTemplateDefaultVariables
        this.htmlTemplateVariables = template;
        localStorage.setItem("htmlTemplateVariables", template);
    }


}

export default TemplateService.getInstance()