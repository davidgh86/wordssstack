'use strict';
import { FileTypes } from "./fileTypes";
import StackElement from "./stackElement";

import { v4 as uuid } from 'uuid';

class HTMLStackElement implements StackElement {
    
    fileType:FileTypes = FileTypes.HTML;
    html:string;
    id: string

    constructor(html: string) {
        this.html = html
        this.id = uuid()
    }

    getId(): string {
        return this.id
    }

    getHtmlElement(): string {
        return this.html
    }

    getPrevisualizedHtmlElement(): string {
        return this.html
    }

    addLink

    
}

export default HTMLStackElement