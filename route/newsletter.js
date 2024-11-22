import express from 'express';
import Newsletter from '../model/newsletter.js';


const newsletter = express.Router();


newsletter.post('/newsletter', async (req, res) => {
    const { email } = req.body;
  
    try {
  
      const newsletter = new Newsletter({
        email
      });
       await newsletter.save();
      res.status(201).json({ message: 'Newsletter subscribed successfully' });
     
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred while processing the file" });
    }
  });

export default newsletter;