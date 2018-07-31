//Parse commandline arguments
const args = require('./argparser.js');
const streamer = require('./streamer.js');

const express = require('express');
const http = require('http');
const helmet = require('helmet');

// Import authenticator
let authenticator;
try {
    authenticator = require('./authenticator.js');
} catch (exception) {
    console.warn('No authenticator found, default authenticator will be using', exception);
}

// Init express.app
const app = express();
app.set('port', args.port || process.env.PORT || 3005);
app.use(helmet());

//initialize a simple http server
const server = http.createServer(app);

app.use(function (req, res, next) {
    if (args.origin) {
        res.setHeader('Access-Control-Allow-Origin', args.origin);
    }
    next();
});

//Serve html page
app.get('/stream/logs', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


function default_authenticator({ username, password, hostname }) {
    return new Promise((resolve) => {
        process.nextTick(() => {
            if (args.username !== username || args.password !== password || (args.origin && !hostname.includes(args.origin))) {
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

//initialize the WebSocket server instance
streamer({ server, authenticate: authenticator || default_authenticator });

//start our server
server.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')} :)`);
});