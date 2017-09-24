const net = require('net');
const fs = require('fs');
const port = 8124;
const filesString = 'FILES';
const good = 'ACK';
const bad = 'DEC';
const logger = fs.createWriteStream('client_id.log');
const defaultDir = process.env.DIRECTORY_FOR_SAVING_FILES;
const maxNumber = parseInt(process.env.MAX_NUMBER_OF_CONNECTIONS);

let numberOfClients = 0;
let seed = 0;
let number = 1;
const server = net.createServer((client) => {
    if (++numberOfClients > maxNumber)
    {
        client.write(bad);
        return;
    }
    console.log(numberOfClients);
    console.log('Client connected');
    client.setEncoding('utf8');

    client.on('data', (data, err) => {
        if (err) console.error(err);
        else if (!err && data === filesString) {
            client.id = Date.now() + seed++;
            writeLog('Client #' + client.id + ' connected\n');
            client.write(good);
        }
        else
        {
            console.log(data);
            let new_directory = defaultDir.slice(0, -1) + '\\\\' + client.id;
            createNewDirectory(new_directory);
            let newfile = new_directory + '\\' + (number++) + '.txt';
            let file = fs.createWriteStream(newfile);
            file.write(data);
        }
    });
    client.on('end', () => {
        logger.write('Client #' + client.id + ' disconnected');
        console.log('Client disconnected');
    });
});

function createNewDirectory(pathname) {
    if (!fs.existsSync(pathname))
        fs.mkdirSync(pathname);
}
function writeLog(data) {
    logger.write(data);
}

server.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on localhost: ${port}`);
});
