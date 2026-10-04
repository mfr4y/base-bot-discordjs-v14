const { readdir } = require('node:fs/promises');
const path = require('node:path');

const directory = path.join(__dirname, '..', 'commands');

async function loadCommands() {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  const commands = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const command = require(path.join(entry.parentPath, entry.name));
    if (!command.data || typeof command.execute !== 'function') {
      throw new Error(`La commande ${entry.name} doit exporter "data" et "execute"`);
    }
    commands.push(command);
  }

  return commands;
}

module.exports = loadCommands;
