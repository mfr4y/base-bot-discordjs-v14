const { Colors, ContainerBuilder, InteractionContextType, SlashCommandBuilder } = require('discord.js');
const { v2 } = require('../../utils/ui');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Afficher la liste des commandes')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

  async execute(interaction) {
    const { client } = interaction;
    const commands = client.commands
      .map(({ data }) => `**/${data.name}**\n-# ${data.description}`)
      .sort()
      .join('\n');

    const container = new ContainerBuilder()
      .setAccentColor(Colors.Blurple)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) =>
            text.setContent(`## Aide\n${client.commands.size} commande(s) disponible(s)`),
          )
          .setThumbnailAccessory((thumbnail) => thumbnail.setURL(client.user.displayAvatarURL())),
      )
      .addSeparatorComponents((separator) => separator.setDivider(true))
      .addTextDisplayComponents((text) => text.setContent(commands));

    await interaction.reply(v2([container], { ephemeral: true }));
  },
};
