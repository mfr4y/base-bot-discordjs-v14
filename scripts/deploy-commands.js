const { REST, Routes } = require('discord.js');
const { env } = require('../src/config');
const loadCommands = require('../src/handlers/commands');
const logger = require('../src/utils/logger');

async function deploy() {
  const clientId = env('CLIENT_ID');
  const guildId = env('DEV_GUILD_ID', { required: false });
  const body = (await loadCommands()).map((command) => command.data.toJSON());
  const rest = new REST().setToken(env('DISCORD_TOKEN'));
  const route = guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);
  const target = guildId ? `sur le serveur ${guildId}` : 'globalement';

  logger.loading(`Déploiement de ${body.length} commande(s) ${target}...`);
  const deployed = await rest.put(route, { body });
  logger.success(`${deployed.length} commande(s) déployée(s) ${target}`);
}

deploy().catch((error) => {
  logger.error(error);
  process.exitCode = 1;
});
