import debug from './debug';

class TagsManager {

    private static instance: TagsManager;

    private static tags: Set<string>
    private static articleTags: Set<string>

    public static getInstance(): TagsManager {
        if (!TagsManager.instance) {
            TagsManager.instance = new TagsManager()
        }
        
        return TagsManager.instance
    }

    constructor() {
        const tagsAux = localStorage.getItem("tags")
        if (tagsAux) {
            TagsManager.tags = new Set(JSON.parse(tagsAux))
        } else {
            TagsManager.tags = new Set()
        }

        const articleTagsAux = localStorage.getItem("articleTags")
        if (articleTagsAux) {
            TagsManager.articleTags = new Set(JSON.parse(articleTagsAux))
        } else {
            TagsManager.articleTags = new Set()
        }
    }

    public addTag(tag: string) {
        TagsManager.tags.add(tag)
        localStorage.setItem("tags", JSON.stringify(Array.from(TagsManager.tags)))
    }

    public getTags():string[] {
        return Array.from(TagsManager.tags)
    }

    public removeTag(tag: string) {
        //TagsManager.tags = TagsManager.tags.filter(t => t!== tag)
        TagsManager.articleTags.delete(tag)
        localStorage.setItem("tags", JSON.stringify(Array.from(TagsManager.tags)))
    }

    public updateArticleTags(tags: string[]) {
        TagsManager.articleTags = new Set(tags)
        localStorage.setItem("articleTags", JSON.stringify(Array.from(TagsManager.tags)))
    }

    public clearArticleTags() {
        TagsManager.articleTags = new Set()
        localStorage.setItem("articleTags", JSON.stringify(Array.from(TagsManager.tags)))
    }

}

export default TagsManager.getInstance()