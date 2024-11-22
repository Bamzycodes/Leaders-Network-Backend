import dotenv from 'dotenv';  
import express from 'express';  
import mongoose from 'mongoose';  
import cors from 'cors';  
import user from './route/user.js';  
import cookieParser from 'cookie-parser';  
import blog from './route/blog.js';  
import newsletter from './route/newsletter.js';
dotenv.config();
 

const app = express();  
app.use(express.json());  
app.use(cookieParser());  
app.use(cors());  


app.use('/api/user/', user);  
app.use('/api/blog', blog);  
app.use('/api', newsletter);  

// Connect to MongoDB  
mongoose.connect(process.env.MONGODB_URL, {  
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
    serverSelectionTimeoutMS: 5000,   
    socketTimeoutMS: 45000,  
})  
  .then(() => {  
    console.log('connected to db');  
  })  
  .catch((err) => {  
    console.log(err.message);  
  });  

const PORT = process.env.PORT || 8080;  
app.listen(PORT, () => {  
    console.log('server is running on port', PORT);  
}); 
