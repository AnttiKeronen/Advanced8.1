import { Router, Request, Response } from 'express';
import Topic from '../models/Topic';
import { authenticateUser, authenticateAdmin } from '../middleware/validateToken';

const router = Router();
router.get('/topics', async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Error loading topics' });
  }
});
router.post('/topic', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing fields' });
    const newTopic = new Topic({
      title,
      content,
      username: req.user!.username,
      createdAt: new Date()
    });
    await newTopic.save();
    res.json(newTopic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
