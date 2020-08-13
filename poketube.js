function fetchPokemon() {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then( res => res.json() ))
    }

    Promise.all(promises).then( results => {
        results.forEach( result => {
            const pokemon = createPokemon(result);
            displayPokemon(pokemon);
        })
    })
}

function createPokemon(data) {
    const pokemon = {
        'name': data.name,
        'sprite': data.sprites['front_default']
    }

    return pokemon;
}

function displayPokemon(pokemon) {
    const pokedex = document.getElementById('pokedex');
    const pokemonHTMLString = `
    <a class="pokemon card" data-toggle="modal" data-target="#pokemonModal" data-whatever="${pokemon.name}">
        <img class="card-img-top" src='${pokemon.sprite}'></img>
        <div class="card-body">
            <h1 class="card-title">${pokemon.name}</h1>
        </div>
    </a>
    `;
    pokedex.innerHTML += pokemonHTMLString;
}

function fetchVideos(pokemon) {
    const key = 'AIzaSyBQELNaiGouctCpx6xw_fAPAbevffvBLOQ';
    var url = new URL('https://www.googleapis.com/youtube/v3/search')
    var params = {
        part: 'snippet',
        key: key,
        maxResults: 5,
        q: pokemon + 'pokemon'
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url)
        .then( res => res.json() )
        .then( data => {
            data.items.forEach(video => {
                createVideo(video.id['videoId']);
            })
        })
}

function createVideo(id) {
    const modalBody = document.getElementById('pokemon-videos');
    
    const videoHTMLString = `
    <iframe width="100%" height="360" src="https://www.youtube.com/embed/${id}"></iframe>
    `;
    modalBody.innerHTML += videoHTMLString;
}

$('#pokemonModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var pokemon = button.data('whatever'); // Extract info from data-* attributes
    var modal = $(this);
    modal.find('.modal-title').text(pokemon);
    fetchVideos(pokemon);
})

$('#pokemonModal').on('hidden.bs.modal', function () {
    var modal = $(this);
    modal.find('#pokemon-videos').empty();
    $("#pokemonModal iframe").attr("src", $("#pokemonModal iframe").attr("src"));
})

fetchPokemon();