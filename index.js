const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { env } = require('./src/config');
const loadCommands = require('./src/handlers/commands');
const loadEvents = require('./src/handlers/events');
const logger = require('./src/utils/logger');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: ['users'] },
});

client.commands = new Collection();

process.on('unhandledRejection', (error) => logger.error(error));
process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});

async function start() {
  logger.loading('Initialisation...');

  for (const command of await loadCommands()) client.commands.set(command.data.name, command);
  logger.success(`${client.commands.size} commande(s) chargée(s)`);

  const events = await loadEvents(client);
  logger.success(`${events} événement(s) chargé(s)`);

  await client.login(env('DISCORD_TOKEN'));
}

start().catch(async (error) => {
  logger.error(error);
  await client.destroy();
  process.exitCode = 1;
});
