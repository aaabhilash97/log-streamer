let SUBSCRIPTIONS;
try {
    SUBSCRIPTIONS = require('./subscriptions.js');
} catch (exception) {
    console.error('Failed to import subscriptions.js', exception);
    console.log('Subscription format is : ', {
        'app': {
            file: '/path/log.log',
            count: 0
        }
    });
    process.exit(1);
}

const querystring = require('querystring');
const { Tail } = require('tail');
const url = require('url');
const WebSocket = require('ws');


function init({ server, authenticate }) {
    //initialize the WebSocket server instance
    const wss = new WebSocket.Server({
        server,
        verifyClient: async function (info, cb) {
            const S = '[verifyClient]';
            try {
                const parsedUrl = url.parse(info.origin);
                const urlPath = info.req.url || '';
                const query = querystring.parse(urlPath.replace(/\/.+\?/, ''));
                const password = query.password;
                const username = query.username;
                if (await authenticate({ username, password, hostname: parsedUrl.hostname })) {
                    return cb(true);
                } else {
                    return cb(false, 401, 'Unauthorized');
                }
            } catch (exception) {
                console.log(`${S} Some error occured: `, exception);
                return cb(false, 500, 'InternalServerError');
            }
        }
    });

    wss.on('connection', (ws, req) => {
        console.log('connection established: ');
        let urlPath = req.url || '';
        const query = querystring.parse(urlPath.replace(/\/.+\?/, ''));
        const username = query.username;
        const sub = query.sub;
        ws.username = username;
        ws.sub = sub;

        process.nextTick(() => {
            subscribe(sub);
        });
        try {
            ws.send('Connected to log-streamer');
        } catch (exception) {
            console.error('Client disconnected immediately');
        }

        ws.on('close', function () {
            console.log('Connection cloesd:', username);
            try {
                if (SUBSCRIPTIONS[sub].count > 0) SUBSCRIPTIONS[sub].count--;
                if (SUBSCRIPTIONS[sub].count <= 0) {
                    SUBSCRIPTIONS[sub]['descriptor'] && SUBSCRIPTIONS[sub]['descriptor'].unwatch();
                    delete SUBSCRIPTIONS[sub]['descriptor'];
                    console.log('Connection close Unsubscribing : ', sub);
                }
            } catch (exception) {
                console.error('connection close: ', exception);
            }
        });
    });


    function subscribe(sub) {
        const S = '[subscribe]';
        try {
            if (SUBSCRIPTIONS[sub]['descriptor']) {
                SUBSCRIPTIONS[sub]['count']++;
                return;
            }
            let tail = new Tail(SUBSCRIPTIONS[sub].file);
            tail.on("line", function (data) {
                publish(sub, data);
            });
            tail.on("error", function (error) {
                console.log('ERROR: ', error);
            });
            SUBSCRIPTIONS[sub]['count']++;
            SUBSCRIPTIONS[sub]['descriptor'] = tail;
            console.log(`${S} file sunscribed: `, SUBSCRIPTIONS[sub].file);
        } catch (exception) {
            console.log(`${S} Some error occured: `, exception);
        }
    }


    function publish(sub, data) {
        const S = '[publish]';
        wss.clients.forEach((client) => {
            if (client.sub === sub) {
                try {
                    client.send(data);
                } catch (exception) {
                    console.log(`${S} Some error occured: `, exception);
                }
            }
        });
    }

    return {
        publish,
        subscribe
    };
}


module.exports = init;
