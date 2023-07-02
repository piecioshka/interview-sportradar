const { Scoreboard } = require('./scoreboard');

describe('Scoreboard', () => {
  let scoreboard;

  beforeEach(() => {
    scoreboard = new Scoreboard();
  });

  it('should be an empty when any matches are started', () => {
    expect(scoreboard.getMatches().length).toEqual(0);
  });

  describe('Starting a match', () => {
    // Happy Path
    it('should start a new match', () => {
      const match = scoreboard.startMatch('AA', 'BB');
      expect(match).toEqual({
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'AA', score: 0 },
        away: { name: 'BB', score: 0 },
      });
      expect(scoreboard.has(match.id)).toEqual(true);
    });

    it('should throw an error when we try to start a new match when one of teams is played now', () => {
      expect.assertions(2);
      scoreboard.startMatch('CC', 'DD');
      try {
        scoreboard.startMatch('CC', 'EE');
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain('Team "CC"');
      }
    });

    it('should throw an error when team names are the same', () => {
      expect.assertions(1);
      try {
        scoreboard.startMatch('FF', 'FF');
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('Updating a match', () => {
    // Happy path
    it('should can update match score', () => {
      const match = scoreboard.startMatch('AA', 'BB');
      scoreboard.updateMatchScore(match.id, { home: 2, away: 1 });
      expect(match).toEqual({
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'AA', score: 2 },
        away: { name: 'BB', score: 1 },
      });
    });

    it('should throw an error to update match score which has lower values (or less than zero)', () => {
      expect.assertions(1);
      const match = scoreboard.startMatch('AA', 'BB');
      scoreboard.updateMatchScore(match.id, { home: 2, away: 1 });
      try {
        scoreboard.updateMatchScore(match.id, { home: 1, away: 1 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should throw an error when update match is not in progress', () => {
      expect.assertions(1);
      const match = scoreboard.startMatch('AA', 'BB');
      scoreboard.finishMatch(match.id);
      try {
        scoreboard.updateMatchScore(match.id, { home: 1, away: 0 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('Finished a match', () => {
    // Happy path
    it('should can finish the match', () => {
      const match = scoreboard.startMatch('AA', 'BB');
      scoreboard.finishMatch(match.id);
      expect(match.state).toEqual('completed');
    });

    it('should remove finished match the scoreboard', () => {
      const match = scoreboard.startMatch('AA', 'BB');
      expect(scoreboard.has(match.id)).toEqual(true);
      scoreboard.finishMatch(match.id);
      expect(scoreboard.has(match.id)).toEqual(false);
    });

    it('should throw an error when try to finished match which is not in progress', () => {
      expect.assertions(1);
      const match = scoreboard.startMatch('AA', 'BB');
      scoreboard.finishMatch(match.id);
      try {
        scoreboard.finishMatch(match.id);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
