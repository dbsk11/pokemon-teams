/*
* User loads page, should see all trainers with current team of pokemons
    * DOMContentLoaded listener
    * get request to /trainers
    * render the trainer info
    * render the pokemons info 

* User hits Add Pokemon and have space, they should get a new pokemon
    * click listener on add button
    * post request to /pokemons - needs trainer_id
    * if enough space, render pokemon - pessimistically
    * if not enough space => ?? 

* User hits Release Pokemon, that specific Pokemon should be released from the team 
    * click listener on release button
    * delete request to /pokemons/:id
    * remove pokemon from the dom optimistically? pessimistically? 

*/
document.addEventListener('DOMContentLoaded', function(e){
    const BASE_URL = "http://localhost:3000"
    const TRAINERS_URL = `${BASE_URL}/trainers`
    const POKEMONS_URL = `${BASE_URL}/pokemons` 

    const getTrainers = () => {
        fetch(TRAINERS_URL)
        .then(response => response.json())
        .then(trainers => {
            renderTrainers(trainers)
        })
    }
    
    const renderTrainers = trainers => {
        trainers.forEach(trainer => {
            renderTrainer(trainer)
        })
    }

    const renderTrainer = trainer => {
        const div = document.createElement('div')
        div.className = 'card'
        div.dataset.id = trainer.id

        div.innerHTML = `
        <p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        `

        const ul = document.createElement('ul')

        trainer.pokemons.forEach(pokemon => {
            const pokemonLi = createPokemonLi(pokemon)
            ul.append(pokemonLi)
        })
        div.append(ul)

        const main = document.querySelector('main')
        main.append(div)
    }

    const createPokemonLi = pokemon => {
        const li = document.createElement('li')
        li.innerHTML = `
        ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
        `
        return li
    }

    document.addEventListener('click', e => {
        if(e.target.textContent === "Add Pokemon"){
            const button = e.target
            const trainerId = e.target.dataset.trainerId

            fetch(POKEMONS_URL, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({trainer_id: trainerId})
            })
            .then(response => response.json())
            .then(pokemon => {
                if(pokemon.error){
                    alert(pokemon.error)
                } else {
                    const pokemonLi = createPokemonLi(pokemon)
                    const ul = button.parentNode.querySelector('ul')
                    ul.append(pokemonLi)
                }
            })
        } else if(e.target.className === "release"){
            const button = e.target
            const id = button.dataset.pokemonId
            const li = button.parentNode
            li.remove()

            fetch( `${POKEMONS_URL}/${id}`, {
                method: "DELETE"
            })

        }
    })

    getTrainers()
})