const { scoreboard, startMatch } = require('./scoreboard');

describe('Scoreboard', () => {
  it('should be an empty when any matches are started', () => {
    expect(scoreboard).toEqual([]);
  });

  it('should start a new match', () => {
    const match = startMatch('AA', 'BB');
    expect(match).toEqual({
      home: { name: 'AA', score: 0 },
      away: { name: 'BB', score: 0 },
    });
  });
});
