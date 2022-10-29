const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Toggle autoplay on/off'),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const mode = distube.toggleAutoplay(interaction.guild);
		return interaction.editReply('🎶   Set autoplay mode to `' + (mode ? 'On' : 'Off') + '`');
	},
};