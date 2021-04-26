const pokedexElement = document.getElementById("pokedex");
const pokeDetailsElement = document.getElementById("pokedetails");
const pokeSearchElement = document.getElementById("searchPoke");

const apiUrl = "https://pokeapi.co/api/v2/";
const spriteUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
let pokemonCount;
let apiPath = "";

const fetchPokemon = async () =>
{
    apiPath = "pokemon";

    const response = await fetch(apiUrl + apiPath + "?limit=151");
    const data = await response.json();

    console.log(data);

    if(data)
    {
        if(pokeSearchElement.value.length === 0)
        {
            pokemonCount = data.results.length;

            const pokemonData = data.results.map((poke, index) => 
            ({
                ...poke, // name: poke.name, url: poke.url
                img: `${ spriteUrl }${ poke.url.substring(34, 37).replace("/", "") }.png`,
                id: parseInt(poke.url.substring(34, 37).replace("/", ""))
            }));

            console.log(pokemonData);

            displayPokemon(pokemonData);
        }

        pokeSearchElement.addEventListener("input", event =>
        {
            const foundPokemon = data.results.filter(result => 
            {
                if(result.name.includes(pokeSearchElement.value))
                {
                    return result;
                }
            });

            const foundFiltered = foundPokemon.map(poke =>
            {
                return {
                    ...poke, // name: poke.name, url: poke.url
                    img: `${ spriteUrl }${ poke.url.substring(34, 37).replace("/", "") }.png`,
                    id: parseInt(poke.url.substring(34, 37).replace("/", ""))
                };
            });

            displayPokemon(foundFiltered);
        });
    }
}

const displayPokemon = (pokemonList) =>
{
    pokedexElement.innerHTML = "";

    pokemonList.map((pokemon, i) =>
    {
        const listElement = document.createElement("LI");
        listElement.classList.add("card");

        listElement.onclick = (event) =>
        {
            displaySinglePokemon(pokemon.id);
        }

        const imageElement = document.createElement("IMG");
        imageElement.classList.add("card-img");
        imageElement.src = pokemon.img;

        const pokeNameElement = document.createElement("H3");
        pokeNameElement.classList.add("card-title");
        pokeNameElement.innerText = `${ pokemon.id }. ${ pokemon.name }`;

        listElement.appendChild(imageElement);
        listElement.appendChild(pokeNameElement);
        
        pokedexElement.appendChild(listElement);
    })
}

const displaySinglePokemon = async (id) =>
{
    const response = await fetch(apiUrl + "pokemon/" + id);
    const data = await response.json();
    
    if(data)
    {
        console.log(data);

        pokeDetailsElement.style.display = "grid";
        pokedexElement.style.display = "none";

        const detailsElement = document.createElement("LI");
        detailsElement.classList.add("card");

        const imageFrontElement = document.createElement("IMG");
        const imageBackElement = document.createElement("IMG");
        const imageShinyElement = document.createElement("IMG");

        imageFrontElement.classList.add("card-img");
        imageBackElement.classList.add("card-img");
        imageShinyElement.classList.add("card-img");

        imageFrontElement.src = data.sprites.front_default;
        imageBackElement.src = data.sprites.back_default;
        imageShinyElement.src = data.sprites.front_shiny;

        const pokeNameElement = document.createElement("H3");
        pokeNameElement.classList.add("card-title");
        pokeNameElement.innerText = `${ data.id }. ${ data.name }`;

        const pokeMetaInfoElement = document.createElement("P");
        pokeMetaInfoElement.classList.add("card-subtitle");
        pokeMetaInfoElement.innerText = `height: ${ data.height } | weight: ${ data.weight } | type: ${ data.types.map(type => type.type.name).join(", ") }`;

        const closeButtonElement = document.createElement("BUTTON");
        closeButtonElement.textContent = "Close";

        closeButtonElement.onclick = (event) =>
        {
            pokeDetailsElement.style.display = "none";
            pokeDetailsElement.innerHTML = "";

            pokedexElement.style.display = "grid";
        }

        detailsElement.appendChild(imageFrontElement);
        detailsElement.appendChild(imageBackElement);
        detailsElement.appendChild(imageShinyElement);

        detailsElement.appendChild(pokeNameElement);
        detailsElement.appendChild(pokeMetaInfoElement);

        detailsElement.appendChild(closeButtonElement);

        pokeDetailsElement.appendChild(detailsElement);
    }
}

fetchPokemon();
