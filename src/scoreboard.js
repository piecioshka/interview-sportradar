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
    state: 'created',
    home: { name: homeName, score: 0 },
    away: { name: awayName, score: 0 },
  };
}

function getTotalScore(match) {
  return match.home.score + match.away.score;
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

function getMatch(matchId) {
  const match = scoreboard.get(matchId);
  if (!match) {
    throw new Error(`Match with id="${matchId}" is not available`);
  }
  return match;
}

function updateMatchScore(matchId, matchScore) {
  const match = getMatch(matchId);
  checkIfScoreIsLower(match.home.score, matchScore.home);
  checkIfScoreIsLower(match.away.score, matchScore.away);
  match.home.score = matchScore.home;
  match.away.score = matchScore.away;
}

function finishMatch(matchId) {
  const match = getMatch(matchId);
  match.state = 'completed';
  scoreboard.delete(matchId);
  return match;
}

function getReport() {
  const report = [...scoreboard.values()].reverse();
  report.sort((matchA, matchB) => {
    return getTotalScore(matchB) - getTotalScore(matchA);
  });
  return report;
}

module.exports = {
  scoreboard,
  createMatch,
  clearScoreboard,
  startMatch,
  updateMatchScore,
  finishMatch,
  getReport,
};
