let N = process.argv[2];
const exec = require('child_process').exec;

for ( ;N>0;N--) {
    console.log(`number:\n ${N}`);
    exec('node client-files.js \etc', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`________________________:\n ${stdout}`);
    });
}