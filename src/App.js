import './App.css';
import io from 'socket.io-client'
import React,{useRef} from "react"
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

  const ref=useRef(null);
  const ScrolltoBottom=()=>{
    console.log(ref.current)
    ref.current?.scrollIntoView({behavior:'smooth'})
  }
  React.useEffect(()=>{
    ScrolltoBottom()
  },[id])
  

  

  return (
    <div className="App text-2xl bg-gray-900 m-0 flex-col min-h-[100vh] p-0 overflow-auto ">
      <div className=' flex justify-around mx-10 mb-10'>

      <div className='relative bg-gray-800 h-20 w-20 text-emerald-400 text-center p-5 text-xl font-semibold border-2 border-emerald-400 rounded-xl m-2 duration-300 mt-10'>

      <svg className='absolute ml-2' height="45px" width="45px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#34D399"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">  <g> <path class="st0" d="M341.942,356.432c-20.705-12.637-28.134-11.364-28.134-36.612c0-8.837,0-25.256,0-40.403 c11.364-12.62,15.497-11.049,25.107-60.597c19.433,0,18.174-25.248,27.34-47.644c7.471-18.238,1.213-25.632-5.08-28.654 c5.144-66.462,5.144-112.236-70.292-126.436c-27.344-23.437-68.605-15.48-88.158-11.569c-19.536,3.911-37.159,0-37.159,0 l3.356,31.49c-28.608,34.332-14.302,80.106-18.908,106.916c-6.002,3.27-11.416,10.809-4.269,28.253 c9.165,22.396,7.906,47.644,27.34,47.644c9.61,49.548,13.742,47.977,25.107,60.597c0,15.147,0,31.566,0,40.403 c0,25.248-8.581,25.683-28.133,36.612c-47.14,26.349-108.569,41.658-119.575,124.01C48.468,495.504,134.952,511.948,256,512 c121.048-0.052,207.528-16.496,205.517-31.558C450.511,398.09,388.519,384.847,341.942,356.432z"></path> </g> </g></svg>
      <h1  div className='absolute text-emerald-400 '> {num===""?0:num}</h1>
      </div>

      <div className=' bg-gray-800 h-20 w-auto text-emerald-400 text-center p-5 text-xl font-semibold border-2 border-emerald-400 rounded-xl m-2 duration-300 mt-10'>
      <input className='bg-gray-600 px-2' placeholder=' Enter User Name:' 
     onChange={(event)=>{
      setUserName(event.target.value)
     }}/>
      <h1 className='m-1 p-1 bg-gray-800 rounded-xl border-2 border-emerald-400'>
        Your Id: {socket.id?'<<'+socket.id+'>>'+userName:""}
      </h1>
     </div>
      
      <h1 className='flex justify-start bg-gray-800 h-20 w-auto text-emerald-400 text-center p-5 text-xl font-semibold border-2 border-emerald-400 rounded-xl m-2 duration-300 mt-10'>Current Room:&nbsp; 
      {roomno===""?"Lobby":  roomno}
      </h1>
          
     </div>
       
      <div className='flex justify-center mt-10' >

         {/* Join Room */}
     <div className='flex justify-center mx-10 bg-gray-800 h-24 w-1/2 text-emerald-400 text-center p-5 text-xl font-semibold border-2 border-emerald-400 rounded-xl m-auto duration-300  align-middle items-center'>
     <input className='bg-gray-600 px-2' placeholder='Room number:' 
     onChange={(event)=>{
      setRoom(event.target.value)
     }}/>
     <button disabled={userName===""?true:false} id={userName===""?"disabled-button":"enabled-button"} className=' bg-emerald-900 hover:bg-emerald-500 duration-300 text-gray-300 hover:text-gray-200 px-5 py-1 mx-2  rounded-xl' onClick={joinRoom}>Join Room</button>
     </div>

        {/* logs */}

       <div className='w-full relative m-auto mx-10'>
                    {/* Clear Button */}
    <button type="button" className=' absolute -left-8 -top-5  rounded-full w-10 h-10 bg-emerald-900 hover:bg-emerald-500 duration-200 text-gray-300 hover:text-gray-200' onClick={()=> setId('')}> &#x21bb;</button>

      <div className=' h-auto w-3/4 bg-gray-800 p-2 rounded-xl text-emerald-400  border-2 border-emerald-400 text-left'>
      <h2 className='border-2 p-2 border-emerald-400 rounded-xl'>Log:</h2>
      <div className='mt-2 text-center h-auto max-h-[10vh] overflow-auto min-h-[8vh] overflow-y-auto'>
      {id?
      id.map((message)=>{
      return <h4 id={message.includes("left")?'receiver':message.includes("you")?'your':'host'}>{ message}</h4>;
     })
    :""}
    <div ref={ref} />
     </div>
     </div>
     </div>
     </div>
     
    
   


     <Chats socket={socket} room={room} user={userName} />
     
    </div>
  );
}

export default App;
