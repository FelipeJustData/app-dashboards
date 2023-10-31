// Seleciona todos os elementos da lista
const menuItems = document.querySelectorAll('.item-menu');

// Adiciona um ouvinte de evento de clique a cada elemento da lista
menuItems.forEach((item) => {

  // Adiciona um ouvinte de evento de mouseover para realçar o fundo ao passar o mouse
  item.addEventListener('mouseover', () => {
    item.style.backgroundColor = '#84FFDE';
    item.style.borderRadius = '4px';
  });

  // Adiciona um ouvinte de evento de mouseout para remover o realce ao retirar o mouse
  item.addEventListener('mouseout', () => {
    item.style.backgroundColor = '';
    item.style.borderRadius = '0px';
  });
});

// Verifica a URL da página atual e destaca o item de menu correspondente
const currentPageUrl = window.location.pathname;

menuItems.forEach((item) => {
  const menuItemUrl = item.querySelector('a').getAttribute('href');
  
  if (currentPageUrl.includes(menuItemUrl)) {
    item.classList.add('item-menu-ativo');
  }
});