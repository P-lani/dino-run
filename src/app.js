import express from 'express';
import { createServer } from 'http';
import { loadGameAssets } from './init/assets.js';
import initSocket from './init/socket.js';

const app = express();
const server = createServer(app);

const PORT = 3005;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, async () => {
    try {
        console.log(`Server is running on port ${PORT}`);

        const assets = await loadGameAssets();
        console.log(assets);
    } catch (e) {
        console.error(`server ${e}`);
    }
});
