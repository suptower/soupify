const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('banger')
		.setDescription('Plays a random banger song.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Create a playlist of bangers by specifying the amount of songs you want to add.')
				.setRequired(false)),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const amount = interaction.options.getInteger('amount');
		let reply = '';
		/* BANGERS
			0 - Swedish House Mafia - Lifetime
			1 - G-Eazy - Me, Myself & I
			2 - Travis Scott - Sky Fall
			3 - The Kid LAROI - WITHOUT YOU
			4 - Bruno Mars - Uptown Funk
			5 - Major Lazer - Lean On
			6 - Eminem - Love The Way You Lie
			7 - The Weeknd - Starboy
			8 - The Weeknd - The Hills
			9 - Macklemore - Can't Hold Us
			10 - Travis Scott - SICKO MODE
			11 - Pitbull - Give Me Everything
			12 - Eminem - Not Afraid
			13 - Imagine Dragons - Radioactive
			14 - B.o.B - Airplanes
			15 - Post Malone - rockstar
			16 - Travis Scott - goosebumps
			17 - Kwabs - Walk
			18 - Naughty Boy - La La La
			19 - Taio Cruz - Hangover
			20 - Sean Paul - She Doesn't Mind
			21 - Wiz Khalifa - Black and Yellow
			22 - Jay Sean - Down
			23 - Deorro - Five More Hours
			24 - Linkin Park - BURN IT DOWN
			25 - Post Malone - Better Now
			26 - DJ Antoine - Welcome to St. Tropez
			27 - Linkin Park - CASTLE OF GLASS
			28 - Future - Mask Off
			29 - Juice WRLD - Lucid Dreams
			30 - A$AP Rocky - Praise The Lord (Da Shine)
			31 - Kendrick Lamar - HUMBLE
			32 - The Weeknd - Heartless
			33 - Macklemore - White Whalls
			34 - The Weeknd - Lost in the Fire
			35 - The Weeknd - Blinding Lights
			36 - SAINt JHN - Roses (Imanbek Remix)
			37 - The Weeknd - Save Your Tears
			38 - The Kid LAROI - STAY
			39 - Lil Nas X - INDUSTRY BABY
			40 - OneRepublic - All The Right Moves
			41 - Coldplay - Viva La Vida
			42 - John Newman - Love Me Again
			43 - Black Eyed Peas - I Gotta Feeling
			44 - Topic - Breaking Me
			45 - Rag'n'Bone Man - Human
			46 - G-Eazy - I Mean It
			47 - One Republic - Counting Stars
			48 - One Republic - Secrets
			49 - ZAYN, Sia - Dusk Till Dawn
			50 - Alex Johrdal - Til the Lights go out
			51 - Russ - Pull the Trigger
			52 - Logic - Ballin
			53 - Bazanji - Fed Up
			54 - Glass Animals - Heat Waves
			55 - Nathan Dawe x Ella Henderson - 21 Reasons
			56 - Harry Styles - As it was
			57 - Jack Harlow - First Class
			58 - The Weeknd - Sacrifice
			59 - The Weeknd - Moth to a flame
		*/
		const vc = interaction.member.voice.channel;
		const bangers = ['https://youtu.be/IEXQS0Idz3k', 'https://youtu.be/K533gW3boIY',
			'https://youtu.be/cFn8jpidI24', 'https://youtu.be/T-578RNysss',
			'https://youtu.be/7Ya2U8XN_Zw', 'https://youtu.be/1nwfaHk6ZKc',
			'https://youtu.be/pl7-7fmYVUM', 'https://youtu.be/Ibpsqddlfdg',
			'https://youtu.be/zKKOH1yiBOc', 'https://youtu.be/zLxXqEZ5OoA',
			'https://youtu.be/d-JBBNg8YKs', 'https://youtu.be/VLGbfEf7o7c',
			'https://youtu.be/ohNsldmyVRE', 'https://youtu.be/CAEUnn0HNLM',
			'https://youtu.be/Z6wdGCO3Utc', 'https://youtu.be/4GFAZBKZVJY',
			'https://youtu.be/8MvGyEb43-M', 'https://youtu.be/TW9uj83Vq-0',
			'https://youtu.be/tM5xhFs5HHk', 'https://youtu.be/xpX2vf-VqkI',
			'https://youtu.be/jtggDm-5zSk', 'https://youtu.be/YRdRhn1xZ20',
			'https://youtu.be/UQ9e6XyQWr4', 'https://youtu.be/yV8tm-ZPdpE',
			'https://youtu.be/zgEKLhvCCVA', 'https://youtu.be/Oggrsg4jZPM',
			'https://youtu.be/Kh2FRFhS7QY', 'https://youtu.be/D3MB_EkNV5Y',
			'https://youtu.be/-YVlgXN7spw', 'https://youtu.be/VTG-ForqDk4',
			'https://youtu.be/_eDpH4hMW1o', 'https://youtu.be/ov4WobPqoSA',
			'https://youtu.be/-uj9b9JCIJM', 'https://youtu.be/B0ET14JfjGI',
			'https://youtu.be/rI51vRpTYyU', 'https://youtu.be/fHI8X4OXluQ',
			'https://youtu.be/ele2DMU49Jk', 'https://youtu.be/u6lihZAcy4s',
			'https://youtu.be/rkYlZnIbe2E', 'https://youtu.be/eg-AwKRUFec',
			'https://youtu.be/RuPm04f9BUk', 'https://youtu.be/MY4eEOB1wSI',
			'https://youtu.be/JWzag7a9afU', 'https://youtu.be/CwdrtwZiQ9E',
			'https://youtu.be/TLZg0o_HTEA', 'https://youtu.be/kh5snpi8bMk',
			'https://youtu.be/4MjSoquXAZ4', 'https://youtu.be/4WgWGcED0JQ',
			'https://youtu.be/1ebW7okoIok', 'https://youtu.be/eNd4tt9raeg',
			'https://youtu.be/FPAhrshC-aA', 'https://youtu.be/Tl9U0qiFQzM',
			'https://youtu.be/nT04upwfsiI', 'https://youtu.be/9-zK_5gn4_s',
			'https://youtu.be/WgiWUnJqy3k', 'https://youtu.be/TfbK_sCRapM',
			'https://youtu.be/V1Z586zoeeE', 'https://youtu.be/QKW_EEDt2FE',
			'https://youtu.be/E6zblNbGXA4', 'https://youtu.be/WbzmQcFLPE8'];

		if (amount == null) {
			const rand = Math.floor(Math.random() * (bangers.length));
			const songString = bangers[rand];
			distube.play(vc, songString, {
				member: interaction.member,
				textChannel: interaction.channel,
			});
			reply = '💥   Banger added.';
		}
		else {
			const songArray = [];
			if (amount < bangers.length) {
				for (let i = 0; i < amount; i++) {
					const rand = Math.floor(Math.random() * (bangers.length));
					songArray.push(bangers[rand]);
					bangers.splice(rand, 1);
				}
				distube.createCustomPlaylist(songArray, {
					member: interaction.member,
				}).then(playlist => distube.play(vc, playlist, {
					member: interaction.member,
					textChannel: interaction.channel,
				}));
				reply = '💥   ' + amount + ' Bangers added.';
			}
			else {
				distube.createCustomPlaylist(bangers, {
					member: interaction.member,
				}).then(playlist => distube.play(vc, playlist, {
					member: interaction.member,
					textChannel: interaction.channel,
				}));
				reply = '💥   All bangers added.';
			}
		}
		return await interaction.editReply(reply);
	},
};