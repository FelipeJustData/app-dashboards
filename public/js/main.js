document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    const sidebar = document.getElementById('sidebar');
    const collapseButton = document.getElementById('sidebarCollapse');
    const headerBar = document.getElementById('header-bar');
    const mainContainer = document.getElementById('main-container');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const logoJust = document.getElementById('logo-just');
    const currentLogo = localStorage.getItem('logo');
    const setMode = document.getElementById('set-mode')

    // Verifique o valor armazenado no Local Storage
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (isSidebarCollapsed === 'true') {
        sidebar.classList.add('collapsed');
        headerBar.classList.add('header-bar-expand');
        mainContainer.classList.add('mainContainer-expand');
        sidebarCollapse.innerHTML = "&gt;";
        logoJust.style.display = 'none'
        setMode.style.display = 'none'
    } else {
        sidebar.classList.remove('collapsed');
        headerBar.classList.remove('header-bar-expand');
        mainContainer.classList.remove('mainContainer-expand');
        sidebarCollapse.innerHTML = "&lt;";
        logoJust.style.display = 'block'
        setMode.style.display = 'block'
    }

    // Função para alternar as classes da barra lateral
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        headerBar.classList.toggle('header-bar-expand');
        mainContainer.classList.toggle('mainContainer-expand');
        if (sidebar.classList.contains('collapsed')) {
            sidebarCollapse.innerHTML = "&gt;"; // Menu recolhido
            logoJust.setAttribute('src', '')
            localStorage.setItem('sidebarCollapsed', 'true');
            setMode.style.display = 'none'
        } else {
            sidebarCollapse.innerHTML = "&lt;"; // Menu expandido
            logoJust.setAttribute('src', currentLogo)
            localStorage.setItem('sidebarCollapsed', 'false');
            setMode.style.display = 'block'
        }
    }

    // Adicionar um ouvinte de evento ao botão de expansão/recolhimento
    collapseButton.addEventListener('click', toggleSidebar);

    const menuItems = document.querySelectorAll('.item-menu-href');
    // Verifica a URL da página atual e destaca o item de menu correspondente
    const currentPageUrl = window.location.pathname;

    menuItems.forEach((item) => {
        const menuItemUrl = item.getAttribute('href');

        if (currentPageUrl.includes(menuItemUrl)) {
            item.querySelector('.item-menu').classList.add('item-menu-ativo');
        }
    });
});  

//Modo escuro
const htmlElement = document.documentElement;
const currentMode = localStorage.getItem('mode');
const logoJust = document.getElementById('logo-just')
const lightModeButton = document.getElementById('mode-light');
const darkModeButton = document.getElementById('mode-dark');
const modeLight = document.getElementById("mode-light");
const modeDark = document.getElementById("mode-dark");

if (currentMode === 'dark') {
    htmlElement.setAttribute('id', 'dark-mode');
}

document.addEventListener("DOMContentLoaded", function (event) {

    if (currentMode === 'dark') {
        logoJust.setAttribute('src', '/img/logo-just-branco.svg')
        localStorage.setItem('logo', '/img/logo-just-branco.svg');
        modeLight.classList.remove("mode-selected");
        modeDark.classList.add("mode-selected");
    } else {
        logoJust.setAttribute('src', '/img/compact-negative-signature.svg')
        localStorage.setItem('logo', '/img/compact-negative-signature.svg');
        modeLight.classList.add("mode-selected");
        modeDark.classList.remove("mode-selected");
    }

});


function toggleDarkMode() {
    if (htmlElement.getAttribute('id') === 'light-mode') {
        htmlElement.setAttribute('id', 'dark-mode');
        localStorage.setItem('mode', 'dark');
        localStorage.setItem('logo', '/img/logo-just-branco.svg');
        logoJust.setAttribute('src', '/img/logo-just-branco.svg')
    } else {
        htmlElement.setAttribute('id', 'light-mode');
        localStorage.setItem('mode', 'light');
        localStorage.setItem('logo', '/img/compact-negative-signature.svg');
        logoJust.setAttribute('src', '/img/compact-negative-signature.svg')
    }
    modeLight.classList.toggle("mode-selected");
    modeDark.classList.toggle("mode-selected");
}