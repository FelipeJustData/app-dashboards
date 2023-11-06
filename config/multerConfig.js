const multer = require("multer");
const path = require("path");

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
      case "logo":
        uploadDir = "public/uploads/logos"; // Diretório para salvar imagens de logotipos
        break;
      default:
        // Tipo de upload desconhecido; talvez você queira lançar um erro ou definir um valor padrão.
        break;
    }

    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve(uploadDir));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);

        // Verifique se a extensão do arquivo é válida (por exemplo, .jpg, .png, .gif)
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        if (!allowedExtensions.includes(extension.toLowerCase())) {
          return cb(new Error("Extensão de arquivo não permitida"), null);
        }

        const prefix = type; // Use o tipo de upload como prefixo do nome do arquivo
        cb(null, `${prefix}-${uniqueSuffix}${extension}`);
      },
    });
  },
};
