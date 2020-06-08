const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", function(e){
    const baseUrl = "http://localhost:3000/trainers"
    const mainTag = document.querySelector('main')
    
    fetch(baseUrl)
    .then(response => response.json())
    .then(trainers => {
        trainers.forEach(trainers => renderTrainers(trainers))    
    })
    
    function renderTrainers(trainer){
        const trainerDiv = document.createElement('div')
        trainerDiv.className = 'card'
        trainerDiv.dataset.id = trainer.id
        trainerDiv.innerHTML = `
        <p>${trainer.name}</p>
        <button class="add" data-trainer-id="${trainer.id}">Add Pokemon</button>`

        const pokemonUl = document.createElement('ul')
        for(i = 0; i < trainer.pokemons.length; i++){
            const pokemonLi = document.createElement('li')
            pokemonLi.innerHTML = `
            ${trainer.pokemons[i].nickname} (${trainer.pokemons[i].species}) <button class="release" data-pokemon-id="${trainer.pokemons[i].id}">Release</button>
            `
            pokemonUl.appendChild(pokemonLi)   
        }
        trainerDiv.appendChild(pokemonUl)
        mainTag.appendChild(trainerDiv)
    }

    function renderUpdatedTrainers(trainer){
        const updateTrainerDiv = document.querySelector(`div[data-id='${"trainer_id"}']`)
        console.log(updatedTrainerDiv)
        const pokemonUl = document.createElement('ul')
        for(i = 0; i < trainer.pokemons.length; i++){
            const pokemonLi = document.createElement('li')
            pokemonLi.innerHTML = `
            ${trainer.pokemons[i].nickname} (${trainer.pokemons[i].species}) <button class="release" data-pokemon-id="${trainer.pokemons[i].id}">Release</button>
            `
            pokemonUl.appendChild(pokemonLi)   
            console.log(pokemonUl)
        }
        updateTrainerDiv.appendChild(pokemonUl)
    }

    document.addEventListener('click', function(e){
        e.preventDefault()
        if(e.target.className === "add"){
            const id = e.target.getAttribute("data-trainer-id")
            fetch("http://localhost:3000/pokemons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"trainer_id": id})
            })

            fetch(`http://localhost:3000/trainers/${id}`)
            .then(response => response.json())
            .then(json => renderUpdatedTrainers(json))
        }
    })

    document.addEventListener('click', function(e){
        if(e.target.className === 'release'){
            const id = e.target.getAttribute("data-pokemon-id")
            fetch(`http://localhost:3000/pokemons/${id}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(json => console.log(json))
        }
    })

})