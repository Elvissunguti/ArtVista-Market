const socketIo = require("socket.io");
const jwtUtils = require("../Utils/Helpers"); // Token helpers
const firebaseAdmin = require("firebase-admin");
const passportSocketIo = require("passport.socketio");

const createWebSocketServer = (httpServer) => {
  const io = socketIo(httpServer, {
    cors: {
      origin: [
        "https://artvista-market.web.app",
        "https://artvista-market.firebaseapp.com",
        "http://127.0.0.1:7000",
      ], 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const clients = new Map();

  // Middleware to authenticate WebSocket connection using JWT token
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token; // JWT token passed by the client

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify the token using the helper functions
      const decodedToken = jwtUtils.verifyToken(token);

      if (!decodedToken) {
        return next(new Error("Authentication error: Invalid token"));
      }

      socket.user = decodedToken; // Attach the decoded user to the socket object

      clients.set(decodedToken.identifier, socket); // Map the user ID to the socket connection

      next(); // Proceed with connection
    } catch (error) {
      console.error("Authentication error:", error);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user.identifier);

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.identifier);
      clients.delete(socket.user.identifier); // Clean up the map
    });

    // Handle real-time messaging
    socket.on("newMessage", (messageData) => {
      const { recipientId, message } = messageData;

      const recipientSocket = clients.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit("newMessage", messageData);  // Emit message to recipient if connected
      }
    });

    // Additional logging for debugging
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return { io, clients };
};

module.exports = createWebSocketServer;
