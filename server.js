const WebSocket = require("ws");
var os = require("os");
var pty = require("node-pty");

const wss = new WebSocket.Server({ port: 3000 });

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";
var ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cwd: process.env.HOME,
  env: process.env,
  echo: false,
});
wss.on("connection", (ws) => {
  const username = os.userInfo().username;
  const hostname = os.hostname();

  ws.send(`[${username}@${hostname} ~]$ `);

  ws.on("message", (command) => {
    ptyProcess.write(command);
  });

  ws.on("close", () => console.log("closed"));

  ptyProcess.on("data", function (data) {
    ws.send(data);
    console.log(data);
  });
});
