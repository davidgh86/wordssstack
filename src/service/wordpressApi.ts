import debug from './debug';

import { HTTP } from '@ionic-native/http';

class WordpressApi {

    private static instance: WordpressApi;

    private getBasicToken() {
        if (!this.isInitialized()) {
            throw new Error("Could not get credentials, client not initialized")
        } else {
            return btoa(`${localStorage.getItem("user")}:${localStorage.getItem("password")}`)
        }
    }

    public isInitialized(){
        return localStorage.getItem("host") && localStorage.getItem("user") && localStorage.getItem("password")
    }

    public static getInstance(): WordpressApi {
        if (!WordpressApi.instance) {
            WordpressApi.instance = new WordpressApi()
        }
        
        return WordpressApi.instance
    }

    public async getPaginatedPosts(perPage:number, page: number): Promise<any> {

        const headers = {
            "Authorization": "Basic "+this.getBasicToken(),
            'Content-Type': 'application/json'
        }

        const response = await HTTP.sendRequest(`${localStorage.getItem("host")}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}`, {
            method: "get",
            headers: headers
        })

        return JSON.parse(response.data)
    }

    public async getPostById(id: number): Promise<any> {

        const headers = {
            "Authorization": "Basic "+this.getBasicToken(),
            'Content-Type': 'application/json'
        }

        const response = await HTTP.sendRequest(`${localStorage.getItem("host")}/wp-json/wp/v2/posts/${id}`, {
            method: "get",
            headers: headers
        })

        return JSON.parse(response.data)
    }

    private dataURLtoFile(dataurl, filename) {
 
        const arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]);
        
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    public uploadFile(mimetype: string, filename: string, data: any) {
        return new Promise((resolve, reject) => {

            if (!this.isInitialized()) {
                reject(new Error("Client not initialized"))
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Disposition", "attachment; filename="+filename);
            myHeaders.append("Authorization", "Basic "+this.getBasicToken());
            myHeaders.append("Content-Type", mimetype);

            const file = this.dataURLtoFile(data, filename);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: file
            };

            fetch(localStorage.getItem("host")+'/wp-json/wp/v2/media', requestOptions)
            .then(response => {
                resolve(response.json())
            })
            .catch(error => {
                reject(error)
            });
        });
    }

    public uploadPost(title: string, content: string) {
        return new Promise((resolve, reject) => {

            if (!this.isInitialized()) {
                reject(new Error("Client not initialized"))
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic "+this.getBasicToken());
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "title": title,
                "status": "publish",
                "content": content
            });

            const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
            };

            fetch(localStorage.getItem("host") + "/wp-json/wp/v2/posts", requestOptions)
            .then(response => {
                resolve(response.json())
            })
            .catch(error => {
                debug.debugAlert("KO saving post")
                reject(error)
            });
        });   
    }

    public async me() {
        const headers = {
            "Authorization": "Basic "+this.getBasicToken(),
            'Content-Type': 'application/json'
        }

        const response = await HTTP.sendRequest(`${localStorage.getItem("host")}/wp-json/wp/v2/users/me`, {
            method: "get",
            headers: headers
        })

        return JSON.parse(response.data)
    }


}

export default WordpressApi.getInstance()