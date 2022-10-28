// Require the necessary discord.js classes
const fs = require('fs');
const keepAlive = require('./server');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const DisTube = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');

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
	nsfw: true,
	youtubeCookie: 'PREF=tz=Europe.Berlin&f6=40000000; CONSENT=YES+yt.458102784.de+FX+389; SOCS=CAISEwgDEgk0NTgxMDI3ODQaAmRlIAEaBgiAlf6VBg; VISITOR_INFO1_LIVE=x8ySMMgdZSY; SID=LwhkNve6WnprqFUIpS5rPfvRYtlcl1cPvbWYEjuRv93HPefj6jM1XijdjVJBfJwc4t_gIg.; __Secure-1PSID=LwhkNve6WnprqFUIpS5rPfvRYtlcl1cPvbWYEjuRv93HPefjmlfoE_1fulpaMP8S4dey5A.; __Secure-3PSID=LwhkNve6WnprqFUIpS5rPfvRYtlcl1cPvbWYEjuRv93HPefjmzHvPMyYP8naFCLnEc7YGg.; HSID=A1XHFc_gQ72RF2_-H; SSID=AoLmJHhXedoWZZc-i; APISID=KaKOiYkystaD6B94/Ar_4BTpEtwQBmdfJf; SAPISID=ADbnz8msVTmivVLX/A5uG9GXFMp77A0dYh; __Secure-1PAPISID=ADbnz8msVTmivVLX/A5uG9GXFMp77A0dYh; __Secure-3PAPISID=ADbnz8msVTmivVLX/A5uG9GXFMp77A0dYh; LOGIN_INFO=AFmmF2swRQIgRtUwcpi-fbBKEvY91StHoYkpx2fgVPlP9_M_6UcQeF8CIQC5ytmum603JDB69qDha5EQ3BN3Kc4BnpGcd_5_YQqXMQ:QUQ3MjNmem1IdzY4T3NjVjFHdHhwa2hHUkxiWnl0Wm5LSl9HeXl1UzNWREJKSGVxcGJjVDhqSFFUOVdOdkY1UU1zME9VZlNmb0RaSDhYMkMzTVlkUlRfekl2ZDdMZkk5Y19tZlRCWDlLM3RsanFSeWVjZzIyR0Zra2Vfa2lZRFN6RWNXNFlMaXF6SGR3UmthTGdIb2x1S2c5OWxLVU9xZm5OdjBBcmxhTG5DMUdiblhReV8zd0gtWV9GTXc4MUhfRW9IbVdUa1N4ZHI4NjQtankxTmZYSXF4bmZyaGV3MF9YQQ==; YSC=B9yX8TmHThE; SIDCC=AJi4QfGhb92xZYhNi76knj2p3nNKID4tafZSL0zt6TmzhL9eDkj3kf6hW73EZ7nyVhamXYmjcvU; __Secure-1PSIDCC=AJi4QfGQD9eecUvdU7t8if9Up8aj2do7SMb68PUoqRfIDOaPcqbvWU90dU4iA2Yrm2S1yt-GGow; __Secure-3PSIDCC=AJi4QfFTrecMuvOUwo5j9wJL1jQjwAp6C7zpbfzpjmunOhPiu8cpJAnBVX1roITDebAF0cqHrWU',
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
			{ name: 'Source', value: `${song.url}` },
		);
	queue.textChannel.send({ embeds: [playEmbed] });
});

distube.on('addSong', (queue, song) => {
	idle = 0;
	queue.textChannel.send(`🆕   Added \`${song.name}\` - \`(${song.formattedDuration})\` to the queue (requested by \`${song.member.displayName}\`)`);
});

distube.on('addList', (queue, list) => {
	idle = 0;
	if (list.songs.length == 1) {
		queue.textChannel.send(`🆕   Added playlist \`[${list.songs.length} song]\` to the queue (requested by \`${list.songs[0].member.displayName}\`)`);
	}
	else {
		queue.textChannel.send(`🆕   Added playlist \`[${list.songs.length} songs]\` to the queue (requested by \`${list.songs[0].member.displayName}\`)`);
	}

});

distube.on('finish', (queue) => {
	idle++;
	const firstInterval = setInterval(function() {
		if (idle == 0) {
			clearInterval(firstInterval);
		}
		idle++;
		console.log('[soupify] idle for: ' + idle);
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

client.login(process.env['token']);
keepAlive();