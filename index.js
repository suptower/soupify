// Require the necessary discord.js classes
const fs = require("fs");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, Partials } = require("discord.js");
const { Player, QueueRepeatMode } = require("discord-player");
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

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// eslint-disable-next-line new-cap
const player = new Player(client);

const getRawQueue = guildOrInteraction => {
  const guild = guildOrInteraction?.guild ?? guildOrInteraction;
  if (!guild) return null;
  return player.nodes.get(guild);
};

const toCompatTrack = track => ({
  __track: track,
  name: track.title,
  formattedDuration: track.duration,
  duration: parseInt(track.durationMS / 1000),
  url: track.url,
});

const toCompatQueue = queue => {
  const currentTrack = queue.currentTrack ? [toCompatTrack(queue.currentTrack)] : [];
  const queuedTracks = queue.tracks.toArray().map(toCompatTrack);
  const timestamp = queue.node.getTimestamp();

  return {
    __rawQueue: queue,
    songs: currentTrack.concat(queuedTracks),
    currentTime: parseInt((timestamp?.current?.value ?? 0) / 1000),
    formattedCurrentTime: timestamp?.current?.label ?? "0:00",
    paused: queue.node.isPaused(),
  };
};

const distubeCompat = {
  async play(voiceChannel, query, options = {}) {
    if (Array.isArray(query)) {
      for (const track of query) {
        await this.play(voiceChannel, track, options);
      }
      return;
    }

    const result = await player.play(voiceChannel, query, {
      requestedBy: options.member,
      nodeOptions: {
        metadata: { channel: options.textChannel },
        leaveOnEmpty: true,
        leaveOnStop: true,
        leaveOnEnd: true,
      },
    });

    if (options.skip && result.queue.currentTrack && result.track.id !== result.queue.currentTrack.id) {
      result.queue.node.move(result.track, 0);
      result.queue.node.skip();
    }
  },
  createCustomPlaylist(tracks) {
    return tracks;
  },
  getQueue(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return null;
    return toCompatQueue(queue);
  },
  skip(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    return queue.node.skip();
  },
  pause(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    return queue.node.pause();
  },
  resume(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    return queue.node.resume();
  },
  stop(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    queue.node.stop();
    queue.delete();
    return true;
  },
  seek(guildOrInteraction, position) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    return queue.node.seek(position * 1000);
  },
  move(guildOrInteraction, oldPos, newPos) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    const track = queue.tracks.at(oldPos - 1);
    if (!track) return false;
    queue.node.move(track, newPos - 1);
    return true;
  },
  jump(guildOrInteraction, pos) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    const track = queue.tracks.at(pos - 1);
    if (!track) return false;
    return queue.node.jump(track);
  },
  remove(guildOrInteraction, pos) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return null;
    const track = queue.tracks.at(pos - 1);
    if (!track) return null;
    const removedTrack = queue.removeTrack(track);
    return removedTrack ? toCompatTrack(removedTrack) : null;
  },
  pop(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue || queue.tracks.size === 0) return null;
    const track = queue.tracks.at(queue.tracks.size - 1);
    const removedTrack = queue.removeTrack(track);
    return removedTrack ? toCompatTrack(removedTrack) : null;
  },
  shuffle(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    return queue.enableShuffle(false);
  },
  setVolume(queueOrGuild, vol) {
    const queue = queueOrGuild?.__rawQueue ?? getRawQueue(queueOrGuild);
    if (!queue) return false;
    return queue.node.setVolume(vol);
  },
  setRepeatMode(guildOrInteraction, mode) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    queue.setRepeatMode(mode);
    return true;
  },
  toggleAutoplay(guildOrInteraction) {
    const queue = getRawQueue(guildOrInteraction);
    if (!queue) return false;
    const mode = queue.repeatMode !== QueueRepeatMode.AUTOPLAY;
    queue.setRepeatMode(mode ? QueueRepeatMode.AUTOPLAY : QueueRepeatMode.OFF);
    return mode;
  },
  voices: {
    get(guildOrInteraction) {
      return {
        leave() {
          const queue = getRawQueue(guildOrInteraction);
          if (queue) {
            queue.delete();
          }
        },
      };
    },
  },
};

const initializePlayer = async () => {
  await player.extractors.loadDefault();

  player.events.on("playerStart", (queue, track) => {
    queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🎶 | Now playing **${track.title}**!`)
          .setThumbnail(track.thumbnail)
          .setColor("Random"),
      ],
    });
  });
};

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
    await command.execute(interaction, distubeCompat);
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

initializePlayer()
  .then(() => client.login(token))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
