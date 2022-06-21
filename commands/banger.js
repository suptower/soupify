const { SlashCommandBuilder } = require('@discordjs/builders');
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
			16 - Travis Scott
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
		*/
		const vc = interaction.member.voice.channel;
		const bangers = ['https://open.spotify.com/track/3zQpGaH50HeMjxurMZVF6q?si=b8c6bac389cc4296', 'https://open.spotify.com/track/40YcuQysJ0KlGQTeGUosTC?si=11f7ce73ef2f47d4', 'https://open.spotify.com/track/7p7pzSVr2zovan3m1m5hFm?si=4036c3befbfc4703',
			'https://open.spotify.com/track/27OeeYzk6klgBh83TSvGMA?si=41ce51aeecb74185', 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS?si=f942fcb5b09645a8', 'https://open.spotify.com/track/2tpWsVSb9UEmDRxAl1zhX1?si=e8e45ad48d3743e0',
			'https://open.spotify.com/track/2YWjW3wwQIBLNhxWKBQd16?si=33e3ce85e3474654', 'https://open.spotify.com/track/15JINEqzVMv3SvJTAXAKED?si=f71bd049f3754c88', 'https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB?si=3353eb4583e34d77',
			'https://open.spotify.com/track/7fBv7CLKzipRk6EC6TWHOB?si=74e1932347294592', 'https://open.spotify.com/track/3bidbhpOYeV4knp8AIu8Xn?si=6ab62a369a3f4d9a', 'https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h?si=a0251e437f6d4b0f',
			'https://open.spotify.com/track/4QNpBfC0zvjKqPJcyqBy9W?si=33e02274168c4c8e', 'https://open.spotify.com/track/7Ie9W94M7OjPoZVV216Xus?si=b2b63988c48249b8', 'https://open.spotify.com/track/62yJjFtgkhUrXktIoSjgP2?si=e4ae815c4a5942f7',
			'https://open.spotify.com/track/1QnvpPFP4Q3FHbDchqWiWy?si=655e630eea414492', 'https://open.spotify.com/track/0e7ipj03S05BNilyu5bRzt?si=3da76dcce8a44327', 'https://open.spotify.com/track/6gBFPUFcJLzWGx4lenP6h2?si=3144e4fdb8634970',
			'https://open.spotify.com/track/2ZvsMMI4aOkMUo92MKQzFI?si=1c0b8d14eb6c4d01', 'https://open.spotify.com/track/3wPPWcVuinAU7dXcJXtCID?si=3d1aae1849d14aa8', 'https://open.spotify.com/track/5pmL3RzOy3IvGFaSDi4hZL?si=58f9e57354f7455c',
			'https://open.spotify.com/track/4odiyU3myG29Ld0wurMfE8?si=f5b92faccaab4aca', 'https://open.spotify.com/track/5A6OHHy73AR5tLxgTc98zz?si=188ffa4b772a4ede', 'https://open.spotify.com/track/7LP4Es66zdY7CyjepqmvAg?si=cc4f2ad54ccb4f7e',
			'https://open.spotify.com/track/3MOECVkNshqHYTPt5DZcdN?si=b53e1b4586fd4cd8', 'https://open.spotify.com/track/7oVEtyuv9NBmnytsCIsY5I?si=9093a37413134c07', 'https://open.spotify.com/track/7dt6x5M1jzdTEt8oCbisTK?si=3ec42c6eb8ee46e1',
			'https://open.spotify.com/track/14QlvLRILnxyuu31H1AYdo?si=742ec9d02db14e96', 'https://open.spotify.com/track/2DmSZNTa4nMgJAgb16HltC?si=9c46e1ce38a2499c', 'https://open.spotify.com/track/0VgkVdmE4gld66l8iyGjgx?si=db27a5b925f4437e',
			'https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR?si=593f483b89b24f47', 'https://open.spotify.com/track/7ycWLEP1GsNjVvcjawXz3z?si=c3dfcda032de4e29', 'https://open.spotify.com/track/7KXjTSCq5nL1LoYtL7XAwS?si=f8f3747739824159',
			'https://open.spotify.com/track/57vxBYXtHMk6H1aD29V7PU?si=9121495d17794547', 'https://open.spotify.com/track/1MFD6gdVDjFFMM8ItH9ZhI?si=1f7e40251a6b435a', 'https://open.spotify.com/track/2vXKRlJBXyOcvZYTdNeckS?si=0934889725d2425e',
			'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b?si=69a4d155a9b44bf9', 'https://open.spotify.com/track/24Yi9hE78yPEbZ4kxyoXAI?si=53707b2adfcc43a1', 'https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g?si=bb8e119f2d2d48f1',
			'https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20?si=3497c49d4d1e4a57', 'https://open.spotify.com/track/27NovPIUIRrOZoCHxABJwK?si=69383c93e408450c', 'https://open.spotify.com/track/5XRHGXut00SrJUFmcn2lQF?si=f35c2ec21afa4b10',
			'https://open.spotify.com/track/3Fcfwhm8oRrBvBZ8KGhtea?si=1a4ba90e80f7487b', 'https://open.spotify.com/track/5TbzAWWc5eJaANpA9kfGCd?si=9eec993bbf864f98', 'https://open.spotify.com/track/4kLLWz7srcuLKA7Et40PQR?si=81dbda2c23974155',
			'https://open.spotify.com/track/3H7ihDc1dqLriiWXwsc2po?si=be2eb2001e7f4db3', 'https://open.spotify.com/track/5LLRo6dCGxg4PZmtSqNzrZ?si=085c88b2fd6f4dff', 'https://open.spotify.com/track/6jmTHeoWvBaSrwWttr8Xvu?si=e3b272d918ae49f1',
			'https://open.spotify.com/track/2tpWsVSb9UEmDRxAl1zhX1?si=07aa851b65c94381', 'https://open.spotify.com/track/1NhPKVLsHhFUHIOZ32QnS2?si=8ad80bf921044347', 'https://open.spotify.com/track/1j4kHkkpqZRBwE0A4CN4Yv?si=e5a1da0a206540c4'];

		if (amount == null) {
			const rand = Math.floor(Math.random() * (bangers.length));
			const songString = bangers[rand];
			distube.play(vc, songString, {
				member: interaction.member,
				textChannel: interaction.channel,
			});
			return interaction.editReply('💥   Banger added.');
		}
		else {
			const songArray = [];
			for (let i = 0; i < amount; i++) {
				const rand = Math.floor(Math.random() * (bangers.length));
				distube.search(bangers[rand], {
					limit: 1,
				}).then(res => songArray.push(res[0]));
			}
			distube.createCustomPlaylist(songArray, {
				member: interaction.member,
			}).then(playlist => distube.play(vc, playlist, {
				member: interaction.member,
				textChannel: interaction.channel,
			}));
			return interaction.editReply('💥   Bangers added.');
		}
	},
};