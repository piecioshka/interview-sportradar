const uuid = require('uuid');

const scoreboard = new Map();
// For performance reason
const currentPlayedTeams = new Set();

function clearScoreboard() {
  scoreboard.clear();
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

function createMatch(homeName, awayName) {
  return {
    id: uuid.v4(),
    type: 'match',
    state: 'created',
    home: { name: homeName, score: 0 },
    away: { name: awayName, score: 0 },
  };
}

function startMatch(homeName, awayName) {
  checkAreTeamsPlayedNow(homeName, awayName);
  checkAreTheSameTeams(homeName, awayName);

  const match = createMatch(homeName, awayName);
  match.state = 'in-progress';

  scoreboard.set(match.id, match);
  currentPlayedTeams.add(homeName);
  currentPlayedTeams.add(awayName);

  return match;
}

function checkIfScoreIsLower(currentScore, newScore) {
  if (currentScore > newScore) {
    throw new Error('Cannot set score which is lower than current');
  }
}

function updateMatchScore(matchId, matchScore) {
  const match = scoreboard.get(matchId);
  checkIfScoreIsLower(match.home.score, matchScore.home);
  checkIfScoreIsLower(match.away.score, matchScore.away);
  match.home.score = matchScore.home;
  match.away.score = matchScore.away;
}

module.exports = {
  scoreboard,
  clearScoreboard,
  startMatch,
  updateMatchScore,
};
