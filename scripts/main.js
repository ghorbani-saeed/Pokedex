const allPokemonsNemeAndLinkArray = []; 
let currentSearchList = [];
let currentPokemonId = null;
let offset = 0; 
const LIMIT =20;

function setupBallAnimation(ballId, textId, soundId) {
  const ball = document.getElementById(ballId);
  const text = document.getElementById(textId);
  const sound = document.getElementById(soundId);
  ball.addEventListener('click', () => {
    ball.classList.remove('ball-animate');
    text.classList.remove('text-animate');
    void ball.offsetWidth; 
    ball.classList.add('ball-animate');
    setTimeout(() => { text.classList.add('text-animate');  sound.currentTime = 0; sound.play(); }, 100);  }); 
}
document.addEventListener('DOMContentLoaded', () => {setupBallAnimation('logo-animation', 'text-animation', 'hit-sound'); });

function resetViaLogo() {
    const inputField = document.getElementById("inputFieldId");
    if (inputField) inputField.value = "";
    currentSearchList = [];
    changeToNormalState();
    document.querySelector("body").classList.remove("blur-filter");
    showBodyScroll();
}

async function init() {
  appearing();
  await renderPokemons(); 
  hideLoader(); 
} 

async function getData(url) { 
  const responsData = await fetch(url); 
  return await responsData.json();
}
 
