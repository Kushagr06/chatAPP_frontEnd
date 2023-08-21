import './App.css';
import io from 'socket.io-client'
import React from "react"
import Chats from './components/Chats';

const socket=io.connect("http://localhost:3001")

function App() {

  const [room, setRoom] = React.useState("")
  const [id, setId]=React.useState([])
  const [left,setLeft]=React.useState([])

  const joinRoom=()=>{
    if(room!==""){
      socket.emit("join_room",room)
    }
  };

  
  // socket.on('joined_rooms',(data)=>{
  //   setId((list)=>[...list, data]);
  // });

  React.useMemo(() => {
  socket.on("newUser", (data) => {
    setId((list)=>[...list, `${data} just joined....`]); // world
  });
}, [])


  // socket.on("leftUser", (data) => {
  //   setId((list)=>[...list, `${data} has left...`]); // world
  // });

  

  return (
    <div className="App">
      <h1>
        {socket.id}
      </h1>
      {id.map((message)=>{
      return <h1>$_{message}</h1>;
     })}
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
