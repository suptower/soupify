const createPlaybackQueue = (player, interaction) =>
  player.nodes.create(interaction.guild, {
    metadata: { channel: interaction.channel },
    leaveOnEmpty: true,
    leaveOnStop: true,
    leaveOnEnd: true,
  });

const fisherYatesShuffle = tracks => {
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }

  return tracks;
};

const enqueuePlaylist = async ({ player, interaction, playlistUrl, shuffle }) => {
  if (!interaction.guild) {
    throw new Error("This command can only be used inside a server.");
  }
  if (!interaction.member.voice?.channel) {
    throw new Error("You need to be connected to a voice channel.");
  }

  const result = await player.search(playlistUrl, {
    requestedBy: interaction.member,
  });

  if (!result.hasTracks()) {
    throw new Error("No songs were found for this playlist.");
  }

  const tracks = [...result.tracks];
  if (shuffle) {
    fisherYatesShuffle(tracks);
  }

  const queue = player.nodes.get(interaction.guild) ?? createPlaybackQueue(player, interaction);
  if (typeof queue.addTracks === "function") {
    queue.addTracks(tracks);
  } else {
    for (const track of tracks) {
      queue.addTrack(track);
    }
  }

  if (!queue.connection) {
    await queue.connect(interaction.member.voice.channel);
  }

  if (!queue.node.isPlaying()) {
    await queue.node.play();
  }
};

module.exports = { enqueuePlaylist };
