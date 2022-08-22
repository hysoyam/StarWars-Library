export { showEpisodesPage }

import { createPage } from './main.js'
import { fetchEpisodes } from './client-server.js'

function showEpisodesPage() {
  const episodes = fetchEpisodes()
  episodes.then(episodes => document.body.append(createEpisodesPage(episodes)))
}

function createEpisodesPage(episodes) {

  const header = document.createElement('h1')
  header.classList.add('mt-5','mb-2')

  header.innerHTML = 'Star Wars Episodes'

  const list = document.createElement('ul')
  list.classList.add('list-unstyled')

  for (const [index, episode] of episodes.entries()) {

    const episodeNumber = index + 1
    const episodeTitle = episode.title

    const li = document.createElement('li')
    li.classList.add('link-primary')

    const url = new URL(document.URL)
    const params = new URLSearchParams(url.search);

    const a = document.createElement('a')
    a.innerHTML = `${episodeNumber} : ${episodeTitle}`
    a.href = `?episode_id=${episodeNumber}`
    a.addEventListener('click', e => {
      e.preventDefault()

      document.URL.search
      params.set('episode_id', episodeNumber)
      history.pushState(null, '', `?${params}`)

      createPage(episodeNumber)
    })

    li.append(a)

    list.append(li)
  }

  const page = document.createElement('main')
  page.classList.add('container')
  page.append(header, list)
  return page
}