import { v4 as uuid } from 'uuid'
import { TypesConstantsConfig, FileTypes } from "@/constants/typesConstantsConfig";

class ElementTemplateParser {
    
    private static WP_VIDEO_REGEX = /\[\s*video(?<attributes>\s+.*)\s*\]\s*\[\/\s*video\s*\]/gi;
    private static WP_AUDIO_REGEX = /\[\s*audio(?<attributes>\s+.*)\s*\]\s*\[\/\s*audio\s*\]/gi;
    private static WP_ELEMENT = new RegExp(/\[\s*video\s+.*\s*\]\s*\[\/\s*video\s*\]/gi.source + "|" + /\[\s*audio\s+.*\s*\]\s*\[\/\s*audio\s*\]/gi.source, 'gi')
    private static WP_ATTRIBUTE_REGEX = /(\w+)\s*=\s*(['"])(.*?)\2/g;
    private static instance: ElementTemplateParser;

    public static getInstance(): ElementTemplateParser {
        if (!ElementTemplateParser.instance) {
            ElementTemplateParser.instance = new ElementTemplateParser()
        }
        
        return ElementTemplateParser.instance
    }

    public getTemplates(html: string): any {
        const parentElement = document.createElement("div")
        parentElement.innerHTML = html
        const parentId = uuid()
        parentElement.id = parentId
        const imageTemplates = this.getImageTemplates(parentElement)

        const videoTemplates = this.getVideoTemplates(parentElement)
        const audioTemplates = this.getAudioTemplates(parentElement)

        const youtubeTemplates = this.getYoutubeTemplates(parentElement)
        const strawpollTemplates = this.getStrawpollTemplates(parentElement)

        const twitterTemplates = this.getTwitterTemplates(parentElement)

        const htmlTemplates = this.getHtmlTemplates(parentElement)

        return {
            image: imageTemplates,
            video: videoTemplates,
            audio: audioTemplates,
            youtube: youtubeTemplates,
            strawpoll: strawpollTemplates,
            twitter: twitterTemplates,
            html: htmlTemplates
        }
    }

    private getHtmlTemplates(parentElement) {
        const nodes = parentElement.childNodes;

        const result = []
        let bufferResult = []

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (!this.containAny(node as HTMLElement, undefined)) {
                bufferResult.push(node.outerHTML)
            } else {
                result.push(bufferResult.join("\n"))
                bufferResult = []
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            console.log(node.nodeValue)
            bufferResult = [...bufferResult, ...node.nodeValue.split(ElementTemplateParser.WP_ELEMENT)]
          } 
        }

        return [...result, ...bufferResult]
    }

    private getTwitterTemplates(parentElement) {
        const parentId = parentElement.id

        //const elements = Array.from(auxParent.querySelectorAll('*')).filter(el => el.innerHTML.includes(element));
        const twitterElements = Array.from(parentElement.querySelectorAll(".twitter-tweet")).filter(el => {
            const element = el as HTMLElement
            const stringElement = element.nextElementSibling
            return stringElement.getAttribute("src") && stringElement.getAttribute("src") === "https://platform.twitter.com/widgets.js"
        })

        const result = []
        for (const twitterElement of twitterElements) {
            let element = twitterElement as HTMLElement
            const greaterStrawpollElement = this.getGreater(element, parentId, "twitter")
            element = greaterStrawpollElement.querySelector(".twitter-tweet")
            const textPlaceholder = document.createTextNode("{content}");
            
            const elementToRemove = element.nextElementSibling;
            const parentElementToRemove = elementToRemove.parentNode;
            
            parentElementToRemove.removeChild(elementToRemove)
            element.replaceWith(textPlaceholder);
            result.push(greaterStrawpollElement.outerHTML)
        }
        return result
    }

    private getStrawpollTemplates(parentElement) {
        const parentId = parentElement.id

        //const elements = Array.from(auxParent.querySelectorAll('*')).filter(el => el.innerHTML.includes(element));
        const strawpollElements = Array.from(parentElement.querySelectorAll("iframe")).filter(el => {
            const element = el as HTMLElement
            return element.getAttribute("src") && element.getAttribute("src").includes("https://strawpoll.com/embed/")
        })

        const result = []
        for (const strawpollElement of strawpollElements) {
            const element = strawpollElement as HTMLElement
            const src = element.getAttribute("src")
            const greaterStrawpollElement = this.getGreater(element, parentId, "strawpoll")
            const elementString = greaterStrawpollElement.outerHTML;
            result.push(elementString.replace(src, "{strawpoll_embed_url}"))
        }
        return result
    }

    private getYoutubeTemplates(parentElement) {
        const parentId = parentElement.id

        //const elements = Array.from(auxParent.querySelectorAll('*')).filter(el => el.innerHTML.includes(element));
        const youtubeElements = Array.from(parentElement.querySelectorAll("iframe")).filter(el => {
            const element = el as HTMLElement
            return element.getAttribute("src") && element.getAttribute("src").includes("https://www.youtube.com/embed/")
        })

        const result = []
        for (const ytElement of youtubeElements) {
            const element = ytElement as HTMLElement
            const src = element.getAttribute("src")
            const greaterYT = this.getGreater(element, parentId, "youtube")
            const elementString = greaterYT.outerHTML;
            result.push(elementString.replace(src, "https://www.youtube.com/embed/{youtube_video_id}"))
        }
        return result
    }

    private getImageTemplates(parentElement) {
        const parentId = parentElement.id
        const imageElements = parentElement.querySelectorAll("img")

        const result = []
        for (const imgElement of imageElements) {
            const greaterImg = this.getGreater(imgElement, parentId, "image")
            const src = imgElement.getAttribute("src")
            const elementString = greaterImg.outerHTML;
            result.push(elementString.replace(src, "{src_image}"))
        }
        return result
    }

    private getVideoTemplates(parentElement) {
        const parentId = parentElement.id
        const videoElements = parentElement.querySelectorAll("video")

        const result = []
        for (const videoElement of videoElements) {
            const greaterImg = this.getGreater(videoElement, parentId, "video")
            const videoSource = videoElement.querySelector("source")
            const src = videoSource.getAttribute("src")
            const type = videoSource.getAttribute("type")
            let elementString = greaterImg.outerHTML;
            elementString = elementString.replace(src, "{src_video}")
            if (type) {
                elementString = elementString.replace(type, "video/{video_extension}")
            }
            result.push(elementString)
        }

        const allVideoWpElements = this.getAllVideoWPElements(parentElement)
        for (const videoWpElement of allVideoWpElements) {
            const greaterVideo = this.getGreaterWP(videoWpElement, parentElement, "video")

            const attributes = this.getWPElementAttributes(greaterVideo, ElementTemplateParser.WP_VIDEO_REGEX)
            const replacement = this.getWPReplacement(attributes, "video")
            result.push(replacement)
        }

        return result
    }

    private getAudioTemplates(parentElement) {
        const parentId = parentElement.id
        const audioElements = parentElement.querySelectorAll("audio")

        const result = []
        for (const audioElement of audioElements) {
            const greaterImg = this.getGreater(audioElement, parentId, "audio")
            const audioSource = audioElement.querySelector("source")
            const src = audioSource.getAttribute("src")
            //const type = audioSource.getAttribute("type")
            let elementString = greaterImg.outerHTML;
            elementString = elementString.replace(src, "{src_audio}")
            // if (type) {
            //     elementString = elementString.replace(type, "video/{video_extension}")
            // }
            result.push(elementString)
        }

        const allAudioWpElements = this.getAllAudioWPElements(parentElement)
        for (const audioWpElement of allAudioWpElements) {
            const greaterAudio = this.getGreaterWP(audioWpElement, parentElement, "audio")

            const attributes = this.getWPElementAttributes(greaterAudio, ElementTemplateParser.WP_AUDIO_REGEX)
            const replacement = this.getWPReplacement(attributes, "audio")
            result.push(replacement)
        }

        return result
    }

    private getWPReplacement(attr, type) {
        const keys = Object.keys(attr);

        const fileType = type=="video"?FileTypes.VIDEO:FileTypes.AUDIO

        const attrs = []

        // Iterate over the property names using a for...of loop
        for (const key of keys) {
            if (TypesConstantsConfig.extensions.has(key) && TypesConstantsConfig.extensions.get(key) == fileType) {
                attrs.push(`{${type}_extension}="{src_${type}}"`)
            } else {
                attrs.push(`${key}="${attr[key]}"`)
            }
        }

        return `[${type} ${attrs.join(" ")}][/${type}]`
    }

    private attrsToDict(attrs: string) {

        // Create an empty object to store the attribute-value pairs
        const dict = {};

        // Iterate over each attribute-value pair in the string
        let match;
        while ((match = ElementTemplateParser.WP_ATTRIBUTE_REGEX.exec(attrs)) !== null) {
            // Extract the attribute name and its value from the match result
            const attribute = match[1];
            const value = match[3];

            // Add the attribute-value pair to the dictionary object
            dict[attribute] = value;
        }
        return dict;
    }

    private getWPElementAttributes(wpElement:string, regex) {
        const match = regex.exec(wpElement)
        const attributes = match.groups?.attributes.trim()
        regex.lastIndex=0
        const attributesSplitted = this.attrsToDict(attributes)
        return attributesSplitted;
    }

    private getAllVideoWPElements(parentElement: HTMLElement) {
        const result = []

        const parentElementString = parentElement.outerHTML

        const matches = parentElementString.matchAll(ElementTemplateParser.WP_VIDEO_REGEX);

        for (const match of matches) {
            result.push(match[0]);
        }

        return result;
    }

    private getAllAudioWPElements(parentElement: HTMLElement) {
        const result = []

        const parentElementString = parentElement.outerHTML

        const matches = parentElementString.matchAll(ElementTemplateParser.WP_AUDIO_REGEX);

        for (const match of matches) {
            result.push(match[0]);
        }

        return result;
    }


    private getGreater(imgElement: HTMLElement, parentId: any, type:string) {
        let parent = imgElement.parentNode as HTMLElement
        let current = imgElement
        while (parent.getAttribute("id") !== parentId) {
            if (this.containAny(parent, type)){
                break;
            }
            current = parent
            parent = current.parentNode as HTMLElement
        }
        
        return current;
    }

    private getGreaterWP(element: string, parentElement: HTMLElement, type:string) {

        const auxParent = document.createElement("div")
        auxParent.appendChild(parentElement)
        
        const elements = Array.from(auxParent.querySelectorAll('*')).filter(el => el.innerHTML.includes(element));
        let parent = elements.reduce((a, b) => a.getBoundingClientRect().width < b.getBoundingClientRect().width ? a : b) as HTMLElement;
        let current: HTMLElement | string = element

        const parentId = parentElement.id
        
        while (parent.getAttribute("id") !== parentId) {
            if (this.containAny(parent, type)){
                break;
            }
            current = parent
            parent = current.parentNode as HTMLElement
        }

        if (current instanceof HTMLElement){
            current = current.outerHTML;
        }
        
        return current;
    }

    private countVideoWPElements(str: string) {
        const matches = str.match(ElementTemplateParser.WP_VIDEO_REGEX)
        return matches ? matches.length : 0;
    }

    private countAudioWPElements(str: string) {
        const matches = str.match(ElementTemplateParser.WP_AUDIO_REGEX)
        return matches ? matches.length : 0;
    }

    private containsVideo(element, admitOneException){
        const strElement = element.outerHTML;
        const count = this.countVideoWPElements(strElement)

        const allVideos = element.querySelectorAll("video")

        const countVideoTags = allVideos ? allVideos.length : 0;

        let result = count + countVideoTags;

        if (admitOneException){
            result -= 1;
        }

        return result > 0
    }

    private containsAudio(element, admitOneException){
        const strElement = element.outerHTML;
        const count = this.countAudioWPElements(strElement)

        const allVideos = element.querySelectorAll("audio")

        const countVideoTags = allVideos ? allVideos.length : 0;

        let result = count + countVideoTags;

        if (admitOneException){
            result -= 1;
        }

        return result > 0
    }

    private containsImage(element, admitOneException){
        const allImages = element.querySelectorAll("img")

        let result = allImages ? allImages.length : 0;

        if (admitOneException){
            result -= 1;
        }

        return result > 0
    }

    private containsYoutube(element, admitOneException) {
        const allYoutubeVideos = Array.from(element.querySelectorAll("iframe")).filter(el => {
            const elem = el as HTMLElement
            return elem.getAttribute("src") && elem.getAttribute("src").toLowerCase().includes("www.youtube.com")
        })

        let result = allYoutubeVideos ? allYoutubeVideos.length : 0;

        if (admitOneException){
            result -= 1;
        }

        return result > 0
    }

    private containsStrawpoll(element, admitOneException) {

        const allYoutubeVideos = Array.from(element.querySelectorAll("iframe")).filter(el => {
            const elem = el as HTMLElement
            return elem.getAttribute("src") && elem.getAttribute("src").toLowerCase().includes("strawpoll.com")
        })


        let result = allYoutubeVideos ? allYoutubeVideos.length : 0;

        if (admitOneException){
            result -= 1;
        }

        return result > 0
    }

    private containsTwitter(element, admitOneException) {
        const allTweets = element.querySelectorAll(".twitter-tweet")

        let result = allTweets ? allTweets.length : 0;

        if (admitOneException){
            result -= 1;
        }

        return result > 0
    }

    private containAny(element, exceptionType) {
        let exceptionVideo = false;
        let exceptionImage = false;
        let exceptionAudio = false;
        let exceptionYoutube = false;
        let exceptionTwitter = false;
        let exceptionStrawpoll = false;

        if (exceptionType) {
            switch (exceptionType) {
                case "video":
                    exceptionVideo = true;
                    break;
                case "image":
                    exceptionImage = true;
                    break;
                case "audio":
                    exceptionAudio = true;
                    break;
                case "youtube":
                    exceptionYoutube = true;
                    break;
                case "twitter":
                    exceptionTwitter = true;
                    break;
                case "strawpoll":
                    exceptionStrawpoll = true;
                    break;
                default:
                    break;
            }
        }

        return this.containsAudio(element, exceptionAudio) || 
                this.containsVideo(element, exceptionVideo) ||
                this.containsImage(element, exceptionImage) ||
                this.containsYoutube(element, exceptionYoutube) ||
                this.containsTwitter(element, exceptionTwitter) ||
                this.containsStrawpoll(element, exceptionStrawpoll);
    }

}

export default ElementTemplateParser.getInstance()