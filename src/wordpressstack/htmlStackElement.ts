'use strict';
import { FileTypes } from "./fileTypes";
import StackElement from "./stackElement";

import { v4 as uuid } from 'uuid';

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
        return this.html
    }

    getPrevisualizedHtmlElement(): string {
        return this.html
    }
    
}

export default HTMLStackElement