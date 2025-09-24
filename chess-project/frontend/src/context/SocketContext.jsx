// frontend/src/context/SocketContext.jsx

import React, { createContext, useContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const SocketContext = createContext(socket);

// This remains a named export
export function useSocket() {
  return useContext(SocketContext);
}

// 👇 Change this to a default export
export default function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}