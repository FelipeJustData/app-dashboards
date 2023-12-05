const modalUploadDesktop = document.getElementById('modal-upload-desktop');
const modalUploadMobile = document.getElementById('modal-upload-mobile');
const modalUploadLogo = document.getElementById('modal-upload-logo');

const confirmModalDesktop = document.getElementById('confirm-modal-desktop');
const confirmModalMobile = document.getElementById('confirm-modal-mobile');
const confirmModalLogo = document.getElementById('confirm-modal-logo');

const sendInputDesktop = document.getElementById('des_project_image_desktop');
const sendInputMobile = document.getElementById('des_project_image_mobile');
const sendInputLogo = document.getElementById('des_project_image_logo');

const fileInputDesktop = document.getElementById('fileInputDesktop');
const fileInputMobile = document.getElementById('fileInputMobile');
const fileInputLogo = document.getElementById('fileInputLogo');

const dropAreaDesktop = document.getElementById('drop-area-desktop');
const dropAreaMobile = document.getElementById('drop-area-mobile');
const dropAreaLogo = document.getElementById('drop-area-logo');

const uploadedImageDesktop = document.getElementById('uploaded-image-desktop')
const uploadedImageMobile = document.getElementById('uploaded-image-mobile')
const uploadedImageLogo = document.getElementById('uploaded-image-logo')

const btnSendImageDesktop = document.getElementById('confirm-upload-desktop')
const btnSendImageMobile = document.getElementById('confirm-upload-mobile')
const btnSendImageLogo = document.getElementById('confirm-upload-logo')

const imagePreviewDesktop = document.getElementById('image-preview-desktop');
const imagePreviewMobile = document.getElementById('image-preview-mobile');
const imagePreviewLogo = document.getElementById('image-preview-logo');

const previewImageDesktop = document.getElementById('preview-thumb-desk');
const previewImageMobile = document.getElementById('preview-thumb-mobile');
const previewImageLogo = document.getElementById('preview-thumb-logo');


const modalOk = document.getElementById('modal-ok');
const buttonOk = document.getElementById('button-ok');


const btnSaveEdit = document.getElementById('btn-save-edit')
const btnSubmitEdit = document.getElementById('btn-submit-edit')

btnSaveEdit.addEventListener('click', () => {
    btnSubmitEdit.click();
})

// Eventos de arrastar e soltar
dropAreaDesktop.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropAreaDesktop.style.backgroundColor = '#f2f2f2';
});

dropAreaDesktop.addEventListener('dragleave', () => {
    dropAreaDesktop.style.backgroundColor = 'white';
});

dropAreaDesktop.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        openConfirmModalDesktop();

        // Criar um novo FileList contendo o arquivo
        const filesList = new DataTransfer();
        filesList.items.add(file);

        // Atribuir o FileList ao campo de entrada de arquivo
        sendInputDesktop.files = filesList.files;

        uploadedImageDesktop.value = file.name;
        closeModalUploadDesktop();
    }
    dropAreaDesktop.style.backgroundColor = 'white';
});

dropAreaDesktop.addEventListener('click', () => {
    sendInputDesktop.click();
})

dropAreaMobile.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropAreaMobile.style.backgroundColor = '#f2f2f2';
});

dropAreaMobile.addEventListener('dragleave', () => {
    dropAreaMobile.style.backgroundColor = 'white';
});

dropAreaMobile.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        openConfirmModalMobile();

        // Criar um novo FileList contendo o arquivo
        const filesList = new DataTransfer();
        filesList.items.add(file);

        // Atribuir o FileList ao campo de entrada de arquivo
        sendInputMobile.files = filesList.files;

        uploadedImageMobile.value = file.name;
        closeModalUploadMobile();
    }
    dropAreaMobile.style.backgroundColor = 'white';
});

dropAreaMobile.addEventListener('click', () => {
    sendInputMobile.click();
})

dropAreaLogo.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropAreaLogo.style.backgroundColor = '#f2f2f2';
});

dropAreaLogo.addEventListener('dragleave', () => {
    dropAreaLogo.style.backgroundColor = 'white';
});

dropAreaLogo.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        openConfirmModalLogo();

        // Criar um novo FileList contendo o arquivo
        const filesList = new DataTransfer();
        filesList.items.add(file);

        // Atribuir o FileList ao campo de entrada de arquivo
        sendInputLogo.files = filesList.files;

        uploadedImageLogo.value = file.name;
        closeModalUploadLogo();
    }
    dropAreaLogo.style.backgroundColor = 'white';
});

