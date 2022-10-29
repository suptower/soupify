const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop the current song/queue or disable the loop.')
		.addStringOption(option =>
			option.setName('mode')
				.setDescription('Specify your loop mode')
				.setRequired(true)
				.addChoices(
					{ name: 'Queue', value: '1' },
					{ name: 'Song', value: '2' },
					{ name: 'Off', value: '3' },
				)),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const str = interaction.options.getString('mode');
		const mode = parseInt(str);
		if (mode == 1) {
			distube.setRepeatMode(interaction.guild, 1);
			return interaction.editReply('🔂   Looping current song now.');
		}
		else if (mode == 2) {
			distube.setRepeatMode(interaction.guild, 2);
			return interaction.editReply('🔂   Looping queue now.');
		}
		else {
			distube.setRepeatMode(interaction.guild, 0);
			return interaction.editReply('🔁   Looping disabled.');
		}
	},
};