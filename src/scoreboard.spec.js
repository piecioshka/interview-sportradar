const {
  scoreboard,
  clearScoreboard,
  startMatch,
  updateMatchScore,
  finishMatch,
  getReport,
  createMatch,
} = require('./scoreboard');

describe('Scoreboard', () => {
  beforeEach(() => {
    clearScoreboard();
  });

  it('should be an empty when any matches are started', () => {
    expect(scoreboard.size).toEqual(0);
  });

  describe('Starting a match', () => {
    // Happy Path
    it('should start a new match', () => {
      const match = startMatch('AA', 'BB');
      expect(match).toEqual({
        id: expect.any(String),
        state: 'in-progress',
        startTime: expect.any(Number),
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
    // Happy path
    it('should can update match score', () => {
      const match = startMatch('AA', 'BB');
      updateMatchScore(match.id, { home: 2, away: 1 });
      expect(match).toEqual({
        id: expect.any(String),
        state: 'in-progress',
        startTime: expect.any(Number),
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

    it('should throw an error when update match is not in progress', () => {
      expect.assertions(1);
      const match = startMatch('AA', 'BB');
      finishMatch(match.id);
      try {
        updateMatchScore(match.id, { home: 1, away: 0 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('Finished a match', () => {
    // Happy path
    it('should can finish the match', () => {
      const match = startMatch('AA', 'BB');
      finishMatch(match.id);
      expect(match.state).toEqual('completed');
    });

    it('should remove finished match the scoreboard', () => {
      const match = startMatch('AA', 'BB');
      expect(scoreboard.has(match.id)).toEqual(true);
      finishMatch(match.id);
      expect(scoreboard.has(match.id)).toEqual(false);
    });

    it('should throw an error when try to finished match which is not in progress', () => {
      expect.assertions(1);
      const match = startMatch('AA', 'BB');
      finishMatch(match.id);
      try {
        finishMatch(match.id);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('Report', () => {
    it('should return empty when scoreboard is empty', () => {
      const report = getReport();
      expect(report.length).toEqual(0);
    });

    it('should return one match when its only one item on scoreboard', () => {
      startMatch('AA', 'BB');
      const report = getReport();
      expect(report).toEqual([
        {
          ...createMatch('AA', 'BB'),
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
        },
      ]);
    });

    it('should return a list in order of started when score is the same', () => {
      startMatch('AA', 'BB');
      startMatch('CC', 'DD');
      const report = getReport();
      expect(report).toEqual([
        {
          ...createMatch('AA', 'BB'),
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
        },
        {
          ...createMatch('CC', 'DD'),
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
        },
      ]);
    });

    it('should return a ordered list by total score', () => {
      startMatch('AA', 'BB');
      const match2 = startMatch('CC', 'DD');
      updateMatchScore(match2.id, { home: 1, away: 0 });
      const report = getReport();
      expect(report).toEqual([
        {
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
          home: { name: 'CC', score: 1 },
          away: { name: 'DD', score: 0 },
        },
        {
          ...createMatch('AA', 'BB'),
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
        },
      ]);
    });

    it('should return a ordered list by total score and rest in order of starting', () => {
      updateMatchScore(startMatch('Mexico', 'Canada').id, { home: 0, away: 5 });
      updateMatchScore(startMatch('Spain', 'Brazil').id, { home: 10, away: 2 });
      updateMatchScore(startMatch('Germany', 'France').id, {
        home: 2,
        away: 2,
      });
      updateMatchScore(startMatch('Uruguay', 'Italy').id, { home: 6, away: 6 });
      updateMatchScore(startMatch('Argentina', 'Australia').id, {
        home: 3,
        away: 1,
      });

      const report = getReport();

      console.log(report);

      expect(report).toEqual([
        {
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
          home: { name: 'Uruguay', score: 6 },
          away: { name: 'Italy', score: 6 },
        },
        {
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
          home: { name: 'Spain', score: 10 },
          away: { name: 'Brazil', score: 2 },
        },
        {
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
          home: { name: 'Mexico', score: 0 },
          away: { name: 'Canada', score: 5 },
        },
        {
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
          home: { name: 'Argentina', score: 3 },
          away: { name: 'Australia', score: 1 },
        },
        {
          id: expect.any(String),
          state: 'in-progress',
          startTime: expect.any(Number),
          home: { name: 'Germany', score: 2 },
          away: { name: 'France', score: 2 },
        },
      ]);
    });
  });
});
