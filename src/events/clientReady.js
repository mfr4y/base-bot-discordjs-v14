const { ActivityType, Events, version: discordVersion } = require('discord.js');
const { version } = require('../../package.json');
const logger = require('../utils/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setPresence({ activities: [{ type: ActivityType.Custom, name: 'custom', state: '/help' }] });

    logger.info(
      [
        `Nom : ${client.user.username}`,
        `ID : ${client.user.id}`,
        `Commandes : ${client.commands.size}`,
        `Serveurs : ${client.guilds.cache.size}`,
        `Version : ${version}`,
        `discord.js : v${discordVersion}`,
        `Node.js : ${process.version}`,
        `Plateforme : ${process.platform}`,
      ].join('\n'),
    );
    logger.success(`${client.user.username} est en ligne`);
  },
};
