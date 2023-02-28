import { distance, closest } from 'fastest-levenshtein'

const suggested = (str: string, arr: readonly string[], level: number):string[] => {
    return arr.map(s => {return {str: s, dist: distance(s, str)}})
        .filter(obj => obj.dist >= level)
        .sort((a, b) => a.dist-b.dist)
        .map(obj => obj.str)
}

export { distance, closest, suggested }