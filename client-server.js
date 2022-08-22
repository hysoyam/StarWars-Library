// Данные обо всех 6-ти эпизодах можно получить запросом GET. 
// Результат будет содержать массив объектов с информацией об эпизоде.

export { fetchEpisodes, fetchEpisodeByNumber, fetchGroup }
// название?
async function fetchEpisodes() {

    const res = await fetch(`https://swapi.dev/api/films/`).then(res => res.json().then(res => res.results))
    return res
}

// Подробности одного эпизода можно получить запросом 
// GET https://swapi.dev/api/films/{номер эпизода},
// где номер эпизода - это порядковый номер фильма в порядке его выпуска 
// (обратите внимание, это НЕ свойство episode_id, а именно порядковый номер!).
// IV, V, VI эпизоды имеют номер 1, 2, 3; I, II, III - 4, 5, 6.

async function fetchEpisodeByNumber(number) {

    const res = await fetch(`https://swapi.dev/api/films/${number}`).then(res => res.json())
    return res
}


// Получить планеты можно из API с использованием URL из массива planets в объекте эпизода.
// Получить планеты можно из API с использованием URL из массива species в объекте эпизода.
// Все запросы, которые можно запустить параллельно, нужно отправлять с помощью Promise.all
// и убедиться, что они не обрабатываются последовательно.

async function fetchGroup(links) {

    const arr = []

    for (const link of links) {
        arr.push(fetch(link).then(res => res.json()))
    }

    const arrOfData = await Promise.all(arr)

    return arrOfData
}