const { Match } = require('./match');
const {
  scoreboard,
  startMatch,
  updateMatchScore,
  clearScoreboard,
} = require('./scoreboard');
const { ScoreboardReport } = require('./scoreboard-report');

describe('Report', () => {
  beforeEach(() => {
    clearScoreboard();
  });

  it('should return empty when scoreboard is empty', () => {
    const report = new ScoreboardReport(scoreboard).generate();
    expect(report.length).toEqual(0);
  });

  it('should return one match when its only one item on scoreboard', () => {
    startMatch('AA', 'BB');
    const report = new ScoreboardReport(scoreboard).generate();
    expect(report).toEqual([
      {
        ...Match.createMatch('AA', 'BB'),
        id: expect.any(String),
        state: 'in-progress',
      },
    ]);
  });

  it('should return a list in reversed order of started when score is the same', () => {
    startMatch('AA', 'BB');
    startMatch('CC', 'DD');
    const report = new ScoreboardReport(scoreboard).generate();
    expect(report).toEqual([
      {
        ...Match.createMatch('CC', 'DD'),
        id: expect.any(String),
        state: 'in-progress',
      },
      {
        ...Match.createMatch('AA', 'BB'),
        id: expect.any(String),
        state: 'in-progress',
      },
    ]);
  });

  it('should return a ordered list by total score', () => {
    startMatch('AA', 'BB');
    const match2 = startMatch('CC', 'DD');
    updateMatchScore(match2.id, { home: 1, away: 0 });
    const report = new ScoreboardReport(scoreboard).generate();
    expect(report).toEqual([
      {
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'CC', score: 1 },
        away: { name: 'DD', score: 0 },
      },
      {
        ...Match.createMatch('AA', 'BB'),
        id: expect.any(String),
        state: 'in-progress',
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

    const report = new ScoreboardReport(scoreboard).generate();

    expect(report).toEqual([
      {
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'Uruguay', score: 6 },
        away: { name: 'Italy', score: 6 },
      },
      {
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'Spain', score: 10 },
        away: { name: 'Brazil', score: 2 },
      },
      {
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'Mexico', score: 0 },
        away: { name: 'Canada', score: 5 },
      },
      {
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'Argentina', score: 3 },
        away: { name: 'Australia', score: 1 },
      },
      {
        id: expect.any(String),
        state: 'in-progress',
        home: { name: 'Germany', score: 2 },
        away: { name: 'France', score: 2 },
      },
    ]);
  });
});
