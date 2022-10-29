const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rave')
		.setDescription('Plays RAVE AVENUE playlist'),
	async execute(interaction, distube) {
		await interaction.deferReply();
		if (!interaction.member.voice.channel) {
			return interaction.editReply('You need to be connected to a voice channel.');
		}
		const InfoEmbed = new EmbedBuilder()
			.setColor('#c20808')
			.setTitle('RAVE AVENUE')
			.setThumbnail('https://i.imgur.com/yt5xTXJ.jpg')
			.setDescription('A playlist by suptower, starting that rave ASAP.')
			.addFields(
				{ name: 'Author', value: 'https://spoti.fi/3yz6Wdg' },
				{ name: 'Playlist', value: 'https://spoti.fi/3TSgAla' },
			);
		const vc = interaction.member.voice.channel;
		const songString = 'https://open.spotify.com/playlist/79gyv8Wdrdrujk2NgFfIBS?si=e7386ea3903841a1';
		distube.play(vc, songString, {
			member: interaction.member,
			textChannel: interaction.channel,
		});
		interaction.channel.send({ embeds: [InfoEmbed] });
		return await interaction.editReply('<:raveavenue:1035960856862806106>   Successfully added `RAVE AVENUE` to the queue.');
	},
};