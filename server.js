const net = require('net');
const fs = require('fs');
const port = 8124;
const filesString = 'FILES';
const good = 'ACK';
const bad = 'DEC';
const logger = fs.createWriteStream('client_id.log');

let seed = 0;
let defaultDir = process.env.DIRECTORY_FOR_SAVING_FILES;
let number = 1;
const server = net.createServer((client) => {
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
        /*if (!err && data !== clientString) {
            writeLog('Client #' + client.id + ' has asked: ' + data + '\n');
            let answer = generateAnswer();
            writeLog('Server answered to Client #' + client.id + ': ' + answer + '\n');
            client.write(answer);*/
        {
            //client.write(bad);
            console.log(data);
            let new_directory = defaultDir.slice(0, -1) + '\\\\' + client.id;
            createNewDirectory(new_directory);
            let newfile = new_directory + '\\' + (number++) + '.txt';
            fs.writeFile(newfile, data , (err) =>
            {
                if (err) console.error(err);
            });
        }
    });
    client.on('end', () => {
        logger.write('Client #' + client.id + ' disconnected');
        console.log('Client disconnected')
    });
});

function createNewDirectory(pathname) {
    fs.access(pathname, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err.code !== 'EEXIST')
            fs.mkdir(pathname, (err) => {});
    });
}

function writeLog(data) {
    logger.write(data);
}

server.listen(port, () => {
    console.log(`Server listening on localhost: ${port}`);
});
