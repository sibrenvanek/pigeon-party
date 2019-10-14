import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as socketIO from 'socket.io';

const app: express.Express = express();
const server: http.Server = new http.Server(app);
const io: SocketIO.Server = socketIO(server);
const port: number = 5000;
app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
server.listen(port, function () {
    console.log(`🚀   Starting server on port ${port}`);
});
