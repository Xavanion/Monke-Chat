import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const isConnected = useRef(false);

    useEffect(() => {

    if (!isConnected.current){
        const newSocket = io(SOCKET_SERVER_URL, {
            withCredentials: true, // Ensure cross-origin requests work
        });


        newSocket.on("connect", () => {
            console.log("Connected with Socket ID:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from socket");
        });

        setSocket(newSocket);
        isConnected.current = true;

        return () => {
            newSocket.disconnect(); // Cleanup on unmount
            isConnected.current = false;
        };
    };
    }, []);

    return socket;
};
