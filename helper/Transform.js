export const shorten = (text, length) => text.length <= length ? text : text.substr(0, length) + "..."

export const createYoutubePoster = function(link) {
    let videoId = new URL(link).searchParams.get('v')
    if(videoId == null) return "" 
    else {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
}