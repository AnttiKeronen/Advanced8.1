import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import { registerValidation, loginValidation } from '../validators/inputValidation';
const router = express.Router();
interface RegisterBody {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}
interface LoginBody {
  email: string;
  password: string;
}
router.post(
  '/register',
  registerValidation,
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());
    const { username, email, password, isAdmin } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(403).json({ message: 'Email already in use.' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      });
      await newUser.save();
      res.json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
router.post(
  '/login',
  loginValidation,
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: 'Incorrect password.' });
      const token = jwt.sign(
        { _id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.SECRET as string,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
export default router;
