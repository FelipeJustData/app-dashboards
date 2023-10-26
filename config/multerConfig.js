const multer = require("multer");
const path = require("path");

module.exports ={
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.resolve("public/uploads")); // Diretório para salvar as imagens
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = file.originalname.split('.').pop(); // Obtenha a extensão do arquivo
          cb(null, 'logo-' + uniqueSuffix + '.' + extension);
        },
      })
} 