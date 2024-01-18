function initializeRickMortyWidget(widgetId) {
  const charactersContainer = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName('rickmorty-characters')[0];
  const nameFilterInput = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName('search-field')[0];
  const loadingIndicator = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName('loading')[0];
  const charactersContainerContent = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`rickmorty-characters-content`)[0];
  const statusFilterSelect = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`status-filter`)[0];
  const genderFilterSelect = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`gender-filter`)[0];
  const totalResultsElement = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`total-results`)[0];
  const prevButton = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`prev-button`)[0];
  const currentPageElement = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`current-page`)[0];
  const nextButton = document.getElementById(`rickmorty_widget_${widgetId}`).getElementsByClassName(`next-button`)[0];

  let currentPage = 1;
  let typingTimer;  // Variable para almacenar el temporizador

  nameFilterInput.addEventListener('input', function() {
      clearTimeout(typingTimer);  // Limpiar el temporizador existente
  
      // Configurar un nuevo temporizador que ejecutará la búsqueda después de 800 milisegundos
      typingTimer = setTimeout(function() {
          updateFilters();
      }, 800);
  });

  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', updateFilters);
  }
  if (genderFilterSelect) {
    genderFilterSelect.addEventListener('change', updateFilters);
  }

  
  async function fetchCharacters(filters) {
    const apiUrl = 'https://rickandmortyapi.com/api/character/';
    let url = `${apiUrl}?page=${currentPage}`;

    if (filters && filters.length > 0) {
      const queryParams = filters.map(filter => `${filter.key}=${filter.value}`);
      const queryString = queryParams.join('&');
      url += '&' + queryString;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async function renderCharacters(filters) {
    charactersContainerContent.innerHTML = '';
    charactersContainerContent.style.display = 'none';
    loadingIndicator.style.display = 'block';

    try {
      const { info, results } = await fetchCharacters(filters);

      totalResultsElement.textContent = `Resultados Totales: ${info.count}`;

      for (let character of results) {
        const card = document.createElement('div');
        card.classList.add('character-card');

        card.innerHTML = `
          <img src="${character.image}" class="character-image"/>
          <div class="character-card-info"> 
            <div class="character-name"> <strong>${character.name} </strong></div>
            <div class="character-status ${character.status}">${character.status}</div>
            <div class="character-specie"> <strong>Especie:</strong><br> ${character.species} </div>
            <div class="character-gender"><strong>Genero:</strong> <br>${character.gender}</div>
            <div class="character-orgin"><strong>Origen:</strong> <br>${character.origin.name}</div>
            <div class="character-location"><strong>Ultima Ubicacion:</strong> <br>${character.location.name}</div>
          </div>
        `;
        charactersContainerContent.appendChild(card);
      }

      setTimeout(() => {
        loadingIndicator.style.display = 'none';
        charactersContainerContent.style.display = 'grid';
      }, 1500);

      renderPagination(info);
    } catch (error) {
      console.error('Error obteniendo los personajes:', error);
      loadingIndicator.style.display = 'none';
      charactersContainerContent.style.display = 'block';
      charactersContainerContent.innerHTML = '<div class="error-message">No se pudieron cargar los personajes. Por favor, inténtalo de nuevo más tarde.</div>';
    }
  }

  function renderPagination(info) {
    const totalPages = info.pages;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || !info.next;
    currentPageElement.textContent = `Pagina  ${currentPage} de ${totalPages}`;
  }

  function getFilters() {
    const filters = [];

    const nameValue = nameFilterInput.value.trim();
    const statusValue = statusFilterSelect ? statusFilterSelect.value : '';
    const genderValue = genderFilterSelect ? genderFilterSelect.value : '';

    if (nameValue !== '') {
      filters.push({ key: 'name', value: nameValue });
    }

    if (statusValue !== '') {
      filters.push({ key: 'status', value: statusValue });
    }

    if (genderValue !== '') {
      filters.push({ key: 'gender', value: genderValue });
    }

    return filters;
  }


  const changePage = async function(offset) {
    currentPage += offset;
    renderCharacters(getFilters());
  };


  window[`changePage_${widgetId}`] = changePage;
  prevButton.addEventListener('click', () => changePage(-1));
  nextButton.addEventListener('click', () => changePage(1));

  function updateFilters() {
    currentPage = 1;
    renderCharacters(getFilters());
  }

  renderCharacters(getFilters());
}


document.addEventListener('DOMContentLoaded', () => {
  // Obtén todos los contenedores de widgets
  const widgetContainers = document.querySelectorAll('.rickmorty-widget');

  // Itera sobre los contenedores y extrae el ID
  widgetContainers.forEach(container => {
    const widgetId = container.id.replace('rickmorty_widget_', '');

    // Obtiene los Filtros de cada widget
    const statusFilterSelect = container.querySelector('.status-filter');
    const genderFilterSelect = container.querySelector('.gender-filter');

    initializeRickMortyWidget(widgetId);
  });
});
