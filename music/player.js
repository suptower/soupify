const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");

const createPlayer = async client => {
  // eslint-disable-next-line new-cap
  const player = new Player(client);

  await player.extractors.loadDefault();

  player.events.on("playerStart", (queue, track) => {
    if (!queue.metadata?.channel) return;
    queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🎶 | Now playing **${track.title}**!`)
          .setThumbnail(track.thumbnail)
          .setColor("Random"),
      ],
    });
  });

  return player;
};

module.exports = { createPlayer };
