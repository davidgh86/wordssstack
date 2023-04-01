'use strict';

import StackElement from "./stackElement";

import { v4 as uuid } from 'uuid';

import templateManagerService from "@/service/templateManagerService";
import { FileTypes } from "@/constants/typesConstantsConfig";

class YoutubeStackElement implements StackElement {
    
    fileType:FileTypes;
    url:string;
    id: string;

    constructor(url: string) {
        this.fileType = FileTypes.YOUTUBE
        this.url = url
        this.id = uuid()
    }

    getId(): string {
        return this.id
    }

    extractUrls(text) {
        // Patrón de expresión regular para buscar URLs
        const pattern = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
      
        // Busca todas las coincidencias del patrón en el texto
        const urls = text.match(pattern);
      
        if (urls === null || urls.length !== 1) {
          //console.log(JSON.stringify(urls))
          throw new Error('El texto debe contener exactamente una URL');
        }
      
        return urls[0];
      }

    youTubeGetID(url){
        const youtubeIdRegex = /^[A-Za-z0-9_-]{11}$/
        if (youtubeIdRegex.test(url)){
        return url
        }
        
        const extractedUrl = this.extractUrls(url)
        const urlObject = new URL(extractedUrl)
        const searchParams = new URLSearchParams(urlObject.search);
        const videoId = searchParams.get('v');
        if (videoId != null) {
            return videoId
        } else {
        
        const parsedPaths = urlObject.pathname.split('/')//.filter(Boolean);
        for (const pathItem of parsedPaths) {
            if (youtubeIdRegex.test(pathItem)) {
            return pathItem
            }
        }
        return null
        //const youtubeIdRegex = /^[A-Za-z0-9_-]{11}$/
        }
    }
        /*
* Tested URLs:
console.log(youTubeGetID('http://youtube.googleapis.com/v/4e_kz79tjb8?version=3'));
console.log(youTubeGetID('https://www.youtube.com/watch?feature=g-vrec&v=Y1xs_xPb46M'));
console.log(youTubeGetID('http://www.youtube.com/watch?feature=player_embedded&v=Ab25nviakcw#'));
console.log(youTubeGetID('http://youtu.be/Ab25nviakcw'));
console.log(youTubeGetID('http://www.youtube.com/watch?v=Ab25nviakcw'));
console.log(youTubeGetID('<iframe width="420" height="315" src="http://www.youtube.com/embed/Ab25nviakcw" frameborder="0" allowfullscreen></iframe>'));
console.log(youTubeGetID('<object width="420" height="315"><param name="movie" value="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="420" height="315" allowscriptaccess="always" allowfullscreen="true"></embed></object>'));
console.log(youTubeGetID('http://i1.ytimg.com/vi/Ab25nviakcw/default.jpg'));
console.log(youTubeGetID('https://www.youtube.com/watch?v=BGL22PTIOAM&feature=g-all-xit'));
console.log(youTubeGetID('BGL22PTIOAM'));
*/


    getYoutubeVideoId() {
        return this.youTubeGetID(this.url)
    }

    getHtmlElement(): string {
        const variables = [{ variableName: "youtube_video_id", variableValue: this.getYoutubeVideoId() }]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("youtube"))
    }

    getPrevisualizedHtmlElement(): string {
        alert("Video id" + this.getYoutubeVideoId())
        return `<div style="width: 100%;height: 100%;overflow: hidden;">
            <iframe src="https://www.youtube.com/embed/${this.getYoutubeVideoId()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 100%;height: 100%;object-fit: contain;display: inline-block;" allowfullscreen></iframe>
        </div>`   
    }
    
}

export default YoutubeStackElement