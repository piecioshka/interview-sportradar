class ScoreboardReport {
  constructor(scoreboard) {
    this.scoreboard = scoreboard;
  }

  generate() {
    const report = [...this.scoreboard.values()].reverse();
    report.sort((matchA, matchB) => {
      return this._getTotalScore(matchB) - this._getTotalScore(matchA);
    });
    return report;
  }

  _getTotalScore(match) {
    return match.home.score + match.away.score;
  }
}

module.exports = {
  ScoreboardReport,
};
