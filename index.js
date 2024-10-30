// Require the necessary discord.js classes
const fs = require("fs");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, Partials } = require("discord.js");
const DisTube = require("distube");
const { YouTubePlugin } = require("@distube/youtube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const { DeezerPlugin } = require("@distube/deezer");
const { DirectLinkPlugin } = require("@distube/direct-link");
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
const distube = new DisTube.default(client, {
  emitAddListWhenCreatingQueue: true,
  emitAddSongWhenCreatingQueue: true,
  joinNewVoiceChannel: true,
  nsfw: true,
  plugins: [
    new YouTubePlugin({
      cookies: JSON.parse(fs.readFileSync("./yt-cookies.json", "utf8")),
    }),
    new SoundCloudPlugin(),
    new SpotifyPlugin(),
    new DeezerPlugin(),
    new DirectLinkPlugin(),
    new YtDlpPlugin(),
  ],
});

distube.on("playSong", (queue, song) => {
  idle = 0;
  const playEmbed = new EmbedBuilder()
    .setColor("#1db954")
    .setTitle("▶️   Now playing")
    .addFields(
      { name: "Title", value: `${song.name}`, inline: true },
      { name: "Duration", value: `${song.formattedDuration}`, inline: true },
      { name: "Source", value: `${song.url}` },
    );
  queue.textChannel.send({ embeds: [playEmbed] });
});

distube.on("addSong", (queue, song) => {
  idle = 0;
  queue.textChannel.send(
    `🆕   Added \`${song.name}\` - \`(${song.formattedDuration})\` to the queue (requested by \`${song.member.displayName}\`)`,
  );
});

distube.on("addList", (queue, list) => {
  idle = 0;
  if (list.songs.length === 1) {
    queue.textChannel.send(
      `🆕   Added playlist \`[${list.songs.length} song]\` to the queue (requested by \`${list.songs[0].member.displayName}\`)`,
    );
  } else {
    queue.textChannel.send(
      `🆕   Added playlist \`[${list.songs.length} songs]\` to the queue (requested by \`${list.songs[0].member.displayName}\`)`,
    );
  }
});

distube.on("finish", queue => {
  idle++;
  const firstInterval = setInterval(function () {
    if (idle === 0) {
      clearInterval(firstInterval);
    }
    idle++;
    console.log("[soupify] idle for: " + idle);
    if (idle === 20) {
      queue.textChannel.send("The bot has left the channel due to inactivity.");
      queue.voices.get(queue.textChannel).leave();
      clearInterval(firstInterval);
    }
  }, 2000);
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
    await command.execute(interaction, distube);
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.login(token);
