'use strict';
interface StackElement {
    getId(): string;
    getHtmlElement(): string
    getPrevisualizedHtmlElement(): string
}

export default StackElement