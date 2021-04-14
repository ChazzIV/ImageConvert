"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const server = new server_1.default();
// levanta el servidor
server.start(() => {
    console.log(`Servidor image corriendo en el puerto ${server.port}`);
});
