const addUrlFieldButton = document.getElementById('addUrlField');
const urlFields = document.getElementById('urlFields');
const btnConfirmSend = document.getElementById('confirm-send')
const btnCancelModall = document.getElementById('cancel-modal')
const btnSubmitForm = document.getElementById('save-dashbord')

const confirmModal = document.getElementById('confirm-modal');
const submitButton = document.getElementById('send-dashbord');
var uploadArea = document.getElementById('step-1');
var urlDashboardInput = document.getElementById('dashboard-image');
var urlInput = document.getElementById('url_dashboard');

const modalUploadImage = document.getElementById('modal-upload-image')
const dropAreaImage = document.getElementById('drop-area-image')

const confirmUploadImage = document.getElementById('confirm-modal-image')
const uploadedImageInput = document.getElementById('uploaded-image')

const modalOk = document.getElementById('modal-ok')
const buttonOk = document.getElementById('button-ok')

const cancelUploadButton = document.getElementById('cancel-upload-button')
const sendUploadButton = document.getElementById('send-upload-button')

const cancelConfirmUpload = document.getElementById('cancel-confirm-upload')
const sendConfirmUpload = document.getElementById('send-confirm-upload')

const btnUrl = document.getElementById('addUrlField')

document.getElementById('addUrlFieldMob').addEventListener('click', () => {
    btnUrl.click()
})

addUrlFieldButton.addEventListener('click', function () {
    const newUrlField = document.createElement('div');
    newUrlField.classList.add('row', 'mt-4', 'row-url-fields');
    newUrlField.innerHTML = `
                            <div class="col-12 col-btn-remove-url-mobile">
                    <span style="cursor: pointer; flex: 0 0 auto;width: 25%;margin:0; padding:0;align-self: center;"
                        onclick="removeUrlField(this)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M13.6693 4H2.33594M12.5579 5.66667L12.2513 10.2667C12.1333 12.036 12.0746 12.9207 11.4979 13.46C10.9213 14 10.0339 14 8.2606 14H7.7446C5.97127 14 5.08394 14 4.50727 13.46C3.9306 12.9207 3.87127 12.036 3.75394 10.2667L3.44727 5.66667M6.33594 7.33333L6.66927 10.6667M9.66927 7.33333L9.33594 10.6667"
                                stroke="#808080" stroke-linecap="round" />
                            <path
                                d="M4.33594 4H4.40927C4.67757 3.99314 4.93755 3.90548 5.15522 3.74847C5.37289 3.59147 5.53811 3.37243 5.62927 3.12L5.65194 3.05133L5.7166 2.85733C5.77194 2.69133 5.79994 2.60867 5.8366 2.538C5.90874 2.39959 6.01228 2.27999 6.13892 2.18877C6.26557 2.09755 6.41181 2.03724 6.56594 2.01267C6.64394 2 6.73127 2 6.90594 2H9.09927C9.27394 2 9.36127 2 9.43927 2.01267C9.5934 2.03724 9.73964 2.09755 9.86629 2.18877C9.99293 2.27999 10.0965 2.39959 10.1686 2.538C10.2053 2.60867 10.2333 2.69133 10.2886 2.85733L10.3533 3.05133C10.4378 3.33218 10.6125 3.57734 10.8504 3.74884C11.0883 3.92034 11.3761 4.00862 11.6693 4"
                                stroke="#808080" />
                        </svg></span>
                </div>
      <div class="col-12 col-md-3">                        
                        <select class="form-select form-control" name="dashboardUrls[][input_format]" required>
                            <option value="" disabled selected hidden>Selecionar</option>
                            <option value="PWBI">PWBI</option>
                            <option value="Tableu">Tableu</option>
                            <option value="Looker">Looker</option>
                            <option value="Figma">Figma</option>
                               
                            <option value="URL Genérica">URL Genérica</option>    
                            <option value="Python">Python</option>    
                            <option value="Bloco">Bloco</option>    
                            <option value="API">API</option>    
                        </select>
                        </div>
                        <div class="col-12 col-md-3">        
                            <input class="form-control" type="text" name="dashboardUrls[][url_dashboard]" required>
                        </div>
                        <div class="col-12 col-md-3">     
                            <input class="form-control" type="text" name="dashboardUrls[][dispositivo]" required>
                        </div>                        
                        <span class="svg-remove-desktop" style="cursor: pointer; flex: 0 0 auto;width: 25%;margin:0; padding:0;align-self: center;" onclick="removeUrlField(this)">                                       
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.6693 4H2.33594M12.5579 5.66667L12.2513 10.2667C12.1333 12.036 12.0746 12.9207 11.4979 13.46C10.9213 14 10.0339 14 8.2606 14H7.7446C5.97127 14 5.08394 14 4.50727 13.46C3.9306 12.9207 3.87127 12.036 3.75394 10.2667L3.44727 5.66667M6.33594 7.33333L6.66927 10.6667M9.66927 7.33333L9.33594 10.6667" stroke="#808080" stroke-linecap="round"/>
        <path d="M4.33594 4H4.40927C4.67757 3.99314 4.93755 3.90548 5.15522 3.74847C5.37289 3.59147 5.53811 3.37243 5.62927 3.12L5.65194 3.05133L5.7166 2.85733C5.77194 2.69133 5.79994 2.60867 5.8366 2.538C5.90874 2.39959 6.01228 2.27999 6.13892 2.18877C6.26557 2.09755 6.41181 2.03724 6.56594 2.01267C6.64394 2 6.73127 2 6.90594 2H9.09927C9.27394 2 9.36127 2 9.43927 2.01267C9.5934 2.03724 9.73964 2.09755 9.86629 2.18877C9.99293 2.27999 10.0965 2.39959 10.1686 2.538C10.2053 2.60867 10.2333 2.69133 10.2886 2.85733L10.3533 3.05133C10.4378 3.33218 10.6125 3.57734 10.8504 3.74884C11.0883 3.92034 11.3761 4.00862 11.6693 4" stroke="#808080"/>
        </svg></span>
    `;
    urlFields.appendChild(newUrlField);
    updateModalValues();

    // Verifica se já existem 3 filhos nós
    if (urlFields.children.length >= 3) {
        addUrlFieldButton.disabled = true;
        return; // Impede a adição de mais campos
    }
});

