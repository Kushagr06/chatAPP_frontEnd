import React,{useRef} from 'react'

function Chats(props) {
  const [receivedM, setReceivedM] = React.useState([])
  const [message, setMessage] = React.useState("")
  const [style, setStyle]=React.useState({})

  // Listen for upcoming data
  React.useMemo(() => {
    props.socket.on("receive_m",(data)=>{
      setReceivedM((list)=>[...list, data]);
    });
    // return()=>{
    //   props.socket.off("recieve_m").off();
    // }
    props.socket.on("downloading_chats",(user)=>{

      setReceivedM((list)=>[...list, {room:props.room, author:"", message:`Warning! User:${user} has downloaded the chats`}]);
    });

    props.socket.on("clear_chats",()=>{
      setReceivedM('')
    });
    }, [props.socket])

  
  const sendMessage=async(e)=>{
    document.getElementById('inputBar').value=" ";
    e.preventDefault();
    if(message!==""){
      const MessageData={
        room: props.room,
        author:props.user,
        message:message
      };
    await 
    props.socket.emit("send_m",MessageData);
    setReceivedM((list)=>[...list, MessageData]);
    }
   setMessage("") 
  };


  // Auto scroll to bottom
  const ref = useRef(null);
  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth"})
  }
  
  React.useEffect(() => {
    scrollToBottom()
  }, [receivedM]);

  


  return (
    <div className='mt-10 bg-gray-900 flex flex-col h-auto'>

      {/* Message Input Field */}
      
      <div >
        <form onSubmit={sendMessage} className='flex justify-center my-5'>

          {/* download chats */}
        <button type="button" id={props.user!==""?"enabled-button":"disabled-button"} disabled={props.user!==""?false:true} className=' bg-emerald-900 hover:bg-emerald-500 duration-300 text-gray-300 hover:text-gray-200 px-5 py-1  rounded-xl' onClick={()=>{
          
          
          props.socket.emit("download_chats",props.user)
          var data=[...receivedM]
          console.log(data)
          const element = document.createElement("a");
          const file = new Blob([JSON.stringify(data)], {type: 'text/json'});
          element.href = URL.createObjectURL(file);
          element.download = "ChatLogs.txt";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        }
        }>
         
         <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H12M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17.5 15V21M17.5 21L15 18.5M17.5 21L20 18.5" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>

          {/* Input field */}
        <input
        id="inputBar"
        style={style} 
        placeholder='Enter Message'
        className='bg-gray-600 mx-2 w-1/2 duration-200 max-h-32 h-auto overflow-x-scroll overflow-visible  border-2 text-gray-100 px-2' 
     onChange={(event)=>{
      if(event.target.value==='')
        setStyle({border:'1px solid gray'});
      else
        setStyle({border:'2px solid #34d399'});
        setMessage(event.target.value)
     }}/>

     <button type="submit" className=' bg-emerald-900 hover:bg-emerald-500 duration-300 text-gray-300 hover:text-gray-200 px-5 py-1  rounded-xl' >

     <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
     </button>
     </form>
     </div>



     {/* Messages */}
     <div className=' bg-gray-900 mb-auto relative'>
      {/* Clear Button */}
      <button type="button" className=' rounded-full w-10 h-10 bg-emerald-900 absolute right-8 top-2 hover:bg-emerald-500 duration-200 text-gray-300 hover:text-gray-200' onClick={()=> setReceivedM('')}> &#x21bb;</button>
     <div className=' flex-col flex-grow m-10 border-4  border-emerald-400 rounded-xl  p-2 bg-gray-800 overflow-y-auto min-h-[25vh] max-h-[35vh]'>
       <h1 className='text-emerald-400 text-left border-2 rounded-xl p-2 border-emerald-400'>Messages:</h1>
       <div id="Messages">
    {receivedM?
     receivedM.map((message)=>{
      return <h2 className='text-left my-2'> <span id={props.user===message.author?'host':'receiver'}>{message.author}{':> '}{message.message}</span></h2>;
     })
    :""}
     <div ref={ref} />
     </div>
    </div>
    </div>
    </div>
  )
}

export default Chats
