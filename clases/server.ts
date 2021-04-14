import express from 'express';

const servertPort: number = Number(process.env.PORT) || 3000;

export default class Server {
    public app: Express.Application;
    public port: number = 3000;

    constructor() {
        this.app = express();
        this.port = servertPort;
    }

    start(res: any) {
        this.app.listen(this.port, res);
    }


}