const { scoreboard, clearScoreboard, startMatch } = require('./scoreboard');

describe('Scoreboard', () => {
  beforeEach(() => {
    clearScoreboard();
  });

  describe('Starting a match', () => {
    it('should be an empty when any matches are started', () => {
      expect(scoreboard).toEqual([]);
    });

    // Happy Path
    it('should start a new match', () => {
      const match = startMatch('AA', 'BB');
      expect(match).toEqual({
        home: { name: 'AA', score: 0 },
        away: { name: 'BB', score: 0 },
      });
    });

    it('should throw an error when we try to start a new match when one of teams is played now', () => {
      expect.assertions(2);
      startMatch('CC', 'DD');
      try {
        startMatch('CC', 'EE');
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain('Team "CC"');
      }
    });

    it('should throw an error when team names are the same', () => {
      expect.assertions(1);
      try {
        startMatch('CC', 'CC');
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
