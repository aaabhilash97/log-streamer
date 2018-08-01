const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');

const parser = new ArgumentParser({
    version: version,
    addHelp: true,
    description: 'Log streamer'
});
parser.addArgument(
    ['-u', '--username'],
    {
        help: 'Username to connect',
        required: true
    }
);
parser.addArgument(
    ['-p', '--password'],
    {
        help: 'password to connect',
        required: true
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
        help: 'file to stream',
        required: true
    }
);

const args = parser.parseArgs();
module.exports = args;