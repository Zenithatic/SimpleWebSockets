import './style.css'
import logo from '/socketio-logo.png'
import { io } from 'socket.io-client'

interface Message {
    sender: string
    message: string
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>
    <img src='${logo}' alt='SocketIO Logo' height=50px class='inline-image'/>
    Simple Web Sockets
    <img src='${logo}' alt='SocketIO Logo' height=50px class='inline-image'/>
  </h1>
  <p>This is a demo of the basic workings of SocketIO. Click <a href=https://github.com/Zenithatic/SimpleWebSockets target=_blank>here</a> to view source code.</p>
  <p id='info'>Your UserID is <strong>___</strong> and you are connected to room <strong>___</strong></p>
  <p id='users'>Users in room: ___</p>    
  <div id='messages'>
    <div class='message'>You are not in a room.</div>
  </div>
  <div> 
    <label for='message-input'>Message</label>
    <input id='message-input' type='text' placeholder='Type a message...'/>
    <button id='message-send'>Send</button>
  </div>
  <div> 
    <label for='room-input'>Room</label>
    <input id='room-input' type='text' placeholder='Enter a room code...'/>
    <button id='room-join'>Join</button>
  </div>
`

// DOM elements
const sendMsgButton = document.querySelector<HTMLButtonElement>('#message-send')
const joinRoomButton = document.querySelector<HTMLButtonElement>('#room-join')
const msgInput = document.querySelector<HTMLInputElement>('#message-input')
const roomInput = document.querySelector<HTMLInputElement>('#room-input')
const messages = document.querySelector<HTMLDivElement>('#messages')
const userInfo = document.querySelector<HTMLParagraphElement>('#info')
const usersInRoom = document.querySelector<HTMLParagraphElement>('#users')
let userID = 'user_id'
let currentRoom = '___'

// Socket.IO work

while (true) {
    const user = prompt('Enter your username:')

    if (user == undefined || user == null) {
        window.alert('Username cannot be empty.')
    }
    else if (user?.length == 0) {
        window.alert('Username cannot be empty.')
    }
    else {
        userID = user!
        break
    }
}

const socket = io('http://localhost:3000', { query: { userID: userID } })

socket.on('connect', () => {
    console.log("Successfully connected to server.")
    userInfo!.innerHTML = `Your UserID is <strong>${userID}</strong> and you are connected to room <strong>${currentRoom}</strong>`
})

socket.on('message', (msg: Message) => {
    displayMessage(msg)
})

socket.on('user-join', (users: string[]) => {
    updateUsers(users)
})

// Event listeners
sendMsgButton!.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    const msg = msgInput!.value
    socket.emit('message', msg, currentRoom)
})

joinRoomButton!.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    const roomToJoin = roomInput!.value

    if (roomToJoin.length == 0) {
        window.alert('Room code cannot be empty.')
    }
    else {
        clearMessages()
        socket.emit('join-room', userID, currentRoom, roomToJoin, displayMessages)
    }
    currentRoom = roomToJoin
    userInfo!.innerHTML = `Your UserID is <strong>${userID}</strong> and you are connected to room <strong>${currentRoom}</strong>`
})

// Function to display message onto screen
function displayMessage(msg: Message): void {
    const message = document.createElement('div')
    message.classList.add('message')
    message.innerText = `${msg.sender}: ${msg.message}`
    messages!.appendChild(message)
}

// Function to display an existing list of messages
function displayMessages(msgs: Message[]): void {
    msgs.forEach(msg => {
        displayMessage(msg)
    })
}

// Function to clear all messages
function clearMessages(): void {
    messages!.innerHTML = ''
}

// Function to update the list of users in the room
function updateUsers(users: string[]): void {
    let userString = ""
    for (let i = 0; i < users.length; i++) {
        userString += users[i]
        if (i != users.length - 1) {
            userString += ", "
        }
    }

    usersInRoom!.innerHTML = `Users in room: ${userString}`
}





