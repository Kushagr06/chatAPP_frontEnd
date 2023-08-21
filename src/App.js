import './App.css';
import io from 'socket.io-client'
import React from "react"
import Chats from './components/Chats';

const socket=io.connect("http://localhost:3001")

function App() {

  const [room, setRoom] = React.useState("")
  const [id, setId]=React.useState([])
  const [num, setNum]=React.useState("")

  const joinRoom=()=>{
    if(room!==""){
      socket.emit("join_room",room)
      socket.on("Number",(data)=>{
        setNum(data)
      })
    }
    
  };

  
  // socket.on('joined_rooms',(data)=>{
  //   setId((list)=>[...list, data]);
  // });

  React.useMemo(() => {
  socket.on("newUser", (data) => {
    setId((list)=>[...list, 
      data===socket.id?
      `${data}(you) just joined....`
      :
      `${data} just joined....`
    ]); // world
  });
}, [])


  socket.on("disconnect",()=>{
    setNum(num-1)
  })

  

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
     <h1>Number: {num}</h1>

     <Chats socket={socket} room={room} />
     
    </div>
  );
}

export default App;