//submit form
submitButton.addEventListener('click', function (event) {
    updateModalValues();
    confirmModal.style.display = 'block'
})

function updateModalValues() {
    const nodes = urlFields.getElementsByClassName('row');

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const inputFormat = node.querySelector('select[name="dashboardUrls[][input_format]"]').value;
        const urlDashboard = node.querySelector('input[name="dashboardUrls[][url_dashboard]"]').value;
        const dispositivo = node.querySelector('input[name="dashboardUrls[][dispositivo]"]').value;

        const modalInputFormat = confirmModal.querySelector(`#displayInputFormat${i + 1}`);
        const modalUrlDashboard = confirmModal.querySelector(`#displayUrlDashboard${i + 1}`);
        const modalDispositivo = confirmModal.querySelector(`#displayDispositivo${i + 1}`);

        modalInputFormat.style.display = 'block';
        modalUrlDashboard.style.display = 'block';
        modalDispositivo.style.display = 'block';

        modalInputFormat.value = `${inputFormat}`;
        modalUrlDashboard.value = `${urlDashboard}`;
        modalDispositivo.value = `${dispositivo}`;
    }
}

btnConfirmSend.addEventListener('click', () => {
    confirmModal.style.display = 'none'
    btnSubmitForm.click();
})

btnCancelModall.addEventListener('click', () => {
    confirmModal.style.display = 'none'

})

function removeUrlField(element) {
    const urlFields = document.getElementById('urlFields');
    urlFields.removeChild(element.parentElement); // Remove o elemento pai
    const addUrlFieldButton = document.getElementById('addUrlField');
    addUrlFieldButton.disabled = false; // Habilita o botão de adição
    updateModalValues();
}

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
