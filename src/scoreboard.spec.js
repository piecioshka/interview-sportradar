const {
  scoreboard,
  clearScoreboard,
  startMatch,
  updateMatchScore,
} = require('./scoreboard');

describe('Scoreboard', () => {
  beforeEach(() => {
    clearScoreboard();
  });

  describe('Starting a match', () => {
    it('should be an empty when any matches are started', () => {
      expect(scoreboard.size).toEqual(0);
    });

    // Happy Path
    it('should start a new match', () => {
      const match = startMatch('AA', 'BB');
      expect(match).toEqual({
        id: expect.any(String),
        type: 'match',
        state: 'in-progress',
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
        startMatch('FF', 'FF');
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('Updating a match', () => {
    it('should can update match score', () => {
      const match = startMatch('AA', 'BB');
      updateMatchScore(match.id, { home: 2, away: 1 });
      expect(match).toEqual({
        id: expect.any(String),
        type: 'match',
        state: 'in-progress',
        home: { name: 'AA', score: 2 },
        away: { name: 'BB', score: 1 },
      });
    });

    it('should throw an error to update match score which has lower values (or less than zero)', () => {
      expect.assertions(1);
      const match = startMatch('AA', 'BB');
      updateMatchScore(match.id, { home: 2, away: 1 });
      try {
        updateMatchScore(match.id, { home: 1, away: 1 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});