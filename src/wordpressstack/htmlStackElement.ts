'use strict';
import { FileTypes } from "./fileTypes";
import StackElement from "./stackElement";

import { v4 as uuid } from 'uuid';
import templateManagerService from "@/service/templateManagerService";

class HTMLStackElement implements StackElement {
    
    fileType:FileTypes;
    html:string;
    id: string;

    constructor(html: string) {
        this.fileType = FileTypes.HTML
        this.html = html
        this.id = uuid()
    }

    getId(): string {
        return this.id
    }

    // html in wordpress
    getHtmlElement(): string {
        const variables = [
            { variableName: "content", variableValue: this.html }
        ]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("html"))
    }

    getPrevisualizedHtmlElement(): string {
        return this.html
    }
    
}

export default HTMLStackElement