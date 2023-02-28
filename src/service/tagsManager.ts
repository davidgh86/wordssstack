import { ref } from 'vue';
import { closest, distance, suggested } from './wordDistanceService'

class TagsManager {

    private static instance: TagsManager;

    private static tagsSet: Set<string>
    public tags = ref([])
    private static articleTagsSet: Set<string>
    public articleTags = ref([])

    private splitTagsRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ,\s]+$/

    public static getInstance(): TagsManager {
        if (!TagsManager.instance) {
            TagsManager.instance = new TagsManager()
        }
        
        return TagsManager.instance
    }

    constructor() {
        const tagsAux = localStorage.getItem("tags")
        if (tagsAux) {
            TagsManager.tagsSet = new Set(JSON.parse(tagsAux))
        } else {
            TagsManager.tagsSet = new Set()
        }

        const articleTagsAux = localStorage.getItem("articleTags")
        if (articleTagsAux) {
            TagsManager.articleTagsSet = new Set(JSON.parse(articleTagsAux))
        } else {
            TagsManager.articleTagsSet = new Set()
        }
        this.updateStructure()
    }

    private updateStructure() {
        this.tags.value = Array.from(TagsManager.tagsSet)
        this.articleTags.value = Array.from(TagsManager.articleTagsSet) 
    }

    public addTag(tag: string) {
        const tags = this.getSplittedTags(tag)

        for (const tag of tags) {
            if(!TagsManager.tagsSet.has(tag)){
                TagsManager.tagsSet.add(tag)   
            }
        }
        
        this.updateStructure()
        localStorage.setItem("tags", JSON.stringify(this.tags.value))
        
    }

    public addArticleTag(tag: string) {
        const tags = this.getSplittedTags(tag)

        for (const tag of tags) {
            if(!TagsManager.articleTagsSet.has(tag)){
                TagsManager.articleTagsSet.add(tag)   
            }
        }
        
        this.updateStructure()
        localStorage.setItem("articleTags", JSON.stringify(this.articleTags.value))
        
    }

    public getSplittedTags(tagsString: string):string[] {
        
        if (!tagsString.match(this.splitTagsRegex)) {
            throw new Error("Solo se permiten letras y espacios o comas para separar tags")
        }

        return tagsString.split(/[\s,]+/)
            .filter(w => w && w.length>0)
            .map(w => w.toLowerCase())
    }

    public addSingleTag(tag: string) {
        if(!TagsManager.tagsSet.has(tag)){
            TagsManager.tagsSet.add(tag)
            this.updateStructure()
            localStorage.setItem("tags", JSON.stringify(this.tags.value))
            return true
        }
        return false
    }

    public getTags():string[] {
        return this.tags.value
    }

    public getArticleTags():string[] {
        return this.articleTags.value
    }

    public removeTag(tag: string) {
        TagsManager.tagsSet.delete(tag)
        this.updateStructure()
        localStorage.setItem("tags", JSON.stringify(this.tags.value))
    }

    public updateArticleTags(tags: string[]) {
        TagsManager.articleTagsSet = new Set(tags)
        this.updateStructure()
        localStorage.setItem("articleTags", JSON.stringify(this.tags.value))
    }

    public clearArticleTags() {
        TagsManager.articleTagsSet = new Set()
        this.updateStructure()
        localStorage.setItem("articleTags", JSON.stringify(this.tags.value))
    }

    public getSuggested(str: string):string[] {
        const splittedTags = this.getSplittedTags(str)
        Array.from(splittedTags.flatMap(s => suggested(s, this.tags.value, 3)))
        return suggested(str, this.tags.value, 3)
    }

    public tagsInLibrary(str: string):boolean {
        const splittedTags = this.getSplittedTags(str)
        for (const splittedTag of splittedTags) {
            if (!TagsManager.tagsSet.has(splittedTag)) {
                return false;
            }
        }
        return true;
    }

}

export default TagsManager.getInstance()