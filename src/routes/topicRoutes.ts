import { Router, Request, Response } from 'express';
import Topic from '../models/Topic';
import { authenticateUser, authenticateAdmin } from '../middleware/validateToken';

const router = Router();

// GET all topics
router.get('/topics', async (req: Request, res: Response) => {
  const topics = await Topic.find();
  res.status(200).json(topics);
});

// POST new topic
router.post('/topic', authenticateUser, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Missing fields' });

  const newTopic = new Topic({ title, content, username: req.user!.username });
  await newTopic.save();
  res.status(200).json(newTopic);
});

// DELETE topic (admin only)
router.delete('/topic/:id', authenticateAdmin, async (req: Request, res: Response) => {
  const topic = await Topic.findByIdAndDelete(req.params.id);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });
  res.status(200).json({ message: 'Topic deleted successfully.' });
});

export default router;
