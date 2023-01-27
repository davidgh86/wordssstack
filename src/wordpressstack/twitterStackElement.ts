'use strict';
import { FileTypes } from "./fileTypes";
import StackElement from "./stackElement";

import { v4 as uuid } from 'uuid';

import templateManagerService from "@/service/templateManagerService";

import twitterApi from "@/service/twitterApi";

class TwitterStackElement implements StackElement {
    
    fileType:FileTypes;
    url:string;
    id: string;

    html: string | null = null;

    constructor(url: string) {
        this.fileType = FileTypes.TWITTER
        this.url = url
        this.id = uuid()
        twitterApi.getEmbbededTwitter(this.url).then(rsp => {
            this.html = rsp
        })
    }

    getId(): string {
        return this.id
    }

    getHtmlElement(): string {
        const variables = [
            { variableName: "content", variableValue: this.html }
        ]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTwitterTemplate())
    }

    getPrevisualizedHtmlElement(): string {
        return this.html
    }
    
}

export default TwitterStackElement