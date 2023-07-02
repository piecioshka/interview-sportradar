const uuid = require('uuid');

class Match {
  id = uuid.v4();
  state = 'created';
  home = { name: null, score: 0 };
  away = { name: null, score: 0 };

  constructor(homeName, awayName) {
    this.home.name = homeName;
    this.away.name = awayName;
  }

  static createMatch(homeName, awayName) {
    return new Match(homeName, awayName);
  }
}

module.exports = {
  Match,
};
