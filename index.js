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
      cookies: [
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024796,
          "hostOnly": false,
          "httpOnly": false,
          "name": "__Secure-1PAPISID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "XeWuazvp2SxZ9Ail/Ah3ud5DN3rM_s544i",
          "id": 1
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024938,
          "hostOnly": false,
          "httpOnly": true,
          "name": "__Secure-1PSID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "g.a000pQhkNmUEDj9t4eFTVLuRvuJsV_jzB187WatlAgKEOEyYmNDzHIu5aVqrH5oWOvZjGQ9EmQACgYKAf8SARYSFQHGX2MiMzjWT83UogbFi_l86FKzZRoVAUF8yKowQ4vIv6vbs25H_MtpbhaD0076",
          "id": 2
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1761910442.294029,
          "hostOnly": false,
          "httpOnly": true,
          "name": "__Secure-1PSIDCC",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "AKEyXzXYC9Z0V3RhDdoz3UKCNIl-bXTiSXSmwdRAPcSIkgqh4aD24F6sTadnpNI9O0amjh0GIw",
          "id": 3
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1761910436.829791,
          "hostOnly": false,
          "httpOnly": true,
          "name": "__Secure-1PSIDTS",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "sidts-CjIBQT4rXy0_6ExBBHEQnFz4T26bRbeJJN8sflIcGGIWog7HvTFm9kq3XWZKpS_G62MtZBAA",
          "id": 4
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024819,
          "hostOnly": false,
          "httpOnly": false,
          "name": "__Secure-3PAPISID",
          "path": "/",
          "sameSite": "no_restriction",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "XeWuazvp2SxZ9Ail/Ah3ud5DN3rM_s544i",
          "id": 5
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024962,
          "hostOnly": false,
          "httpOnly": true,
          "name": "__Secure-3PSID",
          "path": "/",
          "sameSite": "no_restriction",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "g.a000pQhkNmUEDj9t4eFTVLuRvuJsV_jzB187WatlAgKEOEyYmNDzeC2iYA8A2RRGaGmOibfNjQACgYKAcMSARYSFQHGX2MiSAnAs-36gGkBR4P78IhaWxoVAUF8yKqrqlYypjO7yOLJUv_oAGp90076",
          "id": 6
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1761910442.294073,
          "hostOnly": false,
          "httpOnly": true,
          "name": "__Secure-3PSIDCC",
          "path": "/",
          "sameSite": "no_restriction",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "AKEyXzV8mKDPtJv-UmIcKQrV6S8Ygq273J4uP0B4YojmC2VQXNYBzpzyirOCePvg0U8jipLkxw",
          "id": 7
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1761910436.829889,
          "hostOnly": false,
          "httpOnly": true,
          "name": "__Secure-3PSIDTS",
          "path": "/",
          "sameSite": "no_restriction",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "sidts-CjIBQT4rXy0_6ExBBHEQnFz4T26bRbeJJN8sflIcGGIWog7HvTFm9kq3XWZKpS_G62MtZBAA",
          "id": 8
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024748,
          "hostOnly": false,
          "httpOnly": false,
          "name": "APISID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": false,
          "session": false,
          "storeId": "0",
          "value": "o58dzj_pxPiaFy09/AcbIUMZPU7jc_Bk-2",
          "id": 9
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024658,
          "hostOnly": false,
          "httpOnly": true,
          "name": "HSID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": false,
          "session": false,
          "storeId": "0",
          "value": "Ae516o-gdIQ4eSXkQ",
          "id": 10
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764934437.20242,
          "hostOnly": false,
          "httpOnly": true,
          "name": "LOGIN_INFO",
          "path": "/",
          "sameSite": "no_restriction",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "AFmmF2swRgIhAN4pTraQlkfKUiQVSArNmQ2kqZvbxC81F1ieqHR0FbBCAiEAgyKZKHcddaMewSrCXm1-XYE7pbWOOCOpjUENDPCBNfI:QUQ3MjNmd2gzWk1zVXVNM2RxYm94WGd4MzcwbzdIcWJSZ2JQUTYzLV80T0VhNE1HcGd3VmREYWtjSXhmV09PeU5aVVB3Z1NtUG83SnkzSUI2LThod3Rzb2NqVUJSYjVBYzFkQl9FbVppRTVKUTAwRnJMWEZVbkM0bmFObWpudXdVR0JnYWM0UURLTTZWNFhBajJnYXRnb0dDTU8yODIya3hn",
          "id": 11
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764934439.122907,
          "hostOnly": false,
          "httpOnly": false,
          "name": "PREF",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "tz=Europe.Berlin&f6=40000000&f7=100",
          "id": 12
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024773,
          "hostOnly": false,
          "httpOnly": false,
          "name": "SAPISID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "XeWuazvp2SxZ9Ail/Ah3ud5DN3rM_s544i",
          "id": 13
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.024914,
          "hostOnly": false,
          "httpOnly": false,
          "name": "SID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": false,
          "session": false,
          "storeId": "0",
          "value": "g.a000pQhkNmUEDj9t4eFTVLuRvuJsV_jzB187WatlAgKEOEyYmNDzGhkhIaNuL8nYAlLzwqumEAACgYKAawSARYSFQHGX2MioGUWeMDCa6H4w4i4SJM-mBoVAUF8yKq63Cv1o9vEfNqi3HorMlbf0076",
          "id": 14
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1761910442.293947,
          "hostOnly": false,
          "httpOnly": false,
          "name": "SIDCC",
          "path": "/",
          "sameSite": "unspecified",
          "secure": false,
          "session": false,
          "storeId": "0",
          "value": "AKEyXzXEsir1LKS51Hvke7b_UO2tsP0TEpneO6qoDkJVjzV9vObYP36elg6xxSqH0eIXxPialsc",
          "id": 15
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1756823994.030541,
          "hostOnly": false,
          "httpOnly": false,
          "name": "SOCS",
          "path": "/",
          "sameSite": "lax",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "CAISEwgDEgk2NTc1ODc0NTYaAmRlIAEaBgiA5rW1Bg",
          "id": 16
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1764254081.02472,
          "hostOnly": false,
          "httpOnly": true,
          "name": "SSID",
          "path": "/",
          "sameSite": "unspecified",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "ApltMzqBX3u4Bp9w7",
          "id": 17
        },
        {
          "domain": ".youtube.com",
          "expirationDate": 1738247994.030585,
          "hostOnly": false,
          "httpOnly": true,
          "name": "VISITOR_INFO1_LIVE",
          "path": "/",
          "sameSite": "no_restriction",
          "secure": true,
          "session": false,
          "storeId": "0",
          "value": "Rn4_ZeF0OiQ",
          "id": 18
        }
      ],      
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
