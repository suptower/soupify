// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const DisTube = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
// const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// const Version = json.version;


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

let idle = 0;

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const distube = new DisTube.default(client, {
	searchSongs: 1,
	searchCooldown: 5,
	leaveOnEmpty: true,
	emptyCooldown: 10,
	leaveOnFinish: false,
	leaveOnStop: true,
	youtubeCookie: 'VISITOR_INFO1_LIVE=4P0ua1yo-_c; CONSENT=YES+srp.gws-20210603-0-RC2.de+FX+446; HSID=Atf-2YUyS7qIK6_B0; SSID=AC2gDiAfvsVfNBYJv; APISID=67A69AHmvAeVJCWd/AThqPf_VgM07oVJpl; SAPISID=GktgMtRDoBZg_ims/ApLMKHCU15rtdp1CN; __Secure-3PAPISID=GktgMtRDoBZg_ims/ApLMKHCU15rtdp1CN; __Secure-1PAPISID=GktgMtRDoBZg_ims/ApLMKHCU15rtdp1CN; LOGIN_INFO=AFmmF2swRAIgDEehWGWE_A_3i8xa7cC8ufZS3n9c-VTrL7Gw_eG2WKkCIAn0MRPxUH4RPnjBE3KU1hh8UsiROJQxmH0P3pLbD2a1:QUQ3MjNmd2ZsdDBGYVBfZldMdVFPNlNoZWE5Mm1YRXdSLWs3QUpjM0FDOGFIWGNJbm8wVFktNU1TRU1MNnEyNlA5N0F5bFFiWEUyOFJaMXg2dW9Qd3lfeXVIYnAzM1dMR05udEd6UElfYVExN1Z6bkhlc0JRZkQ1eEdFREJWSFhLcC1DSE1EdG1ZQ1VHeXoxZG5YTW5DSHBMSVVfOWowcDV1aFdyckVTVWREME94czNxQ2h3aTl5ZHozWVRBb2JrbTU1WmZrRU5GRHlXN2x1NGdpUUhNakwxSTRkSDJvOXlZUQ==; SID=FghkNqkHGmsRT-3b-3bEiXN8ICMnBz7EqKJn0LeIlOPu3wjFB8Wj6AVa-tpbPUKCjdXpDw.; __Secure-1PSID=FghkNqkHGmsRT-3b-3bEiXN8ICMnBz7EqKJn0LeIlOPu3wjFIlMl9iXJctSjb04sfnQWTg.; __Secure-3PSID=FghkNqkHGmsRT-3b-3bEiXN8ICMnBz7EqKJn0LeIlOPu3wjFudOU96tekXGviuFJ-iwMBg.; PREF=tz=Europe.Berlin&volume=100&f6=40000000&f5=20000; YSC=x1cIfzgGv9U; SIDCC=AJi4QfH4QH7jgN1Oni2cLsIjilgsR0QloDAMQXLFi79inE8iLAE_t7eJtfzfZnakqCf-3A--bbjY; __Secure-3PSIDCC=AJi4QfF24WAMQI12NOGWeUB43w28CHU8fvC0WIlIwXlkjV7yqeJ13vhlT-JQnBIWo8JPnUTTJq4',
	plugins: [new SoundCloudPlugin(), new SpotifyPlugin({
		emitEventsAfterFetching: true,
	})],
});

distube.on('playSong', (queue, song) => {
	idle = 0;
	const playEmbed = new MessageEmbed()
		.setColor('#1db954')
		.setTitle('▶️   Now playing')
		.addFields(
			{ name: 'Title', value: `${song.name}`, inline: true },
			{ name: 'Duration', value: `${song.formattedDuration}`, inline: true },
		);
	queue.textChannel.send({ embeds: [playEmbed] });
});

distube.on('addSong', (queue, song) => {
	idle = 0;
	queue.textChannel.send(`🆕   Added \`${song.name}\` - \`(${song.formattedDuration})\` to the queue (requested by \`${song.member.displayName}\`) [${song.source}]`);
});

distube.on('addList', (queue, list) => {
	idle = 0;
	if (list.songs.length == 1) {
		queue.textChannel.send(`🆕   Added playlist \`[${list.songs.length} song]\` to the queue (requested by \`${list.songs[0].member.displayName}\`) [${list.source}]`);
	}
	else {
		queue.textChannel.send(`🆕   Added playlist \`[${list.songs.length} songs]\` to the queue (requested by \`${list.songs[0].member.displayName}\`) [${list.source}]}`);
	}

});

distube.on('finish', (queue) => {
	idle++;
	const firstInterval = setInterval(function() {
		if (idle == 0) {
			clearInterval(firstInterval);
		}
		idle++;
		console.log(idle);
		if (idle == 20) {
			queue.textChannel.send('The bot has left the channel due to inactivity.');
			queue.voices.get(queue.textChannel).leave();
			clearInterval(firstInterval);
		}
	}, 2000);
});

client.once('ready', () => {
	console.log('[soupify] Ready!');
	client.user.setPresence({ activities: [{ type: 'LISTENING', name: '/play' }], status: 'online' });
	// UPDATE ANNOUNCEMENT
	// FETCH GUILDS
	/*
	const guilds = client.guilds.cache;
	for (let i = 0; i < guilds.size; i++) {
		// CHECK FOR BOT CHANNEL
		if (guilds.at(i).available) {
			const channels = guilds.at(i).channels.cache;
			for (let j = 0; j < channels.size; j++) {
				if (channels.at(j).type == 'GUILD_TEXT' && channels.at(j).name == 'bot') {
					const embed = new MessageEmbed()
						.setColor('#1db954')
						.setTitle('🆙   Update')
						.addFields(
							{ name: 'Version ' + Version, value: 'See more: https://github.com/suptower/soupify' },
						);
					channels.at(j).send({ embeds: [embed] });
					break;
				}
			}
		}
	}
	*/
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, distube);
	}
	catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.token);