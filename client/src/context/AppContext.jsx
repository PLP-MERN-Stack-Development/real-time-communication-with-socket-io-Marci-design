import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [presence, setPresence] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [connected, setConnected] = useState(false);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setUser_ = useCallback((u) => {
    setUser(u);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: setUser_,
        messages,
        addMessage,
        clearMessages,
        setMessages,
        presence,
        setPresence,
        typingUsers,
        setTypingUsers,
        connected,
        setConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
