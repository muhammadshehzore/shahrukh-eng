// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Only proxy /ws/chat/* to Django Channels
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url);

    if (pathname.startsWith("/ws/chat/")) {
      const backendWs = new WebSocket(`ws://127.0.0.1:8000${pathname}`);

      backendWs.on("open", () => {
        socket.write(
          "HTTP/1.1 101 Switching Protocols\r\n" +
          "Connection: Upgrade\r\n" +
          "Upgrade: websocket\r\n" +
          "\r\n"
        );
        backendWs._socket.pipe(socket).pipe(backendWs._socket);
      });

      backendWs.on("error", (err) => {
        console.error("Backend WS error:", err.message);
        socket.end();
      });

      return;
    }

    // If not /ws/chat/*, just destroy socket
    socket.destroy();
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Next.js ready on http://localhost:${port}`);
  });
});
