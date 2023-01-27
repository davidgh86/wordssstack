class TemplateService {

    private static instance: TemplateService;

    private defaultVideoTemplate = `<div style="width: 100%;height: 100%;overflow: hidden;">
    <video controls style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">
        <source src="{src_video}" type="video/{video_extension}">
    </video>
</div>`
    private defaultImageTemplate = `<img src="{src_image}"/>`
    private defaultYoutubeTemplate = `<iframe width="560" height="315" src="https://www.youtube.com/embed/{youtube_video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    private defaultHtmlTemplate = `{content}`
    private defaultTwitterTemplate = `{content}`
    
    imageTemplate: string;
    videoTemplate: string;
    youtubeTemplate: string;
    htmlTemplate: string;
    twitterTemplate: string;

    constructor() {  // Constructor
        this.imageTemplate = localStorage.getItem("imageTemplate") || this.defaultImageTemplate;
        this.videoTemplate = localStorage.getItem("videoTemplate") || this.defaultVideoTemplate;
        this.youtubeTemplate = localStorage.getItem("youtubeTemplate") || this.defaultYoutubeTemplate;
        this.htmlTemplate = localStorage.getItem("htmlTemplate") || this.defaultHtmlTemplate;
        this.twitterTemplate = localStorage.getItem("twitterTemplate") || this.defaultTwitterTemplate;
      }

    public static getInstance(): TemplateService {
        if (!TemplateService.instance) {
            TemplateService.instance = new TemplateService()
        }
        
        return TemplateService.instance
    }

    getImageTemplate() {
        return this.imageTemplate;
    }

    getVideoTemplate() {
        return this.videoTemplate;
    }

    getYoutubeTemplate() {
        return this.youtubeTemplate;
    }

    getHtmlTemplate() {
        return this.htmlTemplate;
    }

    getTwitterTemplate() {
        return this.twitterTemplate;
    }

    setImageTemplate(template) {
        this.imageTemplate = template;
        localStorage.setItem("imageTemplate", template);
    }

    setVideoTemplate(template) {
        this.videoTemplate = template;
        localStorage.setItem("videoTemplate", template);
    }

    setYoutubeTemplate(template) {
        this.youtubeTemplate = template;
        localStorage.setItem("youtubeTemplate", template);
    }

    setTwitterTemplate(template) {
        this.twitterTemplate = template;
        localStorage.setItem("twitterTemplate", template);
    }

    setHtmlTemplate(template) {
        this.htmlTemplate = template;
        localStorage.setItem("htmlTemplate", template);
    }

}

export default TemplateService.getInstance()