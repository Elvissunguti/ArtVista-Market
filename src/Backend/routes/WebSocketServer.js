const { WebSocketServer } = require("ws");

const createWebSocketServer = () => {
  const wss = new WebSocketServer({ noServer: true });
  const clients = new Map();

  wss.on("headers", (headers, req) => {
    headers.push("Access-Control-Allow-Origin: *");
    headers.push("Access-Control-Allow-Headers: *");
  });

  wss.on("connection", (ws, req) => {
    const userId = req.user._id;
    clients.set(userId, ws);

    ws.on("close", () => {
      clients.delete(userId);
      console.log(`WebSocket connection closed for user ${userId}`);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
    });

    console.log(`WebSocket connection opened for user ${userId}`);
  });

  return { wss, clients };
};

module.exports = createWebSocketServer;
