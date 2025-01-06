const path = require('path');
const fs = require('fs');
const colors = require('colors/safe');

const logFilePath = path.join(__basedir, 'logs/full.log');
const errorFilePath = path.join(__basedir, 'logs/error.log');

if (!fs.existsSync(logFilePath)) fs.writeFileSync(logFilePath, '');
if (!fs.existsSync(errorFilePath)) fs.writeFileSync(errorFilePath, '');

const logToFile = (filePath, tag, message) => {
  const logMessage = `${getTimestamp()} [${tag}] : ${message}\n`;
  fs.appendFileSync(filePath, logMessage);
};

const logger = {
  info: (message) => {
    const tag = 'INFO';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgCyan(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
  command: (message) => {
    const tag = 'COMMAND';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgBrightMagenta(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
  error: (message) => {
    const tag = 'ERROR';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgBrightRed(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(errorFilePath, tag, message);
  },
  loading: (message) => {
    const tag = 'LOADING';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgBlue(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
  warn: (message) => {
    const tag = 'WARN';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgBrightYellow(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
  cron: (message) => {
    const tag = 'CRON';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgBlue(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
  ok: (message) => {
    const tag = 'LOADED';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgGreen(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
  server: (message) => {
    const tag = 'SERVER';
    const formattedMessage = `${colors.gray(getTimestamp())} ${colors.bgWhite(`[${tag}]`)} : ${message}`;
    console.log(formattedMessage);
    logToFile(logFilePath, tag, message);
  },
};

function getTimestamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

module.exports = logger;
