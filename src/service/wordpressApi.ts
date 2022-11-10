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

    constructor() {
        this.init()
    }

    public init() {

        localStorage.getItem("host")
        localStorage.getItem("user")
        localStorage.getItem("password")

        this.user = localStorage.getItem("user");
        this.password = localStorage.getItem("password");
        this.host = localStorage.getItem("host");
        
        if (this.user && this.password) {
            this.basicToken = btoa(`${this.user}:${this.password}`);
        }

        if (localStorage.getItem("host") && localStorage.getItem("user") && localStorage.getItem("password")) {
            this.isInitialized = true
        }
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

            if (!this.isInitialized) {
                reject(new Error("Client not initialized"))
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Disposition", "attachment; filename="+filename);
            myHeaders.append("Authorization", "Basic "+this.basicToken);
            myHeaders.append("Content-Type", mimetype);

            const file = this.dataURLtoFile(data, filename);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: file
            };

            fetch(this.host+'/wp-json/wp/v2/media', requestOptions)
            .then(response => {
                resolve(response.json())
            })
            //.then(result => console.log(result))
            .catch(error => {
                alert("KO")
                reject(error)
            });
        });
    }

    public uploadPost(title: string, content: string) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error("Client not initialized"))
                return;
            }
            
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic "+this.basicToken);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "title": title,
                "status": "publish",
                "post_content": content
            });

            const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
            };

            fetch(this.host + "/wp-json/wp/v2/posts", requestOptions)
            .then(response => {
                resolve(response.json())
            })
            .catch(error => {
                alert("KO saving post")
                reject(error)
            });
        });
        
    } 


}

export default WordpressApi.getInstance()