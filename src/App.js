import './App.css';
import io from 'socket.io-client'
import React from "react"
import Chats from './components/Chats';

const socket=io.connect("http://localhost:3001")

function App() {

  const [room, setRoom] = React.useState("")


  const joinRoom=()=>{
    if(room!==""){
      socket.emit("join_room",room)
    }
  };

  

  return (
    <div className="App">
      <h1>
        {socket.id}
      </h1>
<input placeholder='Room number:' 
     onChange={(event)=>{
      setRoom(event.target.value)
     }}/>
     <button onClick={joinRoom}>Join Room</button>

     <Chats socket={socket} room={room} />
    </div>
  );
}

export default App;
