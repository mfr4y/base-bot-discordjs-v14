const { readdir } = require('node:fs/promises');
const path = require('node:path');
const logger = require('../utils/logger');

const directory = path.join(__dirname, '..', 'events');

async function loadEvents(client) {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(directory, file));
    const listener = async (...args) => {
      try {
        await event.execute(...args);
      } catch (error) {
        logger.error(error);
      }
    };
    client[event.once ? 'once' : 'on'](event.name, listener);
  }

  return files.length;
}

module.exports = loadEvents;
