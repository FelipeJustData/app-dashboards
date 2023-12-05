document.addEventListener('DOMContentLoaded', function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

});

// Função para alternar favorito do carrousel de projetos
function toggleFavoriteAllProjects(contentId) {
  const favoriteToggle = document.querySelector(`[data-content-id="${contentId}"] .favorite-toggle.all-projects`);
  toggleFavorite(favoriteToggle, contentId)
}

// Função para alternar favorito
function toggleFavorite(favoriteToggle, contentId) {
  const isFavorited = favoriteToggle.classList.contains('favorited');

  // Simule a troca de ícones (estrela vazia <-> estrela preenchida)
  favoriteToggle.classList.toggle('favorited');

  // Chama a função apropriada com base no estado atual
  if (isFavorited) {
    removeFromFavorites(contentId);
  } else {
    addToFavorites(contentId);
  }
}

// Adicionar conteúdo aos favoritos
function addToFavorites(contentId) {
  fetch('/users/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_project: contentId }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Adicionado aos favoritos:', data);
      // Atualize a interface do usuário conforme necessário
    })
    .catch(error => console.log('Erro ao adicionar aos favoritos: ' + error));
}

// Remover conteúdo dos favoritos
function removeFromFavorites(contentId) {
  fetch('/users/favorites', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_project: contentId }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Removido dos favoritos:', data);
      // Atualize a interface do usuário conforme necessário
    })
    .catch(error => console.log('Erro ao remover dos favoritos: ' + error));
}

//Filtrar
function applyFilters() {
  // Coletar valores dos elementos de filtro
  const status = document.getElementById('status').value;
  const expirationDate = document.getElementById('expirationDate').value;
  const client = document.getElementById('client').value;

  // Construir a URL com parâmetros de consulta
  const queryParams = new URLSearchParams({
    status: status,
    expirationDate: expirationDate,
    client: client
  });

  // Redirecionar para a rota com os parâmetros de consulta
  window.location.href = `/projects?${queryParams.toString()}`;
}