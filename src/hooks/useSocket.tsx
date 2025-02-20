import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, {
            withCredentials: true, // Ensure cross-origin requests work
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Cleanup on unmount
        };
    }, []);

    return socket;
};
