
const btnUrl = document.getElementById('addUrlField')
document.getElementById('addUrlFieldMob').addEventListener('click', () => {

    btnUrl.click()
})

document.getElementById('customer').addEventListener('change', function () {
    const selectedCustomer = this.value;

    // Enviar solicitação para buscar os dashboards relacionados
    fetch(`/projects/get-projects/${selectedCustomer}`)
        .then(response => response.json())
        .then(data => {

            // Atualize o campo "dashboard_permissions" com as opções de dashboards disponíveis
            const projectsSelect = document.getElementById('project');
            projectsSelect.innerHTML = '';

            if (data.length > 0) {

                data.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id_project;
                    option.textContent = project.nam_project; // Altere para o campo apropriado do seu dashboard

                    projectsSelect.appendChild(option);
                })
            } else {

                const option = document.createElement('option');
                option.value = ""
                option.textContent = "Nenhum projeto cadastrado"

                projectsSelect.appendChild(option);
            }

        })
        .catch(error => {
            console.error('Erro ao buscar dashboards:', error);
        });
});

