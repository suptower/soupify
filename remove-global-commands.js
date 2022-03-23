const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);
// REMOVE GUILD-SPECIFIC-COMMANDS

(async () => {
	try {
		console.log('Started removing application (/) commands.');

		await rest.put(Routes.applicationCommands(clientId), { body: [] });

		console.log('Successfully removed application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
})();