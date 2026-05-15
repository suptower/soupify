const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { getQueue, getQueueTracks } = require("../music/queue");

const FIRST_SEPARATOR = "▶️ ";
const SECOND_SEPARATOR = "ℹ️";
module.exports = {
  data: new SlashCommandBuilder().setName("queue").setDescription("Show the queue"),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue) {
      return interaction.editReply("There is no queue.");
    } else {
      const songs = getQueueTracks(queue);
      const row0 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⬅️")
            .setDisabled(true),
        )
        .addComponents(
          new ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(ButtonStyle.Success).setEmoji("➡️"),
        );
      const row1 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⬅️")
            .setDisabled(false),
        )
        .addComponents(
          new ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(ButtonStyle.Success).setEmoji("➡️"),
        );
      const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId("prev").setLabel("Previous").setStyle(ButtonStyle.Danger).setEmoji("⬅️"),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Success)
            .setEmoji("➡️")
            .setDisabled(true),
        );
      const row3 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⬅️")
            .setDisabled(true),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Success)
            .setEmoji("➡️")
            .setDisabled(true),
        );
      let infoBuffer = "";
      let offset = 0;
      for (let i = 0; i < 10 && i < songs.length; i++) {
        infoBuffer += i + offset + " " + FIRST_SEPARATOR + "[" + songs[i].duration + "] " + SECOND_SEPARATOR + " " + songs[i].author + " - " + songs[i].title + "\n";
      }
      let message;
      if (songs.length > 10) {
        message = await interaction.channel
          .send({
            content:
              "```------------------------------ 📻   CURRENT QUEUE   ------------------------------\n\n" +
              infoBuffer +
              "\n------------------------------ 📻   PAGE (" +
              (offset / 10 + 1) +
              "/" +
              parseInt((songs.length - 1) / 10 + 1) +
              ")   ------------------------------------```",
            components: [row0],
          })
      } else {
        message = await interaction.channel
          .send({
            content:
              "```------------------------------ 📻   CURRENT QUEUE   ------------------------------\n\n" +
              infoBuffer +
              "\n------------------------------ 📻   PAGE (" +
              (offset / 10 + 1) +
              "/" +
              parseInt((songs.length - 1) / 10 + 1) +
              ")   ------------------------------------```",
            components: [row3],
          })
      }
      const collector = message.createMessageComponentCollector({
        time: 300000,
      });
      collector.on("collect", async i => {
        if (i.customId === "next") {
          collector.resetTimer();
          offset += 10;
          infoBuffer = "";
          for (let x = 0; x < 10; x++) {
            if (x + offset < songs.length && x + offset >= 0) {
              infoBuffer += x + offset + " " + FIRST_SEPARATOR + "[" + songs[x + offset].duration + "] " + SECOND_SEPARATOR + " " + songs[x + offset].author + " - " + songs[x + offset].title + "\n";
            }
          }
          if (offset + 10 >= songs.length) {
            await i.update({
              content:
                "```------------------------------ 📻   CURRENT QUEUE   ------------------------------\n\n" +
                infoBuffer +
                "\n------------------------------ 📻   PAGE (" +
                (offset / 10 + 1) +
                "/" +
                parseInt((songs.length - 1) / 10 + 1) +
                ")   ------------------------------------```",
              components: [row2],
            });
          } else {
            await i.update({
              content:
                "```------------------------------ 📻   CURRENT QUEUE   ------------------------------\n\n" +
                infoBuffer +
                "\n------------------------------ 📻   PAGE (" +
                (offset / 10 + 1) +
                "/" +
                parseInt((songs.length - 1) / 10 + 1) +
                ")   ------------------------------------```",
              components: [row1],
            });
          }
        } else if (i.customId === "prev") {
          collector.resetTimer();
          offset -= 10;
          infoBuffer = "";
          for (let x = 0; x < 10; x++) {
            if (x + offset < songs.length && x + offset >= 0) {
              infoBuffer += x + offset + " " + FIRST_SEPARATOR + "[" + songs[x + offset].duration + "] " + SECOND_SEPARATOR + " " + songs[x + offset].author + " - " + songs[x + offset].title + "\n";
            }
          }
          if (offset === 0) {
            await i.update({
              content:
                "```------------------------------ 📻   CURRENT QUEUE   ------------------------------\n\n" +
                infoBuffer +
                "\n------------------------------ 📻   PAGE (" +
                (offset / 10 + 1) +
                "/" +
                parseInt((songs.length - 1) / 10 + 1) +
                ")   ------------------------------------```",
              components: [row0],
            });
          } else {
            await i.update({
              content:
                "```------------------------------ 📻   CURRENT QUEUE   ------------------------------\n\n" +
                infoBuffer +
                "\n------------------------------ 📻   PAGE (" +
                (offset / 10 + 1) +
                "/" +
                parseInt((songs.length - 1) / 10 + 1) +
                ")   ------------------------------------```",
              components: [row1],
            });
          }
        }
      });
      collector.on("end", () => {
        message.delete();
      });
      return interaction.deleteReply();
    }
  },
};
