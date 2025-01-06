global.__basedir = __dirname;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { readdir } = require('fs').promises;
const path = require('path');
const config = require('./config.json');

if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Please update Node on your system.");

const client = new Client({
  allowedMentions: {
    parse: ['users', 'roles']
  },
  fetchAllMembers: true,
  intents: [GatewayIntentBits.AutoModerationConfiguration,
  GatewayIntentBits.AutoModerationExecution,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildExpressions,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildScheduledEvents,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent
  ],
});

client.slash = new Collection();

client.logger = require('./src/utils/logger');

console.clear()
client.logger.loading(`Initialisation...`);

async function loadHandlers(client, directory) {
  const handlerFiles = await readdir(path.join(__dirname, directory));
  const handlerModules = handlerFiles.filter(file => file.endsWith('.js'));
  for (const file of handlerModules) {
    const handler = require(path.join(__dirname, directory, file));
    handler(client);
  }
}

loadHandlers(client, './src/utils/handlers');
require('./slashCommands.js');

client.login(config.token);

process.on("unhandledRejection", (err, reason, p) => {
  client.logger.error(err, reason, p);
});

process.on("uncaughtException", (err, origin) => {
  client.logger.error(err, origin);
});