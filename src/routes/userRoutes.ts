import { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerValidation, loginValidation } from '../validators/inputValidation';
import { validationResult } from 'express-validator';

const router = Router();

// REGISTER
router.post('/register', registerValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { email, username, password, isAdmin } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(403).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, username, password: hashedPassword, isAdmin });
  await newUser.save();

  res.status(200).json(newUser);
});

// LOGIN
router.post('/login', loginValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign(
    { _id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin } });
});

export default router;
