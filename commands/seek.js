const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Fast forward (for positive values) or fast rewind (for negative values) in seconds")
    .addIntegerOption(option => option.setName("time").setDescription("in seconds").setRequired(true)),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue || !queue.currentTrack) {
      return interaction.editReply("This does only work if there is a queue.");
    }
    const timestamp = queue.node.getTimestamp();
    const currentTime = parseInt((timestamp?.current?.value ?? 0) / 1000);
    const toSeek = interaction.options.getInteger("time");
    const newTime = currentTime + toSeek;
    if (newTime > 0) {
      if (newTime < parseInt(queue.currentTrack.durationMS / 1000)) {
        await queue.node.seek(newTime * 1000);
      } else {
        return interaction.editReply("This operation would have resulted into skipping the current song.");
      }
    } else {
      return interaction.editReply("You are not able to rewind beyond the start of the current song.");
    }
    if (toSeek >= 0) {
      return interaction.editReply("⏩   Fast forwarded by `" + toSeek + " seconds`.");
    } else {
      return interaction.editReply("⏪   Fast rewound by `" + toSeek + " seconds`.");
    }
  },
};
