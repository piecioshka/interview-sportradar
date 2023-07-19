# Live Football World Cup Score Board

## Assumptions

* Scoreboard and the beginning is empty
* Starting a match should have only two teams: home and away
* Match has states:
  - created - is created but not player
  - in-progress - playing now
  - completed - finishing a competition
* Code: methods started with "_" are a private members

## Edge Cases

* Starting a match should have different team names
* Starting a match should have teams which are not on scoreboard right now

## Relations

![](docs/relations.png)

## Development

```bash
# setup application
npm install

# run unit tests
npm run test

# run unit tests and generate coverage
npm run coverage
```

## Bonus task

Create the function that will return the number of goals for a passed team name.
So we want to know how many goals did the team score in the current match if that team is playing a match currently.

Assumptions:

* we use only the team name
* the name of team could be a lower or upper cased
* only find matches which are in progress
