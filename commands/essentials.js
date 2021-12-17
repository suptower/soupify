const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('essentials')
		.setDescription('Plays Essentials 2010 playlist'),
	async execute(interaction, distube) {
        await interaction.deferReply();
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be connected to a voice channel.");
        }
        const vc = interaction.member.voice.channel;
        const songString = "https://open.spotify.com/playlist/1FQypuz87kt9ICJi64CjHq?si=2a03feeb2f8c4cd5";
        const queue = distube.getQueue(interaction.guild);
        distube.playVoiceChannel(vc,songString,{
            member: interaction.member,
            textChannel: interaction.channel,
        });
        return await interaction.editReply("<:essentials:921394784915050516>   Successfully added `APACHE BLEIBT GLEICH` to the queue.");
	},
};