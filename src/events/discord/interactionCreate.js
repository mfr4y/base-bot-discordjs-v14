const { InteractionType } = require('discord.js');

module.exports = async (client, interaction, message) => {
	if (interaction.type === InteractionType.ApplicationCommand) {
		if (!interaction.guild) return;
		if (!client.slash.has(interaction.commandName)) return;

		try {
			const command = client.slash.get(interaction.commandName)
			command.run(client, interaction, message);
			client.logger.info(`Commande ${interaction.commandName} utilisée par ${interaction.member.user.tag}`)
		}
		catch (e) {
			client.logger.error(e);
			await interaction.reply({ content: '**Une erreur est survenue lors de l\'exécution de la commande. Merci de réessayer plus tard.**', ephemeral: true });
		}
	}
};
