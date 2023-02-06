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

    youTubeGetID(url){
        let ID = '';
        url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if(url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_-]/i);
            ID = ID[0];
        } else {
            ID = url;
        }
        return ID;
        /*
* Tested URLs:
var url = 'http://youtube.googleapis.com/v/4e_kz79tjb8?version=3';
url = 'https://www.youtube.com/watch?feature=g-vrec&v=Y1xs_xPb46M';
url = 'http://www.youtube.com/watch?feature=player_embedded&v=Ab25nviakcw#';
url = 'http://youtu.be/Ab25nviakcw';
url = 'http://www.youtube.com/watch?v=Ab25nviakcw';
url = '<iframe width="420" height="315" src="http://www.youtube.com/embed/Ab25nviakcw" frameborder="0" allowfullscreen></iframe>';
url = '<object width="420" height="315"><param name="movie" value="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="420" height="315" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
url = 'http://i1.ytimg.com/vi/Ab25nviakcw/default.jpg';
url = 'https://www.youtube.com/watch?v=BGL22PTIOAM&feature=g-all-xit';
url = 'BGL22PTIOAM';
*/
    }

    getYoutubeVideoId() {
        return this.youTubeGetID(this.url)
    }

    getHtmlElement(): string {
        const variables = [{ variableName: "youtube_video_id", variableValue: this.getYoutubeVideoId() }]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("youtube"))
    }

    getPrevisualizedHtmlElement(): string {
        return `<div style="width: 100%;height: 100%;overflow: hidden;">
            <iframe src="https://www.youtube.com/embed/${this.getYoutubeVideoId()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 100%;height: 100%;object-fit: contain;display: inline-block;" allowfullscreen></iframe>
        </div>`   
    }
    
}

export default YoutubeStackElement