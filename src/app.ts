import express from 'express';
import { Server, createServer } from 'http';
import { Server as Io } from 'socket.io'

class App {
    public app: express.Application;
    public server: Server;
    private socketIo: Io;
    private user: { name: string }[];
    private position: number;

    constructor() {
        this.position = 0;
        this.user = [{name: 'Herbert'}, {name: 'Damiani'}, {name: 'José'}, {name: 'Sergio'}]
        this.app = express();
        this.server = createServer(this.app);
        this.socketIo = new Io(this.server, {
            cors: {
                origin: '*'
            }
        })

        this.socketIo.on('connection', (socket) => {
            // Enviar mensagem a cada 20 segundos
            
            const intervalId = setInterval(() => {
                console.log("enviou uma", this.position, this.user.length, this.user[this.position])
                socket.emit('intervalMessage', this.user[this.position]);
                this.position = this.position + 1;
                if(this.position > this.user.length - 1) {
                    this.position = 0;
                }
            }, 20000);

            socket.on('disconnect', () => {
                console.log('Usuário desconectado');
                // Limpar o intervalo quando o usuário se desconectar
                clearInterval(intervalId);
            });

            socket.on('message', (message) => {
                console.log(message);
                socket.broadcast.emit('message', message);
            });
        });
    }

}

export default App;