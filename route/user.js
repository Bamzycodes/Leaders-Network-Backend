import express from 'express';
import bcrypt from 'bcryptjs'
import User from '../model/user.js';
import { generateToken } from '../utils.js';


const user = express.Router();


user.post('/signin', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
      if (bcrypt.compare(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user)
        });
        return;
      }
  }
     res.status(401).send({message: 'invalid email and password'})
}
);

user.post(
  "/signup",
  async (req, res) => {
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const userExist = await User.findOne({ email: req.body.email });
    if(userExist){
      res.status(400).send({message: "Email already exists..."});
    }

      const user = await newUser.save();
      res.send({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user),
      });


  });

export default user;