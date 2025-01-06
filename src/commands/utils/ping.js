module.exports = {
  name: 'ping',
  description: 'Obtenir la latence du bot',
  dir: "utils",

  run: async (client, interaction) => {
    await interaction.reply({ content: 'Calcul de la latence...' });
    const ping = Math.round(client.ws.ping);
    await interaction.editReply({ content: `Pong ! \`${ping}ms\`` });
  }
}