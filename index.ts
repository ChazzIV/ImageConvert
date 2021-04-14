import Server from "./clases/server";

const server = new Server();


// levanta el servidor
server.start( () => {
    console.log(`Servidor image corriendo en el puerto ${server.port}`);
});