const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");
const { SpotifyExtractor } = require("discord-player-spotify");

const createPlayer = async client => {
  // eslint-disable-next-line new-cap
  const player = new Player(client);

  // console.log(player.scanDeps());

  await player.extractors.register(YoutubeiExtractor);
  await player.extractors.register(SpotifyExtractor);

  // player.on('debug', (message) => {
  //   console.log('[Player Debug]', message);
  // });

  player.events.on("playerStart", (queue, track) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Now Playing")
          .setDescription(`${track.author} - ${track.cleanTitle}`)
          .setThumbnail(track.thumbnail)
          .setColor("#1db954")
          .setFooter({ text: "Requested by " + track.requestedBy.tag, iconURL: track.requestedBy.displayAvatarURL() })
          .addFields(
            { name: "Duration", value: track.duration, inline: true },
            { name: "Source", value: `[Link](${track.url})`, inline: true },
            
          )
      ],
    });
  });

  return player;
};

module.exports = { createPlayer };
