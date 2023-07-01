const scoreboard = [];
// For performance reason
const currentPlayedTeams = new Set();

function clearScoreboard() {
  scoreboard.length = 0;
  currentPlayedTeams.clear();
}

function checkAreTeamsPlayedNow(...teams) {
  teams.forEach((team) => {
    if (currentPlayedTeams.has(team)) {
      throw new Error(`Team "${team}" played now`);
    }
  });
}

function checkAreTheSameTeams(homeName, awayName) {
  if (homeName === awayName) {
    throw new Error('The same teams cannot play to each other');
  }
}

function startMatch(homeName, awayName) {
  checkAreTeamsPlayedNow(homeName, awayName);
  checkAreTheSameTeams(homeName, awayName);

  const home = { name: homeName, score: 0 };
  const away = { name: awayName, score: 0 };

  scoreboard.push({ type: 'match', home, away });
  currentPlayedTeams.add(homeName);
  currentPlayedTeams.add(awayName);

  return { home, away };
}

module.exports = {
  scoreboard,
  clearScoreboard,
  startMatch,
};
