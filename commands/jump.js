const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a song in queue")
    .addIntegerOption(option => option.setName("position").setDescription("Position to jump to").setRequired(true)),
  async execute(interaction, distube) {
    await interaction.deferReply();
    const pos = interaction.options.getInteger("position");
    const queue = distube.getQueue(interaction.guild);
    if (queue) {
      if (!(pos == null)) {
        if (pos > 0 && pos < queue.songs.length) {
          distube.jump(interaction.guild, pos);
        } else {
          return interaction.editReply("Your given position is not in accepted range.");
        }
      }
    } else {
      return interaction.editReply("There is no queue.");
    }
    return interaction.editReply("📼   Jumped to position `" + pos + "` in queue.");
  },
};
