const {
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ContainerBuilder,
  InteractionContextType,
  SeparatorSpacingSize,
  SlashCommandBuilder,
} = require('discord.js');
const { v2 } = require('../../utils/ui');

function render(client, roundTrip) {
  const websocket = client.ws.ping < 0 ? '…' : `${client.ws.ping}ms`;

  return new ContainerBuilder()
    .setAccentColor(Colors.Blurple)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) => text.setContent("## Pong !\n-# Latence mesurée à l'instant"))
        .setThumbnailAccessory((thumbnail) => thumbnail.setURL(client.user.displayAvatarURL())),
    )
    .addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents((text) =>
      text.setContent(`**WebSocket** \`${websocket}\`\n**Aller-retour** \`${roundTrip}\``),
    )
    .addActionRowComponents((row) =>
      row.setComponents(
        new ButtonBuilder().setCustomId('ping:refresh').setLabel('Rafraîchir').setStyle(ButtonStyle.Secondary),
      ),
    );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Obtenir la latence du bot')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

  async execute(interaction) {
    const { resource } = await interaction.reply({ ...v2([render(interaction.client, '…')]), withResponse: true });
    const roundTrip = resource.message.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(v2([render(interaction.client, `${roundTrip}ms`)]));
  },

  async component(interaction) {
    const roundTrip = Date.now() - interaction.createdTimestamp;
    await interaction.update(v2([render(interaction.client, `${roundTrip}ms`)]));
  },
};
