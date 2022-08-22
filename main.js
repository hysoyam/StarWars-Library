export { createPage }

async function createPage(id = null) {
    document.body.innerHTML = ''
    id ? import("./episode-page.js").then((mod) => mod.showEpisodePage(id)) : import("./episodes-page.js").then((mod) => mod.showEpisodesPage())
}

function checkUrl() {

    const url = new URL(document.URL)
    const GETparams = url.searchParams

    GETparams && GETparams.get('episode_id') && createPage(GETparams.get('episode_id')) || createPage()
}

// start
window.addEventListener('popstate', checkUrl)
checkUrl()