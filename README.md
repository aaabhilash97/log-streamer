# Log Viewer

Log Viewer is a Node.js application for viewing server logs in the browser console.

## Prerequisite

```md
    Node.js version >= 8.x.x
```

## Quick Start

```javascript
    git clone https://github.com/aaabhilash97/log-streamer.git
    npm install
    npm start -- -u user -p pass -f /var/log/nginx/access.log -P 3005
```

Open `http://localhost:3005/stream/logs` in your browser and open `Developer tools`.
In `Dev tool console` type `connect("user", "pass", "app")`. This will establish the websocket connection. And start to print logs in console.
![Drag Racing](https://preview.ibb.co/fBDfae/Log_streamer.jpg)

## Usage

```usage
usage: app.js [-h] [-v] [-u USERNAME] [-p PASSWORD] [-P PORT] [-o ORIGIN]
              [-f FILE]
Log streamer

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -u USERNAME, --username USERNAME
                        Username to connect
  -p PASSWORD, --password PASSWORD
                        password to connect
  -P PORT, --port PORT  Port to listen
  -o ORIGIN, --origin ORIGIN
                        Allowed origin
  -f FILE, --file FILE  file to stream
```
