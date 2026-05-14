// Require the necessary discord.js classes
const fs = require("fs");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, Partials } = require("discord.js");
const { Player } = require("discord-player");
const { ActivityType, ChannelType } = require("discord-api-types/v10");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

let idle = 0;

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// eslint-disable-next-line new-cap
const player = new Player(client);

await player.extractors.loadDefault();

player.events.on('playerStart', (queue, track, payload) => {
  queue.metadata.channel.send({ embeds: [new EmbedBuilder().setDescription(`🎶 | Now playing **${track.title}**!`).setThumbnail(track.thumbnail).setColor("Random")] });
});

client.once("ready", () => {
  console.log("[soupify] Ready!");
  client.user.setPresence({ activities: [{ type: ActivityType.Listening, name: "/play" }], status: "online" });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.channel.type !== ChannelType.GuildText) {
    return interaction.channel.send("Sorry, my commands are only made to be used in guild text channels.");
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, player);
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.login(token);
