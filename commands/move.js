const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move a song from a given position to a new one')
		.addIntegerOption(option =>
			option.setName('old')
				.setDescription('Old position of Song')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('new')
				.setDescription('new Position of Song')
				.setRequired(true)),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guild);
		const oldPos = interaction.options.getInteger('old');
		const newPos = interaction.options.getInteger('new');
		if (!queue) {
			return interaction.editReply('This does only work if there is a queue.');
		}
		else if (oldPos > 0 && oldPos < queue.songs.length) {
			if (newPos > 0 && newPos < queue.songs.length) {
				const elem = queue.songs[oldPos];
				queue.songs.splice(newPos, 0, elem);
				queue.songs.splice(oldPos + 1, 1);
			}
			else {
				return interaction.editReply('The newPosition value was not in accepted range.');
			}
		}
		else {
			return interaction.editReply('The oldPosition value was not in accepted range.');
		}
		return interaction.editReply('🔢   Song moved from `' + oldPos + '` to `' + newPos + '`.');
	},
};