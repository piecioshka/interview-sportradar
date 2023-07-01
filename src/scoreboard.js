const scoreboard = [];

function startMatch(homeName, awayName) {
  const home = { name: homeName, score: 0 };
  const away = { name: awayName, score: 0 };

  scoreboard.push({
    type: 'match',
    home,
    away,
  });

  return { home, away };
}

module.exports = {
  scoreboard,
  startMatch,
};
