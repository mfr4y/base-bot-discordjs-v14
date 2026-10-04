const { Events } = require('discord.js');
const logger = require('../utils/logger');
const { errorReply } = require('../utils/ui');

function route(interaction) {
  if (interaction.isChatInputCommand()) return [interaction.commandName, 'execute'];
  if (interaction.isMessageComponent()) return [interaction.customId.split(':')[0], 'component'];
  if (interaction.isModalSubmit()) return [interaction.customId.split(':')[0], 'modal'];
  return [];
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const [name, method] = route(interaction);
    const command = interaction.client.commands.get(name);
    if (typeof command?.[method] !== 'function') return;

    try {
      await command[method](interaction);
      if (method === 'execute') logger.info(`/${name} utilisée par ${interaction.user.username}`);
    } catch (error) {
      logger.error(error);
      const payload = errorReply('Une erreur est survenue. Réessaie dans quelques instants.');
      const send =
        interaction.replied || interaction.deferred ? interaction.followUp(payload) : interaction.reply(payload);
      await send.catch((replyError) => logger.error(replyError));
    }
  },
};
