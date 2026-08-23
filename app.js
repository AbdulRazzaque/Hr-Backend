const express = require("express");
const dotenv = require("dotenv");
const errorhandler = require("./middlewares/errorhandler");
const mongoose = require("mongoose");
const Route = require("./routes");
const path = require("path");
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const setUpExpiryNotifications = require("./controllers/Forms/notificationController");

// 📌 App and Server Initialization
const app = express();
const server = http.createServer(app);

// 📌 Environment Variables
dotenv.config({ path: "./config/.env" });

// 📌 Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', Route);
app.use('/uploads', express.static('uploads'));

// 📌 Global App Root
global.appRoot = path.resolve(__dirname);

// 📌 MongoDB Connection
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DATA_BASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Database Connected Successfully."))
  .catch((error) => console.error("❌ Database Connection Error:", error));

// 📌 Socket.io Setup
const io = socketIo(server, {
  cors: {

    origin: ['http://192.168.1.10:778', 'https://hr-backend-r6zm.onrender.com'], // Server Side
    // origin: 'http://192.168.1.98:3000', // Local Side)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    Credential: true
  },
});

// 📌 Socket.io Events
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });

  // Example Custom Event
  socket.on('chat message', (msg) => {
    console.log(`📩 Message received: ${msg}`);
    io.emit('chat message', msg); // Broadcast message to all clients
  });
});

// 📌 Qatar ID Expiry Job (Example Usage)
setUpExpiryNotifications.setUpExpiryNotifications(io);

// 📌 Error Handler Middleware
app.use(errorhandler);

// 📌 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 
