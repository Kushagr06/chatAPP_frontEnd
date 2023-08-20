import React, { useState } from 'react'

function Chats(props) {
  const [receivedM, setReceivedM] = React.useState([])
  const [message, setMessage] = React.useState("")

  // Listen for upcoming data
  React.useMemo(() => {
    props.socket.on("receive_m",(data)=>{
      setReceivedM((list)=>[...list, data]);
    });
    // return()=>{
    //   props.socket.off("recieve_m").off();
    // }
    }, [props.socket])

  
  const sendMessage=async()=>{
    if(message!==""){
      const MessageData={
        room: props.room,
        author:props.socket.id,
        message:message
      };
    await 
    props.socket.emit("send_m",MessageData);
    setReceivedM((list)=>[...list, MessageData]);
    setMessage("");
    }
  };

  
  


  return (
    <div>
        <input placeholder='Enter Message' 
     onChange={(event)=>{
      setMessage(event.target.value)
     }}/>
     <button onClick={sendMessage}>Send Message</button>
       <h1>Messages:</h1>
     {receivedM.map((message)=>{
      return <h1>{message.author}$_{message.message}</h1>;
     })}
    </div>
  )
}

export default Chats
