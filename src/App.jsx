// App.js
import { useState } from 'react';
import './App.css';
import MaterialUIChat from './MaterialUIChat';
import BarChart from './BarChart';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { Button } from '@mui/material';

const API_KEY = "sk-592d0WFGJYEQkBOWlXMBISXZarwhZOdyAqqY-4xE9pT3BlbkFJC3DLTTyBrRECu9pZANFtmQez-A_PC1opxyxS9MxKwA";

function App() {
  const [typing, setTyping] = useState(false);
  const [useMaterialUI, setUseMaterialUI] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);

  const [showChart, setShowChart] = useState(false);

  const handleToggleChart = () => {
    setShowChart(!showChart);
  };

  const handleLoadMaterialUI = () => {
    console.log("Button clicked!");
    setUseMaterialUI(true);
  };

  const handleSend = async (message) => {
    if (message.trim() === "") return;

    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old."
    };

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }]
      );
      setTyping(false);
    });
  }

  // Count messages from user and ChatGPT
  const userMessagesCount = messages.filter(msg => msg.sender === "user").length;
  const chatGptMessagesCount = messages.filter(msg => msg.sender === "ChatGPT").length;

  return (
    <div className="App">
      <div className="container">
        
        <div className="chat-section">
          {useMaterialUI ? (
            <MaterialUIChat messages={messages} typing={typing} handleSend={handleSend} />
          ) : (
            <MainContainer>
              <ChatContainer>
                <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}>
                  {messages.map((message, i) => (
                    <Message key={i} model={message} />
                  ))}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={handleSend} />
              </ChatContainer>
            </MainContainer>
          )}
          {/* Button to load Material UI version
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
            onClick={handleLoadMaterialUI}
          >
            Load Material UI Interface
          </Button>  */}
        </div>
        <div className="chart-section">
          

          {showChart && <BarChart userMessages={userMessagesCount} chatGptMessages={chatGptMessagesCount} />}
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggleChart}
            sx={{
              marginTop: 2,
            }}
          >
            {showChart ? 'Hide Bar Chart' : 'Show Bar Chart'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
