const yargs = require("yargs");

const { port, root } = yargs
  .command("start", "Start the websocket server for component preview")
  .option("port", {
    alias: "p",
    description: "The port to run the server",
    type: "number",
    default: 5000,
  })
  .option("root", {
    alias: "r",
    description: "The projectRoot of your app code",
    type: "string",
  })
  .help()
  .alias("help", "h").argv;

require("./build/websocket-server.js").start({ port, root });
