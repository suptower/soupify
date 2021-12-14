const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Allows you to stream music from YouTube, Spotify and Soundcloud')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Play a track')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('Song title or direct link')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
                subcommand
                    .setName('pause')
                    .setDescription('Pause the player')),
	async execute(interaction) {
        await interaction.deferReply();
        return interaction.editReply("Test");
	},
};