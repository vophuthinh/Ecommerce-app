const app = require("./app");
const cloudinary = require("cloudinary");
const sequelize = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected...");
    //  return sequelize.sync({ alter: true })
  })
  .then(() => {
    console.log("All models synchronized successfully.");
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);
app.locals.io = io; // Gắn io vào app.locals

server.listen(process.env.PORT, () => {
  io.on("connect", () => console.log("connecting to io"));
  io.on("connection", (socket) => {
    console.log(" user connected");
    const userAgent = socket.handshake.headers["user-agent"];
    console.log("ip: " + socket.request.connection.remoteAddress);
    console.log("User Agent:", userAgent);
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
module.exports = {
  io,
};
