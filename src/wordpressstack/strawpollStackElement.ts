'use strict';



import { v4 as uuid } from 'uuid';

import templateManagerService from "@/service/templateManagerService";
import { FileTypes } from "@/constants/typesConstantsConfig";

class StrawpollStackElement implements StrawpollStackElement {
    
    fileType:FileTypes;
    url:string;
    embedUrl:string;
    id: string;

    constructor(url: string, embedUrl: string) {
        this.fileType = FileTypes.STRAWPOLL
        this.url = url
        this.embedUrl = embedUrl
        this.id = uuid()
    }

    getId(): string {
        return this.id
    }

    getStrawpollID(url){
        return url.split("/polls/").pop().split("/embed/").pop().split("/")[0].split("?")[0]
    }

    getYoutubeVideoId() {
        return this.getStrawpollID(this.url)
    }

    getEmbedUrl() {
        if (!this.embedUrl) {
            return "https://strawpoll.com/embed/"+this.getStrawpollID(this.url);
        }
        else return this.embedUrl
    }

    getHtmlElement(): string {
        const variables = templateManagerService.getTemplateVariables("strawpoll")
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("strawpoll"))
    }

    getPrevisualizedHtmlElement(): string {
        return `<iframe width="620" height="512" src="${this.getEmbedUrl()}" style="width: 100%; height: 515px;" frameborder="0" allowfullscreen></iframe>`   
    }
    
}

export default StrawpollStackElement