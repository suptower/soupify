const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song'),
	async execute(interaction, distube) {
        await interaction.deferReply();
        distube.skip(interaction.guild);
        return interaction.editReply("⏭️   Song skipped.");
	},
};