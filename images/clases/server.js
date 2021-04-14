"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const servertPort = Number(process.env.PORT) || 3000;
class Server {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
        // si tenemos un puerto se utiliza si no utiliza el puerto 3000
        this.port = servertPort;
    }
    start(res) {
        this.app.listen(this.port, res);
    }
}
exports.default = Server;
