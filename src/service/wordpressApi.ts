import axios from "axios";

class WordpressApi {

    private static instance: WordpressApi;

    private user;

    private password;

    private host;

    private basicToken;

    private isInitialized = false

    public static getInstance(): WordpressApi {
        if (!WordpressApi.instance) {
            WordpressApi.instance = new WordpressApi()
        }
        
        return WordpressApi.instance
    }

    public init(user: string, password: string, host: string) {
        this.user = user;
        this.password = password;
        this.host = host;
        this.basicToken = btoa(`${this.user}:${this.password}`);
        this.isInitialized = true
    }

    public uploadFile(mimetype: string, filename: string, data: string) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error("Client not initialized"))
                return;
            }
            const config = {
            method: 'post',
            url: this.host+'/wp-json/wp/v2/media',
            headers: { 
                'Content-Disposition': 'attachment; filename='+filename, 
                'Authorization': 'Basic '+this.basicToken, 
                'Content-Type': mimetype
            },
            data : data
            };

            axios(config)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    public uploadPost(title: string, content: string) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error("Client not initialized"))
                return;
            }
            const data = JSON.stringify({
                "title": title,
                "status": "publish",
                "post_content": content
              });
              
              const config = {
                method: 'post',
                url: this.host+'/wp-json/wp/v2/posts',
                headers: { 
                  'Authorization': `Basic ${this.basicToken}`, 
                  'Content-Type': 'application/json'
                },
                data : data
              };
              
              axios(config)
              .then(function (response) {
                resolve(response.data);
              })
              .catch(function (error) {
                reject(error);
              });
        });
        
    } 


}

export default WordpressApi.getInstance()