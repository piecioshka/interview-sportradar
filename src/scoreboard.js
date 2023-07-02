const { Match } = require('./match');

class Scoreboard {
  _scoreboard = new Map();
  // For performance reason
  _currentPlayedTeams = new Set();

  startMatch(homeName, awayName) {
    this._checkAreTeamsPlayedNow(homeName, awayName);
    this._checkAreTheSameTeams(homeName, awayName);
    const match = Match.createMatch(homeName, awayName);
    match.state = 'in-progress';
    this._addToScoreboard(match, homeName, awayName);
    return match;
  }

  getMatches() {
    return [...this._scoreboard.values()];
  }

  updateMatchScore(matchId, matchScore) {
    const match = this._getMatch(matchId);
    this._checkIfScoreIsLower(match.home.score, matchScore.home);
    this._checkIfScoreIsLower(match.away.score, matchScore.away);
    match.home.score = matchScore.home;
    match.away.score = matchScore.away;
  }

  finishMatch(matchId) {
    const match = this._getMatch(matchId);
    match.state = 'completed';
    this._scoreboard.delete(matchId);
    return match;
  }

  hasMatch(matchId) {
    return this._scoreboard.has(matchId);
  }

  _addToScoreboard(match, homeName, awayName) {
    this._scoreboard.set(match.id, match);
    this._currentPlayedTeams.add(homeName);
    this._currentPlayedTeams.add(awayName);
  }

  _getMatch(matchId) {
    const match = this._scoreboard.get(matchId);
    if (!match) {
      throw new Error(`Match with id="${matchId}" is not available`);
    }
    return match;
  }

  _checkAreTeamsPlayedNow(...teams) {
    teams.forEach((team) => {
      if (this._currentPlayedTeams.has(team)) {
        throw new Error(`Team "${team}" played now`);
      }
    });
  }

  _checkAreTheSameTeams(homeName, awayName) {
    if (homeName === awayName) {
      throw new Error('The same teams cannot play to each other');
    }
  }

  _checkIfScoreIsLower(currentScore, newScore) {
    if (currentScore > newScore) {
      throw new Error('Cannot set score which is lower than current');
    }
  }
}

module.exports = {
  Scoreboard,
};
