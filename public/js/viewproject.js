
const btnDelete = document.getElementById('btn-delete-project')
const svgDelete = document.getElementById('svg-delete-project')
const modalDelete = document.getElementById('modal-delete')

const cancelButtonDelete = document.getElementById('cancel-button-delete')
const confirmButtonDelete = document.getElementById('confirm-button-delete')

cancelButtonDelete.addEventListener('click', () => {
    modalDelete.style.display = 'none'
})

confirmButtonDelete.addEventListener('click', () => {
    btnDelete.click()
    modalDelete.style.display = 'none'
})

svgDelete.addEventListener('click', () => {
    modalDelete.style.display = 'block'
})

/*

document.addEventListener('DOMContentLoaded', function () {
    addToProjectView({{ project.id_project }})
    })

// Adicionar conteúdo aos favoritos
function addToProjectView(id_project) {
    fetch('/projects/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_project: id_project }),
    })
        .then(response => { console.log('Resposta:', response); return response.json() })
        .then(data => {
            console.log('Adicionado aos projetos visualizados recentemente:', data);
            // Atualize a interface do usuário conforme necessário
        })
        .catch(error => console.log('Erro ao adicionar aos favoritos: ' + error));
}
*/