async function renderPokemons() {  
  appearing(); 
  document.getElementById("load-more-button").style.display = "flex";
  const pokemons = await getData(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`); 
  const pokemonselement = document.getElementById("pokemons"); 
  for (let i = 0; i < pokemons.results.length; i++) {
    const pokemon = pokemons.results[i];
    allPokemonsNemeAndLinkArray.push(pokemon);  
    const pokemonDetail = await getData(pokemon.url); 
    pokemonselement.innerHTML += getPokemonTemplate(pokemonDetail, false); 
    renderPokemonTypes(pokemonDetail, "types-" + pokemonDetail.id); 
  }
  disappearing();
}

function renderPokemonTypes(pokemonDetail, typesId) {
  const pokemonTypeElement = document.getElementById(typesId);
  pokemonTypeElement.innerHTML = ""; 
  for (let i = 0; i < pokemonDetail.types.length; i++) {
    const typeInfo = pokemonDetail.types[i];
    const typeName = typeInfo.type.name;
    const color = typeColors[typeName] || "#888"; 
    pokemonTypesTemp(pokemonTypeElement, color, typeName);
  }
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

function appearing() { 
  document.getElementById("loading").classList.add("active");
  document.getElementById("Wheel").classList.add("spin-animation");
  document.getElementById("load-more-button").classList.add("d-none");
  hideBodyScroll(); 
}

function disappearing() {
  document.getElementById("loading").classList.remove("active");
  document.getElementById("Wheel").classList.remove("spin-animation");
  let isSearchActive = !document.getElementById("search-pokemons").classList.contains("d-none");
  if (!isSearchActive) {
    const loadMoreBtn = document.getElementById("load-more-button");
    loadMoreBtn.classList.remove("d-none");
    loadMoreBtn.style.display = "flex";
  }  
  showBodyScroll();
}

async function openNormalOverlay(pokemonId) {
  currentPokemonId = pokemonId; 
  const pokemonDetail = await getData("https://pokeapi.co/api/v2/pokemon/" + pokemonId);
  document.getElementById("overlay").innerHTML = getPokemonOverlayTemp(pokemonDetail);
  renderOverlayTypes(pokemonDetail, "overlay-types-" + pokemonDetail.id);
  renderStats(pokemonDetail);
  document.getElementById("overlay").classList.remove("d-none"); 
  hideBodyScroll();
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

function closeDetail(clickedelement, event) { 
  if (event.target == clickedelement) {
    document.getElementById("overlay").classList.add("d-none");
    showBodyScroll(); 
  }
}

function nextPokemonNormal() {
  let nextId = currentPokemonId + 1;
  if (nextId > allPokemonsNemeAndLinkArray.length) {
    nextId = 1;
  }
  openNormalOverlay(nextId);
}

function previousPokemonNormal() {
  let prevId = currentPokemonId - 1;
  if (prevId < 1) {
    prevId = allPokemonsNemeAndLinkArray.length;
  }
  openNormalOverlay(prevId);
}

function changeTab(clickedElement, tabId) {
  const tabs = document.querySelectorAll(".tabs > div");
  for (let i = 0; i < tabs.length; i++) {   
  tabs[i].classList.remove("active");      
}
  clickedElement.classList.add("active");
  const tabContents = document.querySelectorAll(".tabsDetail > div"); 
  for (let i = 0; i < tabContents.length; i++) {  
  tabContents[i].classList.add("d-none"); 
}
  document.getElementById(tabId).classList.remove("d-none");
}

function showBodyScroll() {
  document.querySelector("body").classList.remove("o-hidden"); 
}

function hideBodyScroll() {
  document.querySelector("body").classList.add("o-hidden"); 
}

async function loadMorePokemon() {
  appearing();
  offset += LIMIT;
  await renderPokemons();
}

function submitSearchForm(formElement, formEvent) { 
  formEvent.preventDefault(); 
  let searchValue = formElement.search.value;
  searchPokemon(searchValue);
}

async function searchPokemon(searchValue) {
  if (searchValue.length >= 3) {
    const searchResult =renderSearchPokemons(searchValue);
    for (let index = 0; index < searchResult.length; index++) {
      const renderSearchResult = searchResult[index];
    }
    document.getElementById("pokemons").classList.add("d-none"); 
    document.getElementById("search-pokemons").classList.remove("d-none"); 
  } 
}

async function renderSearchPokemons(searchValue) { 
    currentSearchList = allPokemonsNemeAndLinkArray.filter(function(foundPokemon){ 
        return foundPokemon.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    appearing(); 
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchPokemonsElement = document.getElementById("search-pokemons"); 
    await SearchNegativeOrPositive(currentSearchList, searchPokemonsElement);
    disappearing(); 
}

async function SearchNegativeOrPositive(searchPokemons, searchPokemonsElement){
  document.getElementById("load-more-button").classList.add("d-none");
  document.getElementById("load-more-button").style.display = "none"; 
  if (searchPokemons.length > 0) {  
    searchPokemonsElement.innerHTML = ""; 
    for (const element of searchPokemons) { 
      let pokemonDetail = await getData(element.url); 
      searchPokemonsElement.innerHTML += getPokemonTemplate(pokemonDetail, "search-types-" + pokemonDetail.id);
    }
    document.getElementById("load-more-button").classList.add("d-none"); 
  }else {  
     searchPokemonsElement.innerHTML = getEmptypokemonTemplate();  
     document.querySelector("body").classList.add("blur-filter");  
     document.getElementById("load-more-button").classList.add("d-none");
     document.getElementById("search-Negativ-result-btn-reset").style.display = "";
    }
}
 
async function openSearchOverlay(pokemonId) {
  const pokemonDetail = await getData("https://pokeapi.co/api/v2/pokemon/" + pokemonId);
  document.getElementById("overlay").innerHTML = getPokemonSearchOverlayTemp(pokemonDetail);
  renderOverlayTypes(pokemonDetail, "overlay-types-" + pokemonDetail.id);
  renderStats(pokemonDetail);
  document.getElementById("overlay").classList.remove("d-none");
  hideBodyScroll();
}


function nextPokemonSearch(currentId) {
  for (let i = 0; i < currentSearchList.length; i++) {
    let url = currentSearchList[i].url;
    if (url.includes("/" + currentId + "/")) {
      let next = i + 1;
      if (next >= currentSearchList.length) {
        next = 0;
      }
      let nextUrl = currentSearchList[next].url;
      let parts = nextUrl.split("/");
      let id = parts[parts.length - 2];
      openSearchOverlay(Number(id));
      return;
    }
  }
}

function previousPokemonSearch(currentId) {
  for (let i = 0; i < currentSearchList.length; i++) {
    let url = currentSearchList[i].url;
    if (url.includes("/" + currentId + "/")) {
      let prev = i - 1;
      if (prev < 0) {
        prev = currentSearchList.length - 1;
      }
      let prevUrl = currentSearchList[prev].url;
      let parts = prevUrl.split("/");
      let id = parts[parts.length - 2];
      openSearchOverlay(Number(id));
      return;
    }
  }
}

function changeToNormalState() { 
  const pokemons = document.getElementById("pokemons");
  const searchPokemons = document.getElementById("search-pokemons");
  const loadMoreBtn = document.getElementById("load-more-button");
  const negativeResetBtn = document.getElementById("search-Negativ-result-btn-reset");
  if (pokemons) pokemons.classList.remove("d-none"); 
  if (searchPokemons) {
      searchPokemons.classList.add("d-none"); 
      searchPokemons.innerHTML = ""; 
  }
  if (negativeResetBtn) negativeResetBtn.style.display = "none";
  if (loadMoreBtn) {
    loadMoreBtn.classList.remove("d-none");
    loadMoreBtn.style.display = "flex"; 
  }
}

function hideLoader() { 
  const loader = document.getElementById('loading');
  loader.style.display = 'none'; 
}

function resetNegativSearchBtn(){
   const inputField = document.getElementById("inputFieldId");
    if (inputField) inputField.value = "";
    changeToNormalState();
    const negBtn= document.getElementById("search-Negativ-result-btn-reset");
    if (negBtn) negBtn.style.display = "none";
    document.querySelector("body").classList.remove("blur-filter");
    showBodyScroll();
    currentSearchList = [];
}

