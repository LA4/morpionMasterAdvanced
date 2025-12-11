const websocket = require("ws");

const wss = new websocket.Server({ port: 8080 });
console.log("server is running on port 8080");

wss.on("connection", (ws) => {
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === websocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
  // THe server create the connection
  console.log(" A user as joined the room");

  ws.send(JSON.stringify({ type: "message", content: "Welcome ! " }));
  
  ws.on("message", (msg) => {

    // The server detects that a user sent a message
    const data = JSON.parse(msg);
    ws.user = data.user;
    console.log(ws);
    broadcast(data);
  });
  ws.on("close", () => {
    broadcast({ type: "leave", user: ws.user, content: "has left the room" });
  });
});

