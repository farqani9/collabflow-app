import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initializeSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { channelId, userId } = socket.handshake.query;

    if (!channelId || !userId) {
      socket.disconnect();
      return;
    }

    console.log(`User ${userId} connected to channel ${channelId}`);

    // Join the channel room
    socket.join(channelId as string);

    socket.on("message", async (message) => {
      // Broadcast the message to all clients in the channel
      io.to(channelId as string).emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from channel ${channelId}`);
      socket.leave(channelId as string);
    });
  });

  return io;
};
