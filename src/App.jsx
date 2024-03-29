import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';



const API_KEY = "Your_API key";

function App() {

  
  const [typing , setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello , ji",
      sender:"ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message:message,
      sender:"user",
      direction:"outgoing"
    }

    const newMessages = [ ...messages , newMessage];
    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGpt(newMessages);
  }


  async function processMessageToChatGpt(chatmessages){
      
    let apiMessages = chatmessages.map((messageObject) => {
        let role = "";
        if(messageObject.sender === "ChatGPT"){
          role="assistant"
        }else{
          role="user"
        }
        return {role:role , content:messageObject.message};
    });

    const systemMessage = {
      role:"system",
      content:"Explain all concepts like I am 10 years old. "
    }

    const apiRequestBody = {
      "model":"gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }


    await fetch("https://api.openai.com/v1/chat/completions" , {
        method:"POST",
        headers:{
          "Authorization" : "Bearer " + API_KEY,
          "Content-Type":"application/json"
        },
        body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatmessages , {
          message:data.choices[0].message.content,
          sender:"ChatGPT"
        }]
        );
        setTyping(false);
    })
  }


  return (
    <div className='App'>
        <div style={{position:"relative" , height:"600px" , width:"600px"}}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                 typingIndicator= {typing ? <TypingIndicator content="Chat gpt is typing" /> : null}
              >
                  {
                    messages.map((message , i) => (
                      <Message key={i} model={message}/>
                    ))
                  }
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={handleSend}/>
            </ChatContainer>
          </MainContainer>
        </div>
    </div>
  )
}

export default App
