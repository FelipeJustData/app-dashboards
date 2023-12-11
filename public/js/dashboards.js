
function totalSlides(dashboardsCount, itemsPerPage) {
    return Math.ceil(dashboardsCount / itemsPerPage);
  }
  
  
  const itemsPerPage = 20; // Número de itens por página
  const totalPages = totalSlides(dashboardsCount, itemsPerPage);
  
  const paginationContainer = document.querySelector('.pagination');
  
  
  
  // Adicione um ouvinte de clique para cada página
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
  
    const btn = document.createElement('button');
    btn.setAttribute('data-bs-target', '#dashboardCarousel2')
    btn.setAttribute('data-bs-slide-to', i - 1)
    btn.textContent = i
  
    li.appendChild(btn);
    paginationContainer.appendChild(li);
  }