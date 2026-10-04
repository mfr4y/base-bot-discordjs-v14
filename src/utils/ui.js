const { Colors, ContainerBuilder, MessageFlags } = require('discord.js');

function v2(components, { ephemeral = false } = {}) {
  const flags = ephemeral ? MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral : MessageFlags.IsComponentsV2;
  return { components, flags };
}

function notice(color, title, description) {
  return new ContainerBuilder()
    .setAccentColor(color)
    .addTextDisplayComponents((text) => text.setContent(`### ${title}\n${description}`));
}

function errorReply(description) {
  return v2([notice(Colors.Red, 'Erreur', description)], { ephemeral: true });
}

module.exports = { v2, notice, errorReply };
