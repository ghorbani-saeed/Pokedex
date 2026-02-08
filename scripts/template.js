function getPokemonTemplate(pokemonDetail, isSearch = false) {
  const mainType = pokemonDetail.types[0].type.name; 
  const bgColor = typeColors[mainType] || "#888";    
  const openVariable = isSearch ? "openSearchOverlay" : "openNormalOverlay"; 
  return `
    <div class="pokemon" onclick="${openVariable}(${pokemonDetail.id})">
      <div class="CardTopColor" style="background-color: ${bgColor};"></div>

      <div class="main-info">
        <img src="${pokemonDetail.sprites.other['official-artwork'].front_default}"
             alt="${pokemonDetail.name}" />

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

function statsTemp(stat, baseStat) {
  return `<div>
            <div class="title">${stat.stat.name}</div>
            <div class="progressbar">
            <span style="width: ${baseStat}%"></span>
        </div>`;
}

function getPokemonOverlayTemp(pokemonDetail) { 
  const mainType = pokemonDetail.types[0].type.name; 
  const bgColor = typeColors[mainType] || "#888";   
  return `
    <div class="pokemon-overlay" style="background-color: ${bgColor};" onclick="event.stopPropagation()">
      <div class="icons">
        <img src="assets/img/arrow_left.png" alt="" onclick="previousPokemonNormal()" />
        <img src="assets/img/arrow_right.png" alt="${pokemonDetail.name}" onclick="nextPokemonNormal()" />
        <img src="assets/img/close_X.png" alt="" onclick="closeDetail(this,event)" />
      </div>

      <div class="details">
        <span class="code">#${pokemonDetail.id}</span>
        <span class="name">${pokemonDetail.name}</span>
      </div>
      
      <div class= "overlay-abilities-container">
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

function getPokemonSearchOverlayTemp(pokemonDetail) { 
  const mainType = pokemonDetail.types[0].type.name; 
  const bgColor = typeColors[mainType] || "#888";   

  return `
    <div class="pokemon-overlay" style="background-color: ${bgColor};">
      <div class="icons">
        <img src="assets/img/arrow_left.png"
             onclick="previousPokemonSearch(${pokemonDetail.id})" />

        <img src="assets/img/arrow_right.png"
             onclick="nextPokemonSearch(${pokemonDetail.id})" />

        <img src="assets/img/close_X.png"
             onclick="closeDetail(this,event)" />
      </div>

      <div class="details">
        <span class="code">#${pokemonDetail.id}</span>
        <span class="name">${pokemonDetail.name}</span>
      </div>
      
      <div class="overlay-abilities-container">
        <span class="abilities" id="overlay-types-${pokemonDetail.id}"></span>
      </div>

      <div class="top">
        <img src="${pokemonDetail.sprites.other['official-artwork'].front_default}"
             alt="${pokemonDetail.name}" />
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
