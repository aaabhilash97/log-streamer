const { ArgumentParser } = require('argparse');
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Log streamer'
});
parser.addArgument(
    ['-u', '--username'],
    {
        help: 'Username to connect'
    }
);
parser.addArgument(
    ['-p', '--password'],
    {
        help: 'password to connect'
    }
);

parser.addArgument(
    ['-P', '--port'],
    {
        help: 'Port to listen',
        type: 'int'
    }
);

parser.addArgument(
    ['-o', '--origin'],
    {
        help: 'Allowed origin'
    }
);

parser.addArgument(
    ['-f', '--file'],
    {
        help: 'file to stream'
    }
);

const args = parser.parseArgs();
module.exports = args;