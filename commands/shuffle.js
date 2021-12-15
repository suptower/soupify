const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffle songs in queue.'),
	async execute(interaction, distube) {
        await interaction.deferReply();
        distube.shuffle(interaction.guild);
        return interaction.editReply("🔀   Queue shuffled.");
	},
};