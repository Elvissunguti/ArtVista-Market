const socketIo = require("socket.io");
const passportSocketIo = require("passport.socketio");

// Define onAuthorizeSuccess function
function onAuthorizeSuccess(data, accept) {
  console.log("Successful WebSocket connection authentication.");
  accept();
}

// Define onAuthorizeFail function
function onAuthorizeFail(data, message, error, accept) {
  console.error("Failed WebSocket connection authentication:", message);
  if (error) {
    accept(new Error(message));
  } else {
    // If no error, continue without accepting
    accept(null, false);
  } 
}

const createWebSocketServer = (httpServer, sessionStore) => {
  const io = socketIo(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const clients = new Map();

  io.use((socket, next) => {
    // Passport authentication middleware for Socket.io
    passportSocketIo.authorize({
      cookieParser: require("cookie-parser"),
      key: "connect.sid",
      secret: "SECRETKEY",
      store: sessionStore,
      success: onAuthorizeSuccess,  // Reference the onAuthorizeSuccess function
      fail: onAuthorizeFail,
    })(socket.request, {}, next);
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Accessing authenticated user
    const userId = socket.request.user ? socket.request.user._id : null;
    console.log("userId", userId);

    clients.set(userId, socket);

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("User disconnected");
      clients.delete(userId);
    });

    // Additional logging for debugging
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return { io, clients };
};

module.exports = createWebSocketServer;
