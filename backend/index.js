import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import db from './src/database/db.js';


// import userRoutes from './routes/userRoutes.js';
import authRoutes from "./src/routes/auth.js"
import forgotPasswordRouters from './src/routes/forgotPassword.js'
import notificationRoutes from './src/routes/notification.js'
import userRoutes from "./src/routes/user.js"
dotenv.config();

const app = express();

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
 
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
// app.use('/api/users', userRoutes);

// Routes....
app.use("/api/auth", authRoutes);
app.use("/api/forgot", forgotPasswordRouters)
app.use("/api/notification",notificationRoutes)
app.use("/api/user",userRoutes)

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js API for React Native App!');
});





// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
