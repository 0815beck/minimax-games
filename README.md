# MINIMAX GAMES

Play complete information games against the sassy robot Minimax in a Neo-Futuristic Web-Application.

Minimax uses the minimax algorithm with alpha-beta pruning to play. This algorithm can be used
on all complete information games.

To apply the algorithm to a game one needs:

- a type State which represents the possible states of the game
- a way to enumerate all possible child states of a given game state
- a heuristic evaluation function which gives each intermediate game state a score

The heuristic evaluation function is only necessary when the game tree is too large to
be evaluated completely (ie for almost all games other than tic tac toe).

Currently implemented are:

- checkers
- tic tac toe

## Run the app

To run the app on a development server execute the command "npm run dev" in the root directory. To deploy the app
run "npm run build", take the static files from the build folder, and serve them with a web server.
