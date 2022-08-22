export { showEpisodePage }

import { createPage } from './main.js'
import { fetchEpisodeByNumber, fetchGroup } from './client-server.js'

// Обьект настройки вывода необходимых свойств
const requaredPropsObj = {
    planets: {
        header: 'Planets',
        name: 'planets',

        properties: [{
            header: 'Name',
            value: 'name'
        },
        {
            header: 'Terrain',
            value: 'terrain'
        },
        {
            header: 'Population',
            value: 'population'
        },]
    },
    species: {
        header: 'Species',
        name: 'species',

        properties: [{
            header: 'Name',
            value: 'name'
        },
        {
            header: 'Language',
            value: 'language'
        },
        {
            header: 'Average lifespan',
            value: 'average_lifespan'
        }]
    },
    starships: {
        header: 'Starships',
        name: 'starships',

        properties: [{
            header: 'Name',
            value: 'name'
        },
        {
            header: 'Crew',
            value: 'crew'
        },
        {
            header: 'Cost in credits',
            value: 'cost_in_credits'
        },
        {
            header: 'Manufacturer',
            value: 'manufacturer'
        }]
    },
}

function showEpisodePage(id) {

    // Создание массива нужных свойств
    const propsNames = []
    for (const propsName in requaredPropsObj) {
        propsNames.push(propsName)
    }

    // запрос на страницу фильма и обьединение его с промисоми от возврата данных о необходимых вещах о фильма
    fetchEpisodeByNumber(id).then((episode) => {

        const allMovieData = Promise.all(propsNames.map(propsName => {
            return fetchGroup(episode[propsName])
        }))
            .then(episodeData => {

                const allProps = episodeData.map((episodeData, i) => { return { name: propsNames[i], value: episodeData } })

                return [episode, allProps]
            })
        return allMovieData

        // при разрешении всех промисов отрисовка страницы с данными
    }).then(([a, b]) => document.body.append(createEpisodePage(a, b)))
}

function createEpisodePage(episode, movieObjects) {

    const episodeTitle = episode.title
    const episodeId = episode.episode_id
    const episodeDescription = episode.opening_crawl

    const page = document.createElement('main')
    page.classList.add('container')

    const header = document.createElement('h1')
    header.innerHTML = `${episodeTitle} - ${episodeId}`

    const toMainBtn = document.createElement('a')
    toMainBtn.innerHTML = 'Back to episodes'
    toMainBtn.href = '/'
    toMainBtn.addEventListener('click', e => {
        e.preventDefault()
        history.pushState(null, '', toMainBtn.href)

        createPage()
    })

    const headerContainer = document.createElement('div')
    headerContainer.classList.add('d-flex', 'justify-content-between', 'mt-5', 'mb-2')
    headerContainer.append(header)
    headerContainer.append(toMainBtn)

    page.append(headerContainer)

    const description = document.createElement('p')
    description.innerHTML = `${episodeDescription}`
    page.append(description)

    const PropsBlock = document.createElement('div')

    const PropsBlocks = createMoviePropsBlocks(movieObjects)

    PropsBlocks.forEach(block => PropsBlock.append(block))
    page.append(PropsBlock)
    return page
}

function createMoviePropsBlocks(MovieProps) {
    const arr = []
    for (const MovieProp of MovieProps) {
        arr.push(createListBlock(MovieProp))
    }
    return arr
}

function createListBlock(movieProp) {

    const currentRequiredProp = requaredPropsObj[movieProp.name]
    const props = movieProp.value

    const block = document.createElement('div')

    const header = document.createElement('h2')
    header.classList.add('mt-3')
    header.innerText = `${currentRequiredProp.header}`
    block.append(header)

    const table = document.createElement('table')
    table.classList.add('table')
    
    const tHead = document.createElement('thead')
    const tBody = document.createElement('tbody')    
    table.append(tHead)
    table.append(tBody)

    const headerRow = document.createElement('tr')
    tHead.append(headerRow)

    // Создание заголовков таблиц
    for (const prop of currentRequiredProp.properties) {
        headerRow.innerHTML += `<th>${prop.header}</th> `
    }

    // Создание строк таблиц
    for (const prop of props) {
        const propItem = document.createElement('tr')
        for (const property of currentRequiredProp.properties) {
            propItem.innerHTML += `<td>${prop[property.value]}</td> `
        }
        tBody.append(propItem)
    }

    block.append(table)

    return block
}