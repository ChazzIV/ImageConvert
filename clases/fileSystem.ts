import path from 'path';
import fs from 'fs';


export default class FileSystem{
    constructor () {}

    guardarImagen(file: any, nombre: string) {
        return new Promise((resolve: any, reject: any) =>{
            //crear carpeta

            const path = this.crearCarpetaThumb(nombre);

            const nombreArchivo = 'thumbnail' + file.sku;

            //movel el archivo 
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                }

            });
        });
    }




    private crearCarpetaThumb(nombre: string) {
        const pathThmb = path.resolve(__dirname, '../uploads', nombre);

        const existe = fs.existsSync(pathThmb);

        if(!existe) {
            fs.mkdirSync(pathThmb);
        }

        return pathThmb;
    }


    getImgUrl(image: string) {
        const pathImage = path.resolve(__dirname, '../resorces/uploads', 'images', image);
        return pathImage;
    }
}