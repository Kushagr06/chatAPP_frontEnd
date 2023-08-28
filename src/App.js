import './App.css';
import io from 'socket.io-client'
import React from "react"
import Chats from './components/Chats';

const socket=io.connect("http://localhost:3001")

function App() {

  const [room, setRoom] = React.useState("")
  const [userName, setUserName] = React.useState("")
  const [roomno, setRoomno] = React.useState("")
  const [id, setId]=React.useState([])
  const [num, setNum]=React.useState("")

  const joinRoom=()=>{
    if(room!==""&& userName!==""){
      socket.emit("join_room",room,userName)
      socket.on("Number",(data)=>{
        setNum(data)
        setRoomno(room)
      })
    }
    
  };

  
  // socket.on('joined_rooms',(data)=>{
  //   setId((list)=>[...list, data]);
  // });
  React.useMemo(()=>{
    socket.on("Number",(data)=>{
      setNum(data)
      
    })
  },[])

  React.useMemo(() => {
  socket.on("newUser", (data,name) => {
    setId((list)=>[...list, 
      data===socket.id?
      `${'<<'+data+'>>'+name}(you) just joined....`
      :
      `${'<<'+data+'>>'+name} joined the room`
    ]); // world
  });
}, [])


  React.useMemo(()=>{
    socket.on("disconnected_user",(id,user,no)=>{
      setId((list)=>[...list,
        `${'<<'+id+'>>'+user} has left the room`
      ]);
      setNum(no)
    })
  },[])
  

  

  return (
    <div className="App">
      <h1>Participants: {num}</h1>
      <h1>Current Room: {roomno}</h1>

      <h1>Enter Username:</h1>
<input placeholder='User Name:' 
     onChange={(event)=>{
      setUserName(event.target.value)
     }}/>
     
      <h1>
        id: {'<<'+socket.id+'>>'+userName}
      </h1>
      {id.map((message)=>{
      return <h4>$_{message}</h4>;
     })}

  
<input placeholder='Room number:' 
     onChange={(event)=>{
      setRoom(event.target.value)
     }}/>
     <button onClick={joinRoom}>Join Room</button>
     

     <Chats socket={socket} room={room} user={userName} />
     
    </div>
  );
}

export default App;
