
# SimpleWebSockets

This is a simple implementation of a chat application with users and rooms. It runs on socket.io, a npm package that makes working with websockets much simpler. Frontend is a vanilla Typescript app bundled with Vite, and backend is running Express.js with Typescript in Node.js




## Screenshots
Scrolled up:

![App Screenshot](https://i.imgur.com/bVl3NtI.png)

Scrolled down:

![App Screenshot](https://i.imgur.com/JqGqqD7.png)

Light theme:

![App Screenshot](https://i.imgur.com/hJUApEl.png)

## Features

- Choosing a username to chat with
- Option to join rooms
- Room history saves as long as backend server runs
- Room history clears when backend server is shut down
- Indication of which users are in your current room
- Messages that indicate who joins and leaves a room
- Light theme if your system theme is light


## Installation

Requirements: Node.js & Git installed

To install:

```bash
  git clone https://github.com/Zenithatic/SimpleWebSockets.git
  cd SimpleWebSockets
  cd server
  npm install
  cd ../frontend
  npm install
```

To run, first open two terminals.

In terminal one, change directory into SimpleWebSockets, then:

```bash
cd server
npm start
```

In terminal two, change directory into SimpleWebSockets, then:

```bash
cd frontend
npm run dev
```

Finally, go to http://localhost:5173/ in one or more browser tabs to demo the application


    
## Authors

- [@zenithatic](https://www.github.com/zenithatic)

