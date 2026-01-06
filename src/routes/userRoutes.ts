import { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password, isAdmin } = req.body;

    if (!email || !username || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    // Palautetaan status 200 ja user + token
    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin },
      process.env.SECRET as string,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET as string,
      { expiresIn: '1d' }
    );

    // Palautetaan myös user-objekti, jotta frontend voi lukea isAdmin
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
