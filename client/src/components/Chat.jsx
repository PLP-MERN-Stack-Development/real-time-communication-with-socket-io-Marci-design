import React from 'react';

export default function Chat({
  user,
  connected,
  messages,
  presence,
  typingUsers,
  onSendMessage,
  onLogout,
  messageRef,
}) {
  const handleSendMessage = () => {
    if (messageRef.current.value.trim()) {
      onSendMessage(messageRef.current.value);
      messageRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Chat</h2>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            ✕
          </button>
        </div>

        <div className="user-info">
          <div className="username">
            <strong>{user.username}</strong>
          </div>
          <div className="status">
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="users-section">
          <h4>Online Users ({presence.length})</h4>
          <ul className="users-list">
            {presence.map((p) => (
              <li key={p.username} className="user-item">
                <span className="status-dot online"></span>
                <span className="user-name">
                  {p.username}
                  {p.username === user.username ? ' (you)' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="chat-main">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`message ${m.sender === user.username ? 'own-message' : 'other-message'}`}
              >
                <div className="message-content">
                  <div className="message-sender">{m.sender}</div>
                  <div className="message-text">{m.message || m.text}</div>
                  <div className="message-time">
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {Object.keys(typingUsers).filter((u) => u !== user.username).length > 0 && (
          <div className="typing-indicator">
            <span>
              {Object.keys(typingUsers)
                .filter((u) => u !== user.username)
                .join(', ')}{' '}
              typing...
            </span>
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div className="composer">
          <input
            id="msginput"
            className="message-input"
            type="text"
            placeholder="Type a message..."
            ref={messageRef}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
