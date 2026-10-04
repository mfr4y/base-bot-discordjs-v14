const fs = require('node:fs');
const path = require('node:path');
const { inspect, styleText } = require('node:util');

const directory = path.join(__dirname, '..', '..', 'logs');
fs.mkdirSync(directory, { recursive: true });

const files = {
  full: fs.createWriteStream(path.join(directory, 'full.log'), { flags: 'a' }),
  error: fs.createWriteStream(path.join(directory, 'error.log'), { flags: 'a' }),
};

const timestamp = () => new Date().toLocaleString('fr-FR');
const format = (value) => (typeof value === 'string' ? value : inspect(value, { depth: 4 }));

function level(tag, color, targets = ['full']) {
  return (...values) => {
    const time = timestamp();
    const message = values.map(format).join(' ');
    console.log(`${styleText('gray', time)} ${styleText([color, 'black'], ` ${tag} `)} ${message}`);
    for (const target of targets) files[target].write(`${time} [${tag}] ${message}\n`);
  };
}

module.exports = {
  info: level('INFO', 'bgCyan'),
  loading: level('LOADING', 'bgBlue'),
  success: level('OK', 'bgGreen'),
  warn: level('WARN', 'bgYellow'),
  error: level('ERROR', 'bgRed', ['full', 'error']),
};
