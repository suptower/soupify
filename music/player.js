const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");

const createPlayer = async client => {
  // eslint-disable-next-line new-cap
  const player = new Player(client);

  // console.log(player.scanDeps());

  await player.extractors.loadMulti(DefaultExtractors);

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
          .setDescription(`[${track.title}](${track.url})`)
          .setThumbnail(track.thumbnail)
          .setColor("#1db954")
          .setFooter({ text: "Requested by " + track.requestedBy.tag, iconURL: track.requestedBy.displayAvatarURL() }),
      ],
    });
  });

  return player;
};

module.exports = { createPlayer };
