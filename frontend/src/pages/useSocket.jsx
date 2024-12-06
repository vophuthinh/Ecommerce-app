import { useEffect, useState } from 'react';
import io from 'socket.io-client'
export const socket = io('http://localhost:8000', {
    transports: ['websocket', 'pulling', 'flashsocket']
  })
const useSocket = () => {
    const [response, setResponse] = useState(null);
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });
        socket.on('responseEvent', (data) => {
            console.log('Data received:', data);
            setResponse(data);
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        return () => {
            socket.disconnect();
        };
    }, []);
    const triggerEvent = (data) => {
        socket.emit('triggerEvent', data);
    };
    return { response, triggerEvent };
};

export default useSocket;
