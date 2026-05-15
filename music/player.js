const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");

const createPlayer = async client => {
  // eslint-disable-next-line new-cap
  const player = new Player(client);

  await player.extractors.loadDefault();

  player.events.on("playerStart", (queue, track) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;
    channel.send({
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
