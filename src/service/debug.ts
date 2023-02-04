class Debug {


    private static instance: Debug;

    private static debugEnabled = false;

    debugAlert(msg: string) {
        if(Debug.debugEnabled){
            alert(msg)
        }
    }

    enableDebug() {
        Debug.debugEnabled = true
    }

    disableDebug() {
        Debug.debugEnabled = false
    }


    public static getInstance(): Debug {
        if (!Debug.instance) {
            Debug.instance = new Debug()
        }
        
        return Debug.instance
    }
    
   
   
}

export default Debug.getInstance()