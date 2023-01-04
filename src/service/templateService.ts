class TemplateService {

    private static instance: TemplateService;
    
    imageTemplate: string;
    videoTemplate: string;
    youtubeTemplate: string;
    htmlTemplate: string;

    constructor() {  // Constructor
        this.imageTemplate = localStorage.getItem("imageTemplate") || '<div>{content}</div>';
        this.videoTemplate = localStorage.getItem("videoTemplate") || '<div>{content}</div>';
        this.youtubeTemplate = localStorage.getItem("youtubeTemplate") || '<div>{content}</div>';
        this.htmlTemplate = localStorage.getItem("htmlTemplate") || '<div>{content}</div>';
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

    setHtmlTemplate(template) {
        this.htmlTemplate = template;
        localStorage.setItem("htmlTemplate", template);
    }

    setImageTemplateDefault() {
        const template = `<img src="{image_src}"/>`
        this.imageTemplate = template;
        localStorage.setItem("imageTemplate", template);
    }

    setVideoTemplateDefault() {
        const template = `<div style="width: 100%;height: 100%;overflow: hidden;">
            <video controls style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">
                <source src="{video_src}" type="video/{video_extension}">
            </video>
        </div>`
        this.videoTemplate = template;
        localStorage.setItem("videoTemplate", template);
    }

    setYoutubeTemplateDefault() {
        const template = `<iframe width="560" height="315" src="https://www.youtube.com/embed/{youtube_video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        this.youtubeTemplate = template;
        localStorage.setItem("youtubeTemplate", template);
    }

    setHtmlTemplateDefault() {
        const template = `{html_content}`
        this.htmlTemplate = template;
        localStorage.setItem("htmlTemplate", template);
    }


}

export default TemplateService.getInstance()