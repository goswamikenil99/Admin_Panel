const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {authenticate}=require("./middlewares/Middleware")

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());

// Enable CORS for all routes
app.use(cors(
    {
        origin: "http://localhost:3000", // Replace with the allowed origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
));


app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/protected', authenticate, (req, res) => {
    res.json({ message: 'Access granted to protected route', user: req.user });
  });
  
  // Logout
  app.post('/api/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.json({ message: 'Logout successful' }); 
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
