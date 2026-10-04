const {
  Colors,
  ContainerBuilder,
  InteractionContextType,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputStyle,
} = require('discord.js');
const { env } = require('../../config');
const { notice, v2 } = require('../../utils/ui');

const categories = {
  bug: 'Bug',
  idea: 'Suggestion',
  other: 'Autre',
};

const modal = new ModalBuilder()
  .setCustomId('feedback:submit')
  .setTitle('Envoyer un avis')
  .addLabelComponents(
    (label) =>
      label.setLabel('Catégorie').setRadioGroupComponent((group) =>
        group
          .setCustomId('category')
          .setRequired(true)
          .setOptions(Object.entries(categories).map(([value, name]) => ({ value, label: name }))),
      ),
    (label) =>
      label
        .setLabel('Message')
        .setDescription('Décris ton retour en quelques phrases')
        .setTextInputComponent((input) =>
          input.setCustomId('message').setStyle(TextInputStyle.Paragraph).setMinLength(10).setMaxLength(1000),
        ),
    (label) =>
      label
        .setLabel("Capture d'écran")
        .setDescription('Facultatif')
        .setFileUploadComponent((upload) => upload.setCustomId('attachments').setRequired(false).setMaxValues(3)),
  );

function report(interaction) {
  const { fields, user } = interaction;
  const category = categories[fields.getRadioGroup('category', true)];
  const attachments = fields.getUploadedFiles('attachments') ?? new Map();
  const images = [...attachments.values()].filter((file) => file.contentType?.startsWith('image/'));

  const container = new ContainerBuilder().setAccentColor(Colors.Blurple).addSectionComponents((section) =>
    section
      .addTextDisplayComponents(
        (text) => text.setContent(`### ${category}\n${fields.getTextInputValue('message')}`),
        (text) => text.setContent(`-# ${user.username} · ${user.id} · <t:${Math.floor(Date.now() / 1000)}:f>`),
      )
      .setThumbnailAccessory((thumbnail) => thumbnail.setURL(user.displayAvatarURL())),
  );

  if (images.length) {
    container.addMediaGalleryComponents((gallery) =>
      gallery.addItems(images.map((image) => (item) => item.setURL(image.url).setDescription(image.name))),
    );
  }

  return container;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription("Envoyer un avis à l'équipe du bot")
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

  async execute(interaction) {
    await interaction.showModal(modal);
  },

  async modal(interaction) {
    const summary = report(interaction);
    const channelId = env('FEEDBACK_CHANNEL_ID', { required: false });

    if (channelId) {
      const channel = await interaction.client.channels.fetch(channelId);
      if (!channel?.isSendable()) throw new Error(`Le salon ${channelId} est introuvable ou inaccessible`);
      await channel.send({ ...v2([summary]), allowedMentions: { parse: [] } });
    }

    const confirmation = notice(Colors.Green, 'Merci !', 'Ton avis a bien été envoyé.');
    await interaction.reply(v2([confirmation, summary], { ephemeral: true }));
  },
};
