function getGoalsOf(scoreboard, teamName) {
  const lowerCaseTeamName = teamName.toLowerCase();
  const matches = scoreboard.getMatches();
  const matchOfTeam = matches.find((match) => {
    return (
      match.home.name === lowerCaseTeamName ||
      match.away.name === lowerCaseTeamName
    );
  });
  if (!matchOfTeam) {
    return null;
  }
  if (matchOfTeam.home.name === teamName) {
    return matchOfTeam.home.score;
  }
  return matchOfTeam.away.score;
}

module.exports = {
  getGoalsOf,
};
