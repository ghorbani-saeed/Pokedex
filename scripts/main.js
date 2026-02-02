const allPokemonsNemeAndLinkArray = []; 
let offset = 0; 
const LIMIT = 20; 
  
async function init() {
  startLoader(); 
  await renedrePokemons(); 
  hideLoader(); 
} 

async function getData(url) { 
  const responsData = await fetch(url); 
  return await responsData.json();
}
 
async function renedrePokemons() {  
  appearing(); 
  const pokemons = await getData(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`); 
  const pokemonselement = document.getElementById("pokemons"); 
    for (let i = 0; i < pokemons.results.length; i++) {
      const pokemon = pokemons.results[i];
      allPokemonsNemeAndLinkArray.push(pokemon);  
      const pokemonDetail = await getData(pokemon.url); 
      pokemonselement.innerHTML += getPokemonTemplate(pokemonDetail, "types-" + pokemonDetail.id); 
      renderPokemonTypes(pokemonDetail, "types-" + pokemonDetail.id); 
   }
  disappearing();
}

function getPokemonTemplate(pokemonDetail) {
  const mainType = pokemonDetail.types[0].type.name; 
  const bgColor = typeColors[mainType] || "#888";    
  return `
    <div class="pokemon" onclick="openDetail(${pokemonDetail.id})">
      <div class="CardTopColor" style="background-color: ${bgColor};"></div>
      <div class="main-info">
          <img src="${pokemonDetail.sprites.other['official-artwork'].front_default}" alt="${pokemonDetail.name}" />
          <h2>${pokemonDetail.name}</h2>
          <div class="hp">
            <span>HP</span>
            <span>${pokemonDetail.stats[0].base_stat}</span>
          </div>
          <div class="types" id="types-${pokemonDetail.id}"></div>
      </div>
      <div class="powers">
           <div>
            <span>Speed</span>
            <span>${pokemonDetail.stats[5].base_stat}</span>
          </div>
          <div>
            <span>Defence</span>
            <span>${pokemonDetail.stats[2].base_stat}</span>
          </div>
          <div>
            <span>Attack</span>
            <span>${pokemonDetail.stats[1].base_stat}</span>
          </div>
      </div>
    </div>
  `;
}

function renderPokemonTypes(pokemonDetail, typesId) {
  const pokemonTypeElement = document.getElementById(typesId);
  pokemonTypeElement.innerHTML = ""; // Vorherige Inhalte löschen
  for (let i = 0; i < pokemonDetail.types.length; i++) {
    const typeInfo = pokemonDetail.types[i];
    const typeName = typeInfo.type.name;
    const color = typeColors[typeName] || "#888"; // Fallback-Farbe
    pokemonTypesTemp(pokemonTypeElement, color, typeName);
  }
}

function pokemonTypesTemp(pokemonTypeElement,color, typeName){  
   pokemonTypeElement.innerHTML += `
      <span style="
        background-color: ${color};
        color: #111111;
        text-align:center;
        font-size:18px;
        font-weight:700;
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 4px;
      ">
        ${typeName}
      </span>
    `;
}

function renderOverlayTypes(pokemonDetail, typesId) {
  const overlayTypeElement = document.getElementById(typesId);
  overlayTypeElement.innerHTML = ""; 
  for (let i = 0; i < pokemonDetail.types.length; i++) {
    const typeInfo = pokemonDetail.types[i];
    const typeName = typeInfo.type.name;
    const color = overlayTypeColors[typeName] || "#555"; 
    overlayTypesTemp(color, overlayTypeElement, typeName);
  }
}

function overlayTypesTemp(color, overlayTypeElement, typeName){
   overlayTypeElement.innerHTML += `
      <span class= "overlay-types" style="
        background-color: ${color};
        color: #1b0303;
        font-size: 20px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 4px;
        text-transform: capitalize;
      ">
        ${typeName}
      </span>
    `;
}

function appearing() { 
  document.getElementById("loading").classList.remove("d-none"); 
  document.getElementById("load-more-button").classList.add("disable");
  hideBodyScroll(); 
}

function disappearing() {
  document.getElementById("loading").classList.add("d-none");
  document.getElementById("load-more-button").classList.remove("disable");
  showBodyScroll();
}

async function openDetail(pokemonId) {
  const pokemonDetail = await getData("https://pokeapi.co/api/v2/pokemon/" + pokemonId);
  document.getElementById("overlay").innerHTML = getPokemonDetailTemp(pokemonDetail);
  renderOverlayTypes(pokemonDetail, "overlay-types-" + pokemonDetail.id);
  renderStats(pokemonDetail);
  document.getElementById("overlay").classList.remove("d-none"); 
  hideBodyScroll();
  document.getElementById("load-search-btn").classList.add("d-none");
}

function renderStats(pokemonDetail) {
  const statusElement = document.getElementById("status");
  statusElement.innerHTML = "";
  for (let i = 0; i < pokemonDetail.stats.length; i++) {
    let stat = pokemonDetail.stats[i];
    let baseStat = stat.base_stat;
    if (baseStat < 1) baseStat = 1;
    if (baseStat > 100) baseStat = 100
    statusElement.innerHTML += statsTemp(stat, baseStat);
  }
}

function statsTemp(stat, baseStat) {
  return `<div>
            <div class="title">${stat.stat.name}</div>
            <div class="progressbar">
            <span style="width: ${baseStat}%"></span>
        </div>`;
}

function closeDetail(clickedelement, event) { 
  if (event.target == clickedelement) {
    document.getElementById("overlay").classList.add("d-none");
    showBodyScroll(); 
    document.getElementById("load-search-btn").classList.remove("d-none"); 
  }
}

function nextPokemon(pokemonId) {
  let nextPokemonId = pokemonId + 1;
  if (pokemonId === allPokemonsNemeAndLinkArray.length) {
    nextPokemonId = 1;
  }
  openDetail(nextPokemonId);
}

function previousPokemon(pokemonId) {
  let previousPokemonId = pokemonId - 1; 
  if (pokemonId === 1) {
    previousPokemonId = allPokemonsNemeAndLinkArray.length;
  }
  openDetail(previousPokemonId); //öffnet overlay(nachdem click in erste karte öffnet overlay) anhand jetzige selectierte pokemon von user mit previous taste(previousPokemonId)
}

function changeTab(clickedElement, tabId) {
  const tabs = document.querySelectorAll(".tabs > div");
  for (let i = 0; i < tabs.length; i++) {   
  tabs[i].classList.remove("active");      
}

  // 2️⃣ Geklickten Tab aktiv setzen
  clickedElement.classList.add("active");

  // 3️⃣ Alle Tab-Inhalte ausblenden
  const tabContents = document.querySelectorAll(".tabsDetail > div"); //body metrics  und stats inhalte-divs auswählen
  for (let i = 0; i < tabContents.length; i++) {  //Entweder normele for oder untere forEach
  tabContents[i].classList.add("d-none"); //display none auf inhalte geben
}
  // tabContents.forEach(content => content.classList.add("d-none"));

  // 4️⃣ Passenden Inhalt einblenden
  /*cument.getElementById(tabId).classList.remove("d-none");
tabId ist z. B. "detail" oder "status"
getElementById(tabId) → holt genau dieses <div>, und tabId kommt von click aus html aus und kommt rein als argument in diese funktion
classList.remove("d-none") → entfernt die Klasse d-none, also wird der Inhalt sichtbar */
  document.getElementById(tabId).classList.remove("d-none");
}

function showBodyScroll() {
  document.querySelector("body").classList.remove("o-hidden"); 
}

function hideBodyScroll() {
  document.querySelector("body").classList.add("o-hidden"); 
}

function lodeMorePokemon() {
  offset += LIMIT;
  renedrePokemons();
}

function submitSearchForm(formElement, formEvent) { 
  formEvent.preventDefault(); 
  let searchValue = formElement.search.value;
  searchPokemon(searchValue);
}

async function searchPokemon(searchValue) {
  if (searchValue.length >= 3) {
    renderSearchPokemons(searchValue);
    document.getElementById("pokemons").classList.add("d-none"); 
    document.getElementById("search-pokemons").classList.remove("d-none"); 
  } 
}

function resetSearchForm() {
  document.getElementById("search-pokemons").classList.add("d-none");
  changeToNormalState();
  document.getElementById("load-search-btn").style.display = "none";
  document.getElementById("search-Negativ-result-btn-reset").style.display = "none";
  document.querySelector("body").classList.remove("blur-filter");
}
    
async function renderSearchPokemons(searchValue) { 
    const searchPokemons = allPokemonsNemeAndLinkArray.filter(function(foundPokemon){ 
    return foundPokemon.name.toLowerCase().includes(searchValue.toLowerCase())
    });
    const searchPokemonsElement = document.getElementById("search-pokemons"); 
    if (searchPokemons.length > 0) {  searchPokemonsElement.innerHTML = ""; 
      for (const element of searchPokemons) { 
        let pokemonDetail = await getData(element.url); 
        searchPokemonsElement.innerHTML += getPokemonTemplate(pokemonDetail, "search-types-" + pokemonDetail.id);
     }
      document.getElementById("load-more-button").classList.add("d-none"); 
      document.getElementById("load-search-btn").style.display = ""; 
    } else {  
        searchPokemonsElement.innerHTML = getEmptypokemonTemplate();  
        document.querySelector("body").classList.add("blur-filter");  
        document.getElementById("load-more-button").classList.add("d-none");
        document.getElementById("search-Negativ-result-btn-reset").style.display = "";
      }
}

function changeToNormalState() { 
  document.getElementById("pokemons").classList.remove("d-none"); 
  document.getElementById("search-pokemons").classList.add("d-none"); 
  document.getElementById("load-more-button").classList.remove("d-none"); 
  document.getElementById("search-pokemons").innerHTML = ""; 
}

function startLoader() { 
  const loaderImg = document.getElementById('Wheel'); 
  loaderImg.style.display = 'flex'; 
  loaderImg.animate(   
    [
      { transform: 'rotate(0deg)' },  
      { transform: 'rotate(360deg)' } 
    ],
    {
      duration: 2000,         
      iterations: Infinity,   
      easing: 'linear'        
    }
  );
}

function hideLoader() { 
  const loader = document.getElementById('loading');
  loader.style.display = 'none'; 
}

function getPokemonDetailTemp(pokemonDetail) { 
  const mainType = pokemonDetail.types[0].type.name; 
  const bgColor = typeColors[mainType] || "#888";   
  return `
    <div class="pokemon-overlay" style="background-color: ${bgColor};">
      <div class="icons">
        <img src="assets/img/arrow_left.png" alt="" onclick="previousPokemon(${pokemonDetail.id})" />
        <img src="assets/img/arrow_right.png" alt="${pokemonDetail.name}" onclick="nextPokemon(${pokemonDetail.id})" />
        <img src="assets/img/close_X.png" alt="" onclick="closeDetail(this,event)" />
      </div>

      <div class="details">
        <span class="code">#${pokemonDetail.id}</span>
        <span class="name">${pokemonDetail.name}</span>
        <span class="abilities" id="overlay-types-${pokemonDetail.id}"></span>
      </div>

      <div class="top">
        <img src="${pokemonDetail.sprites.other['official-artwork'].front_default}" alt="${pokemonDetail.name}" />
      </div>

      <div class="tabs">
        <div class="active" onclick="changeTab(this, 'detail')">Body metrics</div>
        <div onclick="changeTab(this, 'status')">Stats</div>
      </div>

      <div class="tabsDetail">
        <div class="detail" id="detail">
          <div>
            <div>
              <span>Height</span>
              <span>${pokemonDetail.height}m</span>
            </div>
            <div>
              <span>Weight</span>
              <span>${pokemonDetail.weight}k</span>
            </div>
          </div>
        </div>

        <div class="status d-none" id="status"></div>
      </div>
    </div>
  `;
}

function getEmptypokemonTemplate() {
  return `  <div class="empty-pokemon">
    There is no Pokemon with this specific name! Please try again.
    </div> `
}
 
function loadMorePositiveSearchbtn() { 
    const inputField = document.getElementById("inputFieldId");
    if (inputField) inputField.value = "";
    document.getElementById("load-search-btn").style.display = "none";
    document.getElementById("search-Negativ-result-btn-reset").style.display = "none";
    document.getElementById("load-more-button").classList.remove("d-none");
    changeToNormalState();
}

function resetNegativSearchBtn(){
   const inputField = document.getElementById("inputFieldId");
    if (inputField) inputField.value = "";
       document.getElementById("search-Negativ-result-btn-reset").style.display = "none"; 
}
