const { SlashCommandBuilder } = require("discord.js");
const { getQueue, getQueueTracks } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from queue")
    .addIntegerOption(option =>
      option
        .setName("position")
        .setDescription("Specify position of song to be removed (if none is given, last element will be removed)")
        .setRequired(false),
    ),
  async execute(interaction, player) {
    await interaction.deferReply();
    const pos = interaction.options.getInteger("position");
    const queue = getQueue(player, interaction.guild);
    const songs = getQueueTracks(queue);
    let removedSong;
    if (queue) {
      if (!(pos == null)) {
        if (pos === 0) {
          const currentTrack = queue.currentTrack;
          if (!currentTrack) {
            return interaction.editReply("There is no song to remove.");
          }
          removedSong = currentTrack.title;
          queue.node.skip();
        } else if (pos > 0 && pos < songs.length) {
          const track = queue.tracks.at(pos - 1);
          const removedTrack = track ? queue.node.remove(track) : null;
          if (!removedTrack) {
            return interaction.editReply("Failed to remove this song from queue.");
          }
          removedSong = removedTrack.title;
        } else if (pos >= songs.length) {
          if (queue.tracks.size > 0) {
            const track = queue.tracks.at(queue.tracks.size - 1);
            const removedTrack = track ? queue.node.remove(track) : null;
            if (!removedTrack) {
              return interaction.editReply("Failed to remove this song from queue.");
            }
            removedSong = removedTrack.title;
          } else if (queue.currentTrack) {
            removedSong = queue.currentTrack.title;
            queue.node.skip();
          } else {
            return interaction.editReply("Failed to remove this song from queue.");
          }
        } else {
          return interaction.editReply("Your given position is not in accepted range.");
        }
      } else {
        if (queue.tracks.size > 0) {
          const track = queue.tracks.at(queue.tracks.size - 1);
          const removedTrack = track ? queue.node.remove(track) : null;
          if (!removedTrack) {
            return interaction.editReply("Failed to remove this song from queue.");
          }
          removedSong = removedTrack.title;
        } else if (queue.currentTrack) {
          removedSong = queue.currentTrack.title;
          queue.node.skip();
        } else {
          return interaction.editReply("Failed to remove this song from queue.");
        }
      }
    } else {
      return interaction.editReply("There is no queue.");
    }
    return interaction.editReply("⏏️   Song `" + removedSong + "` removed from queue.");
  },
};
