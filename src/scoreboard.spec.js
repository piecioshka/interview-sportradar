const { scoreboard } = require('./scoreboard');

describe('Scoreboard', () => {
  it('should be an empty when any matches are started', () => {
    expect(scoreboard).toEqual([]);
  });
});
