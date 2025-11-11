import React, { useEffect, useRef, useState, useContext } from 'react';
import { socket } from './socket/socket';
import LoginRegister from './components/LoginRegister';
import Chat from './components/Chat';
import { AppContext } from './context/AppContext';
import authService from './services/authService';
import './App.css';

export default function App() {
  const {
    user,
    setUser,
    messages,
    setMessages,
    presence,
    setPresence,
    typingUsers,
    setTypingUsers,
    connected,
    setConnected,
  } = useContext(AppContext);

  const messageRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = authService.getUser();
    const token = authService.getToken();
    if (storedUser && token) {
      setUser(storedUser);
      // Connect socket with token
      connectSocket(token);
    }
  }, [setUser]);

  // Handle user authentication
  const handleAuthSuccess = (user, token) => {
    setUser(user);
    connectSocket(token);
  };

  // Connect socket with authentication
  const connectSocket = (token) => {
    socket.auth = { token };
    socket.connect();
    socket.emit('user_join', user?.username || 'Anonymous');
  };

  // Handle logout
  const handleLogout = () => {
    socket.disconnect();
    authService.logout();
    setUser(null);
    setMessages([]);
    setPresence([]);
    setTypingUsers({});
  };

  // Send message
  const handleSendMessage = (text) => {
    if (text.trim()) {
      socket.emit('send_message', { text });
    }
  };

  // Typing indicator
  useEffect(() => {
    const inputEl = document.getElementById('msginput');
    if (!inputEl) return;

    const handleInput = () => {
      socket.emit('typing', true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', false);
      }, 1000);
    };

    inputEl.addEventListener('input', handleInput);

    return () => {
      inputEl.removeEventListener('input', handleInput);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      console.log('Connected to server');
    };

    const onDisconnect = () => {
      setConnected(false);
      console.log('Disconnected from server');
    };

    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onUserList = (userList) => {
      setPresence(userList);
    };

    const onUserJoined = (userData) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'System',
          message: `${userData.username} joined the chat`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ]);
    };

    const onUserLeft = (userData) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'System',
          message: `${userData.username} left the chat`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ]);
    };

    const onTypingUsers = (typingUserList) => {
      const typingObj = {};
      typingUserList.forEach((username) => {
        typingObj[username] = true;
      });
      setTypingUsers(typingObj);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
    };
  }, [setConnected, setMessages, setPresence, setTypingUsers]);

  if (!user) {
    return <LoginRegister onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Chat
      user={user}
      connected={connected}
      messages={messages}
      presence={presence}
      typingUsers={typingUsers}
      onSendMessage={handleSendMessage}
      onLogout={handleLogout}
      messageRef={messageRef}
    />
  );
}