const fs = require("fs");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { ActivityType, ChannelType } = require("discord-api-types/v10");
const { token } = require("./config.json");
const { createPlayer } = require("./music/player");

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

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const start = async () => {
  const player = await createPlayer(client);

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

  await client.login(token);
};

start().catch(error => {
  console.error(error);
  process.exit(1);
});
