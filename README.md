# Hello Everyone

This project is real time multiplayer ping pong game build with socket.io

# Getting Started with Project

## How can you run the project ?

You need to download node.js. Currently i am using version 12.18.4

After downloading node.js in the root first you need to run:

### `npm install`

to install all the packages.

After installing all the packages in the server directory, you can run:

### `npx nodemon server.js`

Runs the app in the development mode.\
Open [http://localhost:3000] to view it in the browser.

## How can you play ?

When you open the [http://localhost:3000] you need to see Create Game and Join Game buttons.

Enter a name and create game. After you created a game room you need to see a game code in the heading copy it.
Open [http://localhost:3000] in new browser tab or in new broser.
Again Enter a name and paste the game code in [Enter Game Code] input.
After all of this click join game in new opened browser tab.

So we created multiplayer with socket.io. Players can play in different browser.

## Goal of the game ?

There is two paddle one on left and one on right side. Basicly with "W" and "S" keyboard keys
you can move your paddle up and down and try to bounce ball back to other player.

