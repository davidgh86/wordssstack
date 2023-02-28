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
        
        if (!tag.match(this.splitTagsRegex)) {
            throw new Error("Solo se permiten letras y espacios o comas para separar tags")
        }
        const tags = tag.split(/[\s,]+/)
            .filter(w => w && w.length>0)
            .map(w => w.toLowerCase())

        for (const tag of tags) {
            if(!TagsManager.tagsSet.has(tag)){
                TagsManager.tagsSet.add(tag)   
            }
        }
        
        this.updateStructure()
        localStorage.setItem("tags", JSON.stringify(this.tags.value))
        
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
        return suggested(str, this.tags.value, 3)
    }

}

export default TagsManager.getInstance()