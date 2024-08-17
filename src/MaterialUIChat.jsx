// MaterialUIChat.js
import React from 'react';
import { Box, Container, Paper, TextField, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/system';

const defaultGrey = '#e0e0e0';
const defaultPrimary = '#1976d2';

const ChatContainerMUI = styled(Paper)({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  height: '70vh',
  overflowY: 'auto',
});

const MessageBox = styled(Box)(({ theme, sender }) => ({
  padding: '10px 15px',
  borderRadius: '20px',
  margin: '10px 0',
  maxWidth: '60%',
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  backgroundColor: sender === 'user' ?(theme?.palette?.primary?.main || defaultPrimary) : (defaultGrey),
  color: sender === 'user' ? '#fff' : '#000',
}));

const TypingIndicatorMUI = styled(Typography)({
  alignSelf: 'flex-start',
  fontStyle: 'italic',
  color: 'gray',
  marginBottom: '10px',
});

function MaterialUIChat({ messages, typing, handleSend }) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          ChatGPT Chatbot
        </Typography>

        <ChatContainerMUI elevation={3}>
          {messages.map((message, i) => (
            <MessageBox key={i} sender={message.sender}>
              {message.message}
            </MessageBox>
          ))}
          {typing && <TypingIndicatorMUI>ChatGPT is typing...</TypingIndicatorMUI>}
        </ChatContainerMUI>

        <Box display="flex" mt={2} backgroundColor="white" borderRadius= '6px'>
          <TextField
            fullWidth
            placeholder="Type your message here..."
            variant="outlined"
            
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={() => {
              const input = document.querySelector('input');
              handleSend(input.value);
              input.value = '';
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
}

export default MaterialUIChat;
