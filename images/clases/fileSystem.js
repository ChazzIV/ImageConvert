"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    constructor() { }
    guardarImagen(file, nombre) {
        return new Promise((resolve, reject) => {
            //crear carpeta
            const path = this.crearCarpetaThumb(nombre);
            const nombreArchivo = 'thumbnail' + file.sku;
            //movel el archivo 
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }
    crearCarpetaThumb(nombre) {
        const pathThmb = path_1.default.resolve(__dirname, '../uploads', nombre);
        const existe = fs_1.default.existsSync(pathThmb);
        if (!existe) {
            fs_1.default.mkdirSync(pathThmb);
        }
        return pathThmb;
    }
    getImgUrl(image) {
        const pathImage = path_1.default.resolve(__dirname, '../resorces/uploads', 'images', image);
        return pathImage;
    }
}
exports.default = FileSystem;
