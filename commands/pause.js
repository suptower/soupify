const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the player'),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guild);
		if (queue.paused) {
			return interaction.editReply('The player is already paused.');
		}
		distube.pause(interaction.guild);
		return interaction.editReply('⏸️   Player paused.');
	},
};