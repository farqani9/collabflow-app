import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { prisma } from "./prisma";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join-channel", (channelId: string) => {
        socket.join(channelId);
        console.log(`User joined channel: ${channelId}`);
      });

      socket.on("leave-channel", (channelId: string) => {
        socket.leave(channelId);
        console.log(`User left channel: ${channelId}`);
      });

      socket.on(
        "send-message",
        async (data: {
          content: string;
          channelId: string;
          userId: string;
        }) => {
          try {
            const message = await prisma.message.create({
              data: {
                content: data.content,
                channelId: data.channelId,
                userId: data.userId,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            });

            io.to(data.channelId).emit("new-message", message);
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      );

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return res.socket.server.io;
};
