const { Match } = require('./match');

class Scoreboard {
  _scoreboard = new Map();
  // For performance reason
  _currentPlayedTeams = new Set();

  clearScoreboard() {
    this._scoreboard.clear();
    this._currentPlayedTeams.clear();
  }

  checkAreTeamsPlayedNow(...teams) {
    teams.forEach((team) => {
      if (this._currentPlayedTeams.has(team)) {
        throw new Error(`Team "${team}" played now`);
      }
    });
  }

  checkAreTheSameTeams(homeName, awayName) {
    if (homeName === awayName) {
      throw new Error('The same teams cannot play to each other');
    }
  }

  startMatch(homeName, awayName) {
    this.checkAreTeamsPlayedNow(homeName, awayName);
    this.checkAreTheSameTeams(homeName, awayName);

    const match = Match.createMatch(homeName, awayName);
    match.state = 'in-progress';

    this._scoreboard.set(match.id, match);
    this._currentPlayedTeams.add(homeName);
    this._currentPlayedTeams.add(awayName);

    return match;
  }

  checkIfScoreIsLower(currentScore, newScore) {
    if (currentScore > newScore) {
      throw new Error('Cannot set score which is lower than current');
    }
  }

  getMatch(matchId) {
    const match = this._scoreboard.get(matchId);
    if (!match) {
      throw new Error(`Match with id="${matchId}" is not available`);
    }
    return match;
  }

  getMatches() {
    return [...this._scoreboard.values()];
  }

  updateMatchScore(matchId, matchScore) {
    const match = this.getMatch(matchId);
    this.checkIfScoreIsLower(match.home.score, matchScore.home);
    this.checkIfScoreIsLower(match.away.score, matchScore.away);
    match.home.score = matchScore.home;
    match.away.score = matchScore.away;
  }

  finishMatch(matchId) {
    const match = this.getMatch(matchId);
    match.state = 'completed';
    this._scoreboard.delete(matchId);
    return match;
  }

  has(matchId) {
    return this._scoreboard.has(matchId);
  }
}

module.exports = {
  Scoreboard,
};
