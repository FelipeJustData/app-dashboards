const multer = require("multer");
const path = require("path");
const fs = require("fs");

module.exports = {
  storage: (type) => {
    let uploadDir = "public/uploads"; // Diretório padrão para outros tipos de upload (por exemplo, clientes)

    switch (type) {
      case "projeto":
        uploadDir = "public/uploads/projects"; // Diretório para salvar imagens de projetos
        break;
      case "dashboard":
        uploadDir = "public/uploads/dashboards"; // Diretório para salvar imagens de dashboards
        break;
      case "usuario":
        uploadDir = "public/uploads/users"; // Diretório para salvar imagens de usuários
        break;
      case "logo":
        uploadDir = "public/uploads/logos"; // Diretório para salvar imagens de logotipos
        break;
      default:
        // Tipo de upload desconhecido; talvez você queira lançar um erro ou definir um valor padrão.
        break;
    }

    try {
      // Verifica se o diretório de upload existe, senão, cria-o
      fs.mkdirSync(path.resolve(uploadDir), { recursive: true });
    } catch (err) {
      console.error("Erro ao criar o diretório de upload:", err.message);
    }

    return multer.diskStorage({
      destination: (req, file, cb) => {
        try {
          console.log(">>>>>>>>>>>>>>>> SALVANDO IMAGEM EM : " +uploadDir)
          cb(null, path.resolve(uploadDir));
        } catch (error) {
          console.log("Erro ao fazer upload: "+error)
        }
        
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(file.originalname);

          // Verifique se a extensão do arquivo é válida (por exemplo, .jpg, .png, .gif)
          const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
          if (!allowedExtensions.includes(extension.toLowerCase())) {
            throw new Error("Extensão de arquivo não permitida");
          }

          const prefix = type; // Use o tipo de upload como prefixo do nome do arquivo
          cb(null, `${prefix}-${uniqueSuffix}${extension}`);
        } catch (err) {
          console.error("Erro ao gerar o nome do arquivo:", err.message);
          cb(err, null);
        }
      },
    });
  },
};
