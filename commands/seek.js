const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Fast forward (for positive values) or fast rewind (for negative values) in seconds')
		.addIntegerOption(option =>
			option.setName('time')
				.setDescription('in seconds')
				.setRequired(true)),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guild);
		const toSeek = interaction.options.getInteger('time');
		const newTime = queue.currentTime + toSeek;
		if (!queue) {
			return interaction.editReply('This does only work if there is a queue.');
		}
		else if (newTime > 0) {
			if (newTime < queue.songs[0].duration) {
				distube.seek(interaction.guild, newTime);
			}
			else {
				return interaction.editReply('This operation would have resulted into skipping the current song.');
			}
		}
		else {
			return interaction.editReply('You are not able to rewind beyond the start of the current song.');
		}
		if (toSeek >= 0) {
			return interaction.editReply('⏩   Fast forwarded by `' + toSeek + ' seconds`.');
		}
		else {
			return interaction.editReply('⏪   Fast rewound by `' + toSeek + ' seconds`.');
		}

	},
};