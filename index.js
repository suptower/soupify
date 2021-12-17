// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const DisTube = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { default: dist } = require('discord.js/node_modules/@discordjs/collection');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

var idle = 0;

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
	plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});

distube.on("playSong", (queue,song) => {
	idle = 0;
	const playEmbed = new MessageEmbed()
		.setColor('#1db954')
		.setTitle("▶️   Now playing")
		.addFields(
			{ name: 'Title', value: `${song.name}`, inline: true},
			{ name: 'Duration', value: `${song.formattedDuration}`, inline: true},
		)
	queue.textChannel.send({embeds: [playEmbed]});
});

distube.on("addSong", (queue, song) => {
	idle = 0;
	queue.textChannel.send(`🆕   Added \`${song.name}\` - \`(${song.formattedDuration})\` to the queue (requested by \`${song.member.displayName}\`)`);
});

distube.on("addList", (queue, list) => {
	idle = 0;
	queue.textChannel.send(`🆕   Added playlist to the queue (requested by \`${list.songs[0].member.displayName}\`)`);
});

distube.on("finish", (queue) => {
	idle++;
	firstInterval = setInterval(function () {
		if (idle == 0) {
			clearInterval(firstInterval);
		}
		idle++;
		console.log(idle);
		if (idle == 20) {
			queue.voices.get(queue.textChannel).leave();
			clearInterval(firstInterval);
		}
	}, 2000);
	queue.textChannel.send("The bot has left the channel due to inactivity.");
});

client.once('ready', () => {
	console.log('[soupify] Ready!');
	client.user.setPresence({activities: [{type: 'LISTENING', name: '/play'}], status: 'online'});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction,distube);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.token);