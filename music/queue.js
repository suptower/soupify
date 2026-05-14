const getQueue = (player, guild) => player.nodes.get(guild) ?? null;

const getQueueTracks = queue => {
  const tracks = [];
  if (queue?.currentTrack) {
    tracks.push(queue.currentTrack);
  }
  if (queue) {
    tracks.push(...queue.tracks.toArray());
  }
  return tracks;
};

module.exports = { getQueue, getQueueTracks };
