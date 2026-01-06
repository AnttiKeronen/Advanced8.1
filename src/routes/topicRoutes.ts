import { Router, Request, Response } from 'express';
import Topic from '../models/Topic';
import { authenticateUser, authenticateAdmin } from '../middleware/validateToken';

const router = Router();

// GET ALL TOPICS
router.get('/topics', async (_req: Request, res: Response) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Error loading topics' });
  }
});

// CREATE TOPIC (USER)
router.post('/topic', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const newTopic = new Topic({
      title,
      content,
      username: req.user!.username,
      createdAt: new Date()
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE TOPIC (ADMIN)
router.delete(
  '/topic/:id',
  authenticateUser,
  authenticateAdmin,
  async (req: Request, res: Response) => {
    try {
      const topic = await Topic.findById(req.params.id);

      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      await topic.deleteOne();
      res.json({ message: 'Topic deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
