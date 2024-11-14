const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");


const clients = new Map();

// Function to initialize the WebSocket server with Socket.IO
const initializeMessageServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        "https://artvista-market.web.app",
        "https://artvista-market.firebaseapp.com",
        "http://127.0.0.1:7000",
      ],
      credentials: true,
    },
  });

  // Socket.io middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token; // Get token from handshake
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, "SECRETKEY", (err, decoded) => { // Secret key for JWT verification
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.userId = decoded.id; // Store user ID in the socket object
      next();
    });
  });

  // Event listener for new client connections
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`User ${userId} connected`);

    // Store the socket connection by user ID
    clients.set(userId, socket);

    // Event listener for chat messages
    socket.on("sendMessage", (data) => {
      const { recipientId, message } = data;
      const recipientSocket = clients.get(recipientId);
      
      if (recipientSocket) {
        // Emit the message to the recipient socket
        recipientSocket.emit("receiveMessage", { senderId: userId, message });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      clients.delete(userId); // Remove from clients map
      console.log(`User ${userId} disconnected`);
    });
  });
};

module.exports = { initializeMessageServer, clients };
