const { version } = require('discord.js');
const pkgver = require ("../../../package.json");

module.exports = (client) => {
  client.user.setPresence({ activities: [{ name: 'test' }], status: 'dnd' });

  const data = `
    - Name: ${client.user.tag}
    - ID: ${client.user.id}
    - Commands : ${client.slash.size}
    - Servers: ${client.guilds.cache.size}
    - Users: ${client.users.cache.size}
    - Version: ${pkgver.version}
    - Discord API Version: v${version}
    - Node Version: ${process.version}
    - Plateform: ${process.platform}`
  client.logger.info(data);
  client.logger.ok(`${client.user.username} est maintenant en ligne.`);
}