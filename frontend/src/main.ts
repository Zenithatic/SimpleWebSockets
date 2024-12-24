import './style.css'
import logo from "/socketio-logo.png"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1><img src="${logo}" alt="SocketIO Logo" height=50px class="inline-image"/> Simple Web Sockets</h1>
  <p>This is a demo of the basic workings of SocketIO. Click <a>here</a> to view source code.</p>
  <p>Your UserID: <strong>hello</strong></p>
`



