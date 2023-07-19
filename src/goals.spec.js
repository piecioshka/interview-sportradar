const { getGoalsOf } = require('./goals');
const { Scoreboard } = require('./scoreboard');

describe('Goals', () => {
  it('should returns numbers of goals', () => {
    // given
    const scoreboard = new Scoreboard();
    const match = scoreboard.startMatch('AA', 'BB');
    scoreboard.updateMatchScore(match.id, { home: 1, away: 2 });
    // when
    const gaols = getGoalsOf(scoreboard, 'AA');
    // then
    expect(gaols).toEqual(1);
  });

  it('should return null when team is not played right now', () => {
    // given
    const scoreboard = new Scoreboard();
    // when
    const gaols = getGoalsOf(scoreboard, 'aA');
    // then
    expect(gaols).toEqual(null);
  });
});
