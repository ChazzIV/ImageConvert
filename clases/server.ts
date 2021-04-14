import express from 'express';

const servertPort: number = Number(process.env.PORT) || 3000;

export default class Server {
    public app: express.Application;
    public port: number = 3000;

    constructor() {
        this.app = express();
        // si tenemos un puerto se utiliza si no utiliza el puerto 3000
        this.port = servertPort;
    }

    start(res: any) {
        this.app.listen(this.port, res);
    }


}