const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

// Obtenha uma referência para o modal e o conteúdo do modal
const modal = document.getElementById("pokemon-details-modal");
const modalContent = document.querySelector(".modal-content");
const modalPokemonDetails = document.getElementById("modal-pokemon-details");

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml;

          // Adicione um evento de clique a cada Pokémon na lista
          pokemons.forEach((pokemon) => {
            const pokemonElement = document.querySelector(`[data-pokemon-id="${pokemon.number}"]`);
            if (pokemonElement) {
                pokemonElement.addEventListener("click", () => {
                    // Aqui você pode abrir o modal e carregar os detalhes do Pokémon
                    // Use o ID do Pokémon para identificar qual Pokémon foi clicado
                    modal.style.display = "block";

                    const pokemonId = pokemon.number;

                    loadPokemonDetailsAndFillModal(pokemonId);
                });
            }
        });
    });
}

function loadPokemonDetailsAndFillModal(pokemonId) {
    // Faça uma chamada à API para obter os detalhes do Pokémon com base no 'pokemonId'
    pokeApi.getPokemonDetail(pokemonId).then((pokeDetail) => {
        // Preencha o conteúdo do modal com os detalhes do Pokémon
        modalContent.innerHTML = `
            <h2>${pokeDetail.name}</h2>
            <img src="${pokeDetail.photo}" alt="${pokeDetail.name}" />
            <p>Tipo: ${pokeDetail.type}</p>
            <!-- Adicione outros detalhes do Pokémon aqui -->
        `;

        // Mostre o modal
        modal.style.display = "block";
    });
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Adicione um evento de clique para fechar o modal
const closeButton = document.querySelector(".close");
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});
