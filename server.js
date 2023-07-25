const WebSocket = require("ws");
var os = require("os");
var pty = require("node-pty");

const wss = new WebSocket.Server({ port: 8000 });

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";
var ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cwd: process.env.HOME,
  env: process.env,
  echo: false,
});
wss.on("connection", (ws) => {
  ptyProcess.write(`Successfully connected to ${shell}`);
  ws.on("message", (command) => {
    ptyProcess.write(command);
  });

  ptyProcess.on("data", function (data) {
    ws.send(data);
    console.log(data);
  });
});
