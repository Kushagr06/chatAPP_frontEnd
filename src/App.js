import './App.css';
import io from 'socket.io-client'
import React from "react"

const socket=io.connect("http://localhost:3001")

function App() {

  const [message, setMessage] = React.useState("")
  const [receivedM, setReceivedM] = React.useState("")
  const [room, setRoom] = React.useState("")

  const joinRoom=()=>{
    if(room!==""){
      socket.emit("join_room",room)
    }
  };

  const sendMessage=()=>{
    if(message!=="")
    socket.emit("send_m",{message,room})
  };

  // Listen for upcoming data
  React.useEffect(() => {
  socket.on("receive_m",(data)=>{
    setReceivedM(data.message)
  })
  }, [socket])


  return (
    <div className="App">

<input placeholder='Room number:' 
     onChange={(event)=>{
      setRoom(event.target.value)
     }}/>
     <button onClick={joinRoom}>Join Room</button>

     <input placeholder='Enter Message' 
     onChange={(event)=>{
      setMessage(event.target.value)
     }}/>
     <button onClick={sendMessage}>Send Message</button>

     <h1>Messages:</h1>
     {receivedM}
    </div>
  );
}

export default App;