dropAreaLogo.addEventListener('click', () => {
    sendInputLogo.click();
})

buttonOk.addEventListener('click', () => {
    modalOk.style.display = 'none'
})

// Função para abrir o modal de upload para Thumb Desktop
const openModalUploadDesktop = () => {
    modalUploadDesktop.style.display = 'block';
};

// Função para abrir o modal de upload para Thumb Mobile
const openModalUploadMobile = () => {
    modalUploadMobile.style.display = 'block';
};

// Função para abrir o modal de upload para Logo
const openModalUploadLogo = () => {
    modalUploadLogo.style.display = 'block';
};

// Função para abrir o modal de confirmação para Thumb Desktop
const openConfirmModalDesktop = () => {
    confirmModalDesktop.style.display = 'block';
};

// Função para abrir o modal de confirmação para Thumb Mobile
const openConfirmModalMobile = () => {
    confirmModalMobile.style.display = 'block';
};

// Função para abrir o modal de confirmação para Logo
const openConfirmModalLogo = () => {
    confirmModalLogo.style.display = 'block';
};

const openModalOk = () => {
    modalOk.style.display = 'block'
}

// Eventos de clique para abrir os modais de upload e confirmação
imagePreviewDesktop.addEventListener('click', openModalUploadDesktop);
imagePreviewMobile.addEventListener('click', openModalUploadMobile);
imagePreviewLogo.addEventListener('click', openModalUploadLogo);

btnSendImageDesktop.addEventListener('click', () => {
    const file = sendInputDesktop.files[0]

    if (file) {
        closeModalConfirmDesktop();
        imagePreviewDesktop.style.display = 'block';
        showImage(file, previewImageDesktop);
        openModalOk();
    }
})

btnSendImageMobile.addEventListener('click', () => {
    const file = sendInputMobile.files[0]
    if (file) {
        closeModalConfirmMobile();
        imagePreviewMobile.style.display = 'block';
        showImage(file, previewImageMobile);
        openModalOk();
    }
})

btnSendImageLogo.addEventListener('click', () => {
    const file = sendInputLogo.files[0]
    if (file) {

        closeModalConfirmLogo();
        imagePreviewLogo.style.display = 'block';
        showImage(file, previewImageLogo);
        openModalOk();
    }
})

// Eventos de seleção de arquivo para atualizar a imagem no modal de upload
sendInputDesktop.addEventListener('change', () => {
    const file = sendInputDesktop.files[0];
    if (file) {

        openConfirmModalDesktop();
        uploadedImageDesktop.value = file.name
        closeModalUploadDesktop();
    }
});

sendInputMobile.addEventListener('change', () => {
    const file = sendInputMobile.files[0];
    if (file) {
        openConfirmModalMobile();
        uploadedImageMobile.value = file.name
        closeModalUploadMobile();
    }
});

sendInputLogo.addEventListener('change', () => {
    const file = sendInputLogo.files[0];
    if (file) {
        openConfirmModalLogo();
        uploadedImageLogo.value = file.name
        closeModalUploadLogo();
    }
});

// Função para exibir imagem após o carregamento
const showImage = (file, previewElement) => {
    const reader = new FileReader();
    reader.onload = function (e) {
        previewElement.style.display = 'block';
        previewElement.src = e.target.result;
    };
    reader.readAsDataURL(file);

};

// Funções para fechar os modais
const closeModalUploadDesktop = () => {
    modalUploadDesktop.style.display = 'none';
};

const closeModalUploadMobile = () => {
    modalUploadMobile.style.display = 'none';
};

const closeModalUploadLogo = () => {
    modalUploadLogo.style.display = 'none';
};

const closeModalConfirmDesktop = () => {
    confirmModalDesktop.style.display = 'none';
};

const closeModalConfirmMobile = () => {
    confirmModalMobile.style.display = 'none';
};

const closeModalConfirmLogo = () => {
    confirmModalLogo.style.display = 'none';
};

// Eventos de clique para fechar os modais
document.getElementById('cancel-upload-desktop').addEventListener('click', closeModalConfirmDesktop);
document.getElementById('cancel-upload-mobile').addEventListener('click', closeModalConfirmMobile);
document.getElementById('cancel-upload-logo').addEventListener('click', closeModalConfirmLogo);
document.getElementById('cancel-button-desktop').addEventListener('click', closeModalUploadDesktop);
document.getElementById('cancel-button-mobile').addEventListener('click', closeModalUploadMobile);
document.getElementById('cancel-button-logo').addEventListener('click', closeModalUploadLogo);