const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song'),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction);
		if (queue.songs.length > 1) {
			distube.skip(interaction.guild);
		}
		else {
			return interaction.editReply('Cannot skip last song of queue.');
		}
		return interaction.editReply('⏭️   Song skipped.');
	},
